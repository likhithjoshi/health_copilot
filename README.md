# Health Copilot
1. `pip install -r requirements.txt`
2. Copy `.env.example` to `.env` and add your ANTHROPIC_API_KEY (optional: without it the app runs in demo mode with sample data)
3. `uvicorn main:app --reload --port 8000` then open http://localhost:8000
Deploy: push to GitHub, create a Render Web Service, start command `uvicorn main:app --host 0.0.0.0 --port $PORT`.
