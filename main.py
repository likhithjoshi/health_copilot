"""Health Copilot - FastAPI backend. Run: uvicorn main:app --reload --port 8000"""
import base64, hashlib, hmac, json, os, re, secrets, uuid
from datetime import date
from pathlib import Path
from fastapi import Depends, FastAPI, File, Form, Header, HTTPException, UploadFile
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()
MODEL = os.getenv("CLAUDE_MODEL", "claude-sonnet-4-6")
KEY = os.getenv("ANTHROPIC_API_KEY")
client = None
if KEY:
    import anthropic
    client = anthropic.Anthropic(api_key=KEY)

DB = Path("data.json")  # simple JSON storage; swap for SQLite later
app = FastAPI(title="Health Copilot")
LANG = {"en": "English", "hi": "Hindi", "gu": "Gujarati", "te": "Telugu"}

def load():
    return json.loads(DB.read_text()) if DB.exists() else {}
def save(d):
    DB.write_text(json.dumps(d, indent=1))

EXTRACT = """Read this medical document. Return ONLY JSON, no other text:
{"doc_type":"lab_report"|"prescription","report_date":"YYYY-MM-DD or null","lab":"name or null",
"tests":[{"name":str,"value":number,"unit":str,"ref_low":number|null,"ref_high":number|null}],
"medicines":[{"name":str,"dose":str,"frequency":str,"duration":str}]}
Use empty lists if not applicable. Never guess missing values."""

SAFETY = """You are a health information assistant, not a doctor. Never diagnose.
Never tell the user to start, stop or change a medicine. Use very simple words.
Always end by suggesting they confirm with their doctor. Emergency symptoms: tell them to call 112."""

EMERGENCY = ["chest pain", "can't breathe", "cannot breathe", "trouble breathing", "face droop",
             "slurred speech", "suicide", "kill myself", "want to die", "छाती में दर्द", "सांस"]

def ask(system, content, max_tokens=1500):
    r = client.messages.create(model=MODEL, max_tokens=max_tokens, system=system,
                               messages=content if isinstance(content, list) and content and "role" in content[0]
                               else [{"role": "user", "content": content}])
    return "".join(b.text for b in r.content if b.type == "text")

def status_of(v, lo, hi):  # our own check - never trust the AI alone
    if lo is not None and v < lo: return "low"
    if hi is not None and v > hi: return "high"
    return "normal"

SAMPLE_LAB = {"doc_type": "lab_report", "report_date": "2024-10-12", "lab": "Sample Lab (fake data)",
 "tests": [
  {"name": "HbA1c", "value": 6.8, "unit": "%", "ref_low": 4.0, "ref_high": 5.6},
  {"name": "Fasting Glucose", "value": 118, "unit": "mg/dL", "ref_low": 70, "ref_high": 99},
  {"name": "LDL Cholesterol", "value": 142, "unit": "mg/dL", "ref_low": 0, "ref_high": 100},
  {"name": "Hemoglobin", "value": 12.9, "unit": "g/dL", "ref_low": 13.0, "ref_high": 17.0}], "medicines": []}
SAMPLE_RX = {"doc_type": "prescription", "report_date": "2024-10-14", "lab": "Sample Clinic (fake data)", "tests": [],
 "medicines": [{"name": "Metformin 500mg", "dose": "1 tablet", "frequency": "Twice daily after meals", "duration": "3 months"},
  {"name": "Amlodipine 5mg", "dose": "1 tablet", "frequency": "Once daily morning", "duration": "3 months"},
  {"name": "Atorvastatin 10mg", "dose": "1 tablet", "frequency": "Once daily at night", "duration": "3 months"}]}

def demo_explain(x):
    if x["doc_type"] == "lab_report":
        lines = [f"- {t['name']}: {t['value']} {t['unit']} ({t['status'].upper()})" for t in x["tests"]]
        return ("Here is your report in simple words (demo mode):\n" + "\n".join(lines) +
                "\n\nValues marked HIGH or LOW are outside the usual range. This does not mean a disease by itself.\n"
                "Questions for your doctor:\n1. What do these flagged values mean for me?\n2. Should I repeat the test, and when?\n"
                "3. Are any lifestyle changes useful for me?\n\nPlease confirm everything with your doctor.")
    lines = [f"- {m['name']}: {m['dose']}, {m['frequency']}" for m in x["medicines"]]
    return ("Your prescription lists (demo mode):\n" + "\n".join(lines) +
            "\n\nQuestions for your doctor:\n1. What is each medicine for?\n2. What side effects should I watch for?\n"
            "3. When is my next check-up?\n\nPlease confirm with your doctor or pharmacist.")

# ---------- accounts (users.json) ----------
USERS = Path("users.json")  # {"users": {id: {...}}, "sessions": {token: user_id}}

def load_users():
    return json.loads(USERS.read_text()) if USERS.exists() else {"users": {}, "sessions": {}}
def save_users(d):
    USERS.write_text(json.dumps(d, indent=1))

def hash_pw(pw, salt):
    return hashlib.pbkdf2_hmac("sha256", pw.encode(), bytes.fromhex(salt), 200_000).hex()

def current_user(authorization: str = Header(default="")):
    token = authorization.removeprefix("Bearer ").strip()
    u = load_users()
    uid = u["sessions"].get(token)
    if not uid or uid not in u["users"]:
        raise HTTPException(401, "Please log in to continue.")
    return u["users"][uid]

def public(user):
    return {"id": user["id"], "name": user["name"], "email": user["email"], "age": user.get("age")}

def new_session(db, uid):
    token = secrets.token_urlsafe(32)
    db["sessions"][token] = uid
    save_users(db)
    return token

class SignupIn(BaseModel):
    name: str
    email: str
    password: str
    age: int | None = None
    consent: bool = False

class LoginIn(BaseModel):
    email: str
    password: str

@app.post("/api/signup")
def signup(b: SignupIn):
    email = b.email.strip().lower()
    if not b.name.strip(): raise HTTPException(400, "Please enter your name.")
    if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email): raise HTTPException(400, "Please enter a valid email address.")
    if len(b.password) < 8: raise HTTPException(400, "Password must be at least 8 characters.")
    if not b.consent: raise HTTPException(400, "Please accept the consent notice to create an account.")
    db = load_users()
    if any(u["email"] == email for u in db["users"].values()):
        raise HTTPException(409, "An account with this email already exists. Try logging in.")
    salt = secrets.token_hex(16)
    uid = uuid.uuid4().hex[:10]
    db["users"][uid] = {"id": uid, "name": b.name.strip(), "email": email, "age": b.age,
                        "salt": salt, "pw": hash_pw(b.password, salt), "created": str(date.today())}
    return {"token": new_session(db, uid), "user": public(db["users"][uid])}

@app.post("/api/login")
def login(b: LoginIn):
    db = load_users()
    u = next((x for x in db["users"].values() if x["email"] == b.email.strip().lower()), None)
    if not u or not hmac.compare_digest(u["pw"], hash_pw(b.password, u["salt"])):
        raise HTTPException(401, "Wrong email or password.")
    return {"token": new_session(db, u["id"]), "user": public(u)}

@app.post("/api/logout")
def logout(authorization: str = Header(default="")):
    db = load_users()
    db["sessions"].pop(authorization.removeprefix("Bearer ").strip(), None)
    save_users(db)
    return {"ok": True}

@app.get("/api/me")
def me(user=Depends(current_user)):
    return public(user)

def make_record(fname, ex, lang):
    for t in ex.get("tests", []):
        t["status"] = status_of(t["value"], t.get("ref_low"), t.get("ref_high"))
    if client:
        task = ("Explain this lab report simply. For each test: what it measures, the value, and low/normal/high "
                "(use the given 'status' exactly). End with 3 questions to ask the doctor."
                if ex["doc_type"] == "lab_report" else
                "Explain this prescription simply: what each medicine is generally for and how it is taken. "
                "Do not suggest changes. End with 3 questions to ask the doctor.")
        expl = ask(f"{SAFETY}\nReply in {LANG.get(lang, 'English')}.", f"{task}\n\nDATA:\n{json.dumps(ex)}")
    else:
        expl = demo_explain(ex)
    rid = uuid.uuid4().hex[:8]
    return {"id": rid, "filename": fname, "date": ex.get("report_date") or str(date.today()),
            "doc_type": ex["doc_type"], "data": ex, "explanation": expl}

@app.post("/api/upload")
async def upload(file: UploadFile = File(...), lang: str = Form("en"), user=Depends(current_user)):
    if file.content_type not in ("application/pdf", "image/png", "image/jpeg"):
        raise HTTPException(400, "Only PDF, PNG or JPG files are allowed.")
    data = await file.read()
    if len(data) > 10 * 1024 * 1024:
        raise HTTPException(413, "File is too large. Maximum is 10 MB.")
    if client:
        kind = "document" if file.content_type == "application/pdf" else "image"
        block = {"type": kind, "source": {"type": "base64", "media_type": file.content_type,
                                          "data": base64.standard_b64encode(data).decode()}}
        try:
            raw = ask(EXTRACT, [{"role": "user", "content": [block, {"type": "text", "text": "Extract the data."}]}])
            ex = json.loads(raw[raw.index("{"): raw.rindex("}") + 1])
        except Exception:
            raise HTTPException(422, "Could not read this file. Try a clearer photo or a PDF.")
    else:  # demo mode: no API key
        ex = json.loads(json.dumps(SAMPLE_RX if "presc" in (file.filename or "").lower() or "rx" in (file.filename or "").lower() else SAMPLE_LAB))
    rec = make_record(file.filename, ex, lang)
    rec["uid"] = user["id"]
    db = load(); db[rec["id"]] = rec; save(db)
    return rec

@app.post("/api/demo")
def demo(user=Depends(current_user)):
    db = load()
    for s, n in ((SAMPLE_LAB, "sample-lab-report.pdf"), (SAMPLE_RX, "sample-prescription.pdf")):
        rec = make_record(n, json.loads(json.dumps(s)), "en"); rec["uid"] = user["id"]; db[rec["id"]] = rec
    save(db)
    return [r for r in db.values() if r.get("uid") == user["id"]]

@app.get("/api/reports")
def reports(user=Depends(current_user)):
    mine = [r for r in load().values() if r.get("uid") == user["id"]]
    return sorted(mine, key=lambda r: r["date"], reverse=True)

@app.delete("/api/reports")
def delete_all(user=Depends(current_user)):  # "delete my data" button
    save({k: v for k, v in load().items() if v.get("uid") != user["id"]}); return {"ok": True}

class ChatIn(BaseModel):
    message: str
    report_id: str | None = None
    lang: str = "en"
    history: list[dict] = []

@app.post("/api/chat")
def chat(b: ChatIn, user=Depends(current_user)):
    if any(w in b.message.lower() for w in EMERGENCY):
        return {"reply": "⚠️ This may be an emergency. Please call 112 or go to the nearest hospital right now. Do not wait for an app."}
    rec = load().get(b.report_id or "")
    if rec and rec.get("uid") != user["id"]: rec = None
    ctx = (f"Selected file: {rec['filename']} ({rec['doc_type']}, {rec['date']})\n{json.dumps(rec['data'])}"
           if rec else "No file selected.")
    if not client:
        return {"reply": "(Demo mode - add ANTHROPIC_API_KEY for live answers.) " +
                ("I can see your selected file. In general, ask your doctor about any value marked HIGH or LOW." if rec
                 else "Please upload or select a report first.") + " Please confirm with your doctor."}
    msgs = [{"role": m["role"], "content": m["content"]} for m in b.history[-6:] if m.get("role") in ("user", "assistant")]
    msgs.append({"role": "user", "content": b.message})
    system = (f"{SAFETY}\nAnswer using ONLY the selected file when relevant; say so if it is not in the file.\n"
              f"Reply in {LANG.get(b.lang, 'English')}.\n\nCONTEXT:\n{ctx}")
    return {"reply": ask(system, msgs, 900)}

@app.get("/")
def index():
    return FileResponse("static/index.html")
app.mount("/static", StaticFiles(directory="static"), name="static")
