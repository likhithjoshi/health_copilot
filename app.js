/**
 * app.js - Frontend Logic for ChatGPT-Style AI Health Copilot
 * Features:
 * - Collapsible ChatGPT Sidebar & Navigation
 * - Floating Prompt Capsule with Attachment (+) Ingestion
 * - Multilingual Dictionary: English, Hindi, Gujarati, Telugu
 * - Interactive Chart.js Biomarker Trends
 * - Context-Grounded Chat & Emergency Red-Flag Interceptor
 */

// Multilingual Dictionary
const I18N = {
  en: {
    heroGreeting: "Ready when you are.",
    heroSubtitle: "Namaste Ramesh Patel. I analyze your diagnostic reports, prescriptions, and biomarker trends with plain-language explanations in English, Hindi, Gujarati, and Telugu.",
    newConsultation: "New Consultation",
    navChat: "Copilot Chat",
    navDashboard: "Vitals & Dashboard",
    navTrends: "Lab Trends",
    navMeds: "Medications",
    navDoctor: "Doctor Summary",
    navUpload: "Upload Report",
    recentsTitle: "Recent Records",
    resetDemo: "Demo",
    deleteData: "Wipe",
    disclaimerSubtext: "AI Personal Health Copilot can make mistakes. Always verify medical decisions with your qualified physician.",
    dashboardTitle: "Key Biomarkers & Vitals Overview",
    flaggedTitle: "Out of Range Biomarker Alerts",
    reportsTitle: "Medical Record History & Summaries",
    trendsTitle: "Biomarker Progression Over Time",
    medsTitle: "Prescribed Medication Routine",
    doctorSummaryHeader: "Physician Consultation Preparation Sheet",
    printPdf: "Print / Save PDF",
    uploadHeader: "Upload Medical Lab Report or Prescription",
    uploadDesc: "Upload any lab report PDF or prescription photo (PNG, JPG). The AI extracts structured biomarkers and our deterministic engine independently re-checks low/high ranges.",
    dropzonePrompt: "Drag and drop file here, or click to browse"
  },
  hi: {
    heroGreeting: "नमस्ते रमेश जी, पूछिए।",
    heroSubtitle: "मैं आपकी लैब रिपोर्ट, नुस्खे और ब्लड शुगर/कोलेस्ट्रॉल के रुझानों को सरल हिंदी, गुजराती, तेलुगु और अंग्रेजी में समझाता हूँ।",
    newConsultation: "नई बातचीत",
    navChat: "कोपायलट चैट",
    navDashboard: "डैशबोर्ड और जांच",
    navTrends: "लैब चार्ट रुझान",
    navMeds: "दवाएं",
    navDoctor: "डॉक्टर सारांश",
    navUpload: "रिपोर्ट अपलोड",
    recentsTitle: "हालिया रिकॉर्ड",
    resetDemo: "डेमो",
    deleteData: "मिटाएं",
    disclaimerSubtext: "एआई पर्सनल हेल्थ कोपायलट एक शैक्षिक साधन है। चिकित्सीय निर्णयों के लिए हमेशा अपने डॉक्टर से परामर्श करें।",
    dashboardTitle: "महत्वपूर्ण बायोमार्कर्स और स्वास्थ्य अवलोकन",
    flaggedTitle: "असामान्य जाँच चेतावनी",
    reportsTitle: "जांच रिपोर्ट एवं सरल भाषा में समझ",
    trendsTitle: "समय के साथ टेस्ट रिपोर्ट के रुझान",
    medsTitle: "नियमित ली जाने वाली दवाएं",
    doctorSummaryHeader: "डॉक्टर से मिलने के लिए परामर्श पत्र",
    printPdf: "प्रिंट / पीडीएफ",
    uploadHeader: "मेडिकल लैब रिपोर्ट या पर्चा अपलोड करें",
    uploadDesc: "किसी भी लैब रिपोर्ट (PDF) या पर्चे की फोटो अपलोड करें। एआई सीमाओं की निष्पक्ष पुष्टि करेगा।",
    dropzonePrompt: "फ़ाइल यहाँ खींचें या चुनने के लिए क्लिक करें"
  },
  gu: {
    heroGreeting: "નમસ્તે રમેશભાઈ, પૂછો.",
    heroSubtitle: "હું તમારા લેબ રિપોર્ટ્સ, પ્રિસ્ક્રિપ્શન અને સુગર/કોલેસ્ટ્રોલના ફેરફારોને સરળ ગુજરાતી, હિન્દી, તેલુગુ અને અંગ્રેજીમાં સમજાવું છું.",
    newConsultation: "નવી મુલાકાત",
    navChat: "કોપાયલટ ચેટ",
    navDashboard: "ડેશબોર્ડ અને પરિણામો",
    navTrends: "લેબ ચાર્ટ",
    navMeds: "દવાઓ",
    navDoctor: "ડૉક્ટર સમરી",
    navUpload: "રિપોર્ટ અપલોડ",
    recentsTitle: "તાજેતરના રેકોર્ડ",
    resetDemo: "ડેમો",
    deleteData: "ભૂંસો",
    disclaimerSubtext: "એઆઈ હેલ્થ કોપાયલટ શૈક્ષણિક ટૂલ છે. તબીબી સલાહ માટે હંમેશા તમારા ડૉક્ટરની મુલાકાત લો.",
    dashboardTitle: "મહત્વપૂર્ણ બાયોમાર્કર્સ અને આરોગ્ય સારાંશ",
    flaggedTitle: "નોંધપાત્ર રિપોર્ટ એલર્ટ્સ",
    reportsTitle: "તપાસ રિપોર્ટ અને સરળ સમજૂતી",
    trendsTitle: "સમય સાથે રિપોર્ટમાં ફેરફાર",
    medsTitle: "નિયમિત લેવાની દવાઓ",
    doctorSummaryHeader: "ડૉક્ટર કન્સલ્ટેશન સમરી શીટ",
    printPdf: "પ્રિન્ટ / પીડીએફ",
    uploadHeader: "મેડિકલ રિપોર્ટ અથવા પ્રિસ્ક્રિપ્શન અપલોડ કરો",
    uploadDesc: "કોઈપણ લેબ રિપોર્ટ કે પ્રિસ્ક્રિપ્શન અપલોડ કરો. એઆઈ સાચી માહિતી અલગ કરશે.",
    dropzonePrompt: "ફાઇલ અહીં ખેંચો અથવા સિલેક્ટ કરવા ક્લિક કરો"
  },
  te: {
    heroGreeting: "నమస్కారం రమేశ్ గారు, అడగండి.",
    heroSubtitle: "నేను మీ ల్యాబ్ నివేదికలు, ప్రిస్క్రిప్షన్లు మరియు షుగర్/కొలెస్ట్రాల్ మార్పులను సరళమైన తెలుగు, హిందీ, గుజరాతీ మరియు ఇంగ్లీషులో వివరిస్తాను.",
    newConsultation: "కొత్త సంప్రదింపు",
    navChat: "కోపైలట్ చాట్",
    navDashboard: "డ్యాష్‌బోర్డ్ & ఫలితాలు",
    navTrends: "ల్యాబ్ ట్రెండ్స్",
    navMeds: "మందులు",
    navDoctor: "డాక్టర్ సమ్మరీ",
    navUpload: "రిపోర్ట్ అప్‌లోడ్",
    recentsTitle: "ఇటీవలి రికార్డులు",
    resetDemo: "డెమో",
    deleteData: "తొలగించు",
    disclaimerSubtext: "AI పర్సనల్ హెల్త్ కోపైలట్ కేవలం అవగాహన కోసం మాత్రమే. వైద్య చికిత్స కోసం మీ డాక్టర్‌ను సంప్రదించండి.",
    dashboardTitle: "కీలక బయోమార్కర్లు మరియు ఆరోగ్య వివరాలు",
    flaggedTitle: "అసాధారణ పరీక్షల హెచ్చరికలు",
    reportsTitle: "రిపోర్టులు & సరళమైన వివరణ",
    trendsTitle: "కాలక్రమేణా ల్యాబ్ ఫలితాల మార్పులు",
    medsTitle: "నిత్యం తీసుకోవలసిన మందులు",
    doctorSummaryHeader: "డాక్టర్ కన్సల్టేషన్ సమ్మరీ షీట్",
    printPdf: "ప్రింట్ / PDF",
    uploadHeader: "ల్యాబ్ రిపోర్ట్ లేదా ప్రిస్క్రిప్షన్ అప్‌లోడ్ చేయండి",
    uploadDesc: "ఏదైనా ల్యాబ్ రిపోర్ట్ లేదా ప్రిస్క్రిప్షన్ ఫోటో అప్‌లోడ్ చేయండి. AI సమాచారాన్ని స్వతంత్రంగా విశ్లేషిస్తుంది.",
    dropzonePrompt: "ఫైల్‌ను ఇక్కడ లాగి వదలండి లేదా ఎంచుకోవడానికి క్లిక్ చేయండి"
  }
};

let currentLang = "en";
let trendsChart = null;
let cachedTrends = {};
let cachedDashboard = {};

document.addEventListener("DOMContentLoaded", () => {
  initSidebar();
  initLanguages();
  initCapsuleInput();
  initUploadDropzone();
  initPrivacyButtons();

  loadDashboard();
  loadTrends();
  loadChatHistory();
  loadDoctorSummary();
});

// Sidebar Collapsing & Navigation
function initSidebar() {
  const sidebar = document.getElementById("app-sidebar");
  const toggleBtn = document.getElementById("btn-toggle-sidebar");
  const collapseBtn = document.getElementById("btn-collapse-sidebar");
  const newChatBtn = document.getElementById("btn-new-chat");

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });

  collapseBtn.addEventListener("click", () => {
    sidebar.classList.add("collapsed");
  });

  newChatBtn.addEventListener("click", () => {
    switchView("view-chat");
    document.getElementById("chat-hero").style.display = "flex";
    document.getElementById("chat-stream").innerHTML = "";
    appendAssistantBubble(
      currentLang === "te" ? "నమస్కారం! నేను మీ హెల్త్ కోపైలట్‌ను. మీ ఆరోగ్య రికార్డుల గురించి మీరు ఏమైనా అడగవచ్చు." :
      currentLang === "hi" ? "नमस्ते! मैं आपका हेल्थ कोपायलट हूँ। आप अपनी रिपोर्ट या दवाओं के बारे में कुछ भी पूछ सकते हैं।" :
      currentLang === "gu" ? "નમસ્તે! હું તમારો હેલ્થ કોપાયલટ છું. તમે તમારા રિપોર્ટ્સ વિશે કંઈ પણ પૂછી શકો છો." :
      "Namaste! I am your AI Health Copilot. How can I assist you with your health records today?"
    );
  });

  // Nav items click
  document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
      item.classList.add("active");
      switchView(item.dataset.view);
    });
  });
}

function switchView(viewId) {
  document.querySelectorAll(".view-section").forEach(v => v.classList.remove("active"));
  const target = document.getElementById(viewId);
  if (target) target.classList.add("active");

  document.querySelectorAll(".nav-item").forEach(n => {
    n.classList.toggle("active", n.dataset.view === viewId);
  });

  if (viewId === "view-trends") {
    renderTrendsChart();
  } else if (viewId === "view-doctor") {
    loadDoctorSummary();
  }
}

// Multilingual Switching
function initLanguages() {
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentLang = btn.dataset.lang;
      applyLanguage(currentLang);
      renderDashboard(cachedDashboard);
    });
  });
}

function applyLanguage(lang) {
  const dict = I18N[lang] || I18N.en;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });
}

// Floating Prompt Capsule Input
function initCapsuleInput() {
  const input = document.getElementById("capsule-input");
  const sendBtn = document.getElementById("btn-capsule-send");
  const attachBtn = document.getElementById("btn-capsule-attach");
  const fileInput = document.getElementById("capsule-file-input");

  // Send message
  sendBtn.addEventListener("click", () => sendFromCapsule());
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendFromCapsule();
  });

  // Attachment button click triggers file input
  attachBtn.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length) {
      handleFileUpload(e.target.files[0]);
    }
  });
}

function sendFromCapsule() {
  const input = document.getElementById("capsule-input");
  const msg = input.value.trim();
  if (!msg) return;

  switchView("view-chat");
  document.getElementById("chat-hero").style.display = "none";
  input.value = "";

  appendUserBubble(msg);
  const typing = appendAssistantBubble("Analyzing your medical records...");

  fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: msg, language: currentLang, user_id: 1 })
  })
  .then(res => res.json())
  .then(data => {
    typing.remove();
    appendAssistantBubble(data.reply, data.is_emergency, data.emergency_helplines);
  })
  .catch(() => {
    typing.remove();
    appendAssistantBubble("Connection error. Please try again.");
  });
}

function sendQuickPrompt(promptText) {
  document.getElementById("capsule-input").value = promptText;
  sendFromCapsule();
}

function appendUserBubble(text) {
  const stream = document.getElementById("chat-stream");
  const row = document.createElement("div");
  row.className = "chat-row user-row";
  row.innerHTML = `
    <div class="chat-avatar user-avatar-bubble">RP</div>
    <div class="chat-text">${escapeHtml(text)}</div>
  `;
  stream.appendChild(row);
  row.scrollIntoView({ behavior: "smooth" });
  return row;
}

function appendAssistantBubble(text, isEmergency = false, helplines = null) {
  const stream = document.getElementById("chat-stream");
  const row = document.createElement("div");
  row.className = "chat-row";

  let content = text;
  if (isEmergency && helplines) {
    content += `\n\n🚨 EMERGENCY HELPLINES:\n` + helplines.map(h => `📞 ${h}`).join("\n");
  }

  row.innerHTML = `
    <div class="chat-avatar ai-avatar-bubble">⚕️</div>
    <div class="chat-text ${isEmergency ? 'emergency-alert-box' : ''}">${escapeHtml(content)}</div>
  `;
  stream.appendChild(row);
  row.scrollIntoView({ behavior: "smooth" });
  return row;
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Upload Handling
function initUploadDropzone() {
  const dropzone = document.getElementById("upload-dropzone");
  const fileInput = document.getElementById("capsule-file-input");

  dropzone.addEventListener("click", () => fileInput.click());
  dropzone.addEventListener("dragover", (e) => e.preventDefault());
  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  });
}

async function handleFileUpload(file) {
  switchView("view-chat");
  document.getElementById("chat-hero").style.display = "none";
  appendUserBubble(`Uploaded document: ${file.name}`);

  const typing = appendAssistantBubble(`Analyzing '${file.name}' with clinical verification engine...`);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("user_id", 1);

  try {
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    typing.remove();

    const ext = data.data;
    let summary = ext.summary_plain_en;
    if (currentLang === "hi" && ext.summary_plain_hi) summary = ext.summary_plain_hi;
    if (currentLang === "gu" && ext.summary_plain_gu) summary = ext.summary_plain_gu;
    if (currentLang === "te" && ext.summary_plain_te) summary = ext.summary_plain_te;

    let reply = `✅ Report Verified: ${ext.hospital_lab_name || 'Diagnostic Center'}\n\n💡 Plain-Language Summary:\n${summary}`;
    if (ext.doctor_questions && ext.doctor_questions.length) {
      reply += `\n\n🩺 Top Questions to Ask Your Doctor:\n` + ext.doctor_questions.map((q, i) => `${i+1}. ${q}`).join("\n");
    }

    appendAssistantBubble(reply);
    loadDashboard();
    loadTrends();
  } catch (err) {
    typing.remove();
    appendAssistantBubble(`Error processing document: ${err.message}`);
  }
}

// Dashboard & Vitals
async function loadDashboard() {
  try {
    const res = await fetch("/api/dashboard?user_id=1");
    if (!res.ok) return;
    cachedDashboard = await res.json();
    renderDashboard(cachedDashboard);
  } catch (e) {
    console.error(e);
  }
}

function renderDashboard(data) {
  if (!data || !data.user) return;

  // Render 4 vitals
  const vitalsGrid = document.getElementById("vitals-grid-container");
  vitalsGrid.innerHTML = "";
  const keyTests = ["HbA1c", "Fasting Blood Sugar", "Total Cholesterol", "Vitamin D"];
  const latestMap = {};
  (data.lab_values || []).forEach(item => {
    if (!latestMap[item.test_name]) latestMap[item.test_name] = item;
  });

  keyTests.forEach(name => {
    const item = latestMap[name] || { test_name: name, value: "--", unit: "", status: "normal" };
    const badgeCls = item.status === "normal" ? "badge-normal" : (item.status === "high" || item.status === "low" ? "badge-warning" : "badge-normal");

    const card = document.createElement("div");
    card.className = "metric-pill-card";
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:0.85rem; font-weight:600; color:var(--text-muted);">${item.test_name}</span>
        <span class="badge ${badgeCls}">${item.status.toUpperCase()}</span>
      </div>
      <div style="font-size:1.75rem; font-weight:800; margin:0.4rem 0;">${item.value} <span style="font-size:0.85rem; font-weight:normal; color:var(--text-muted);">${item.unit}</span></div>
      <div style="font-size:0.75rem; color:var(--text-muted);">${item.interpretation || 'Clinical bounds monitored'}</div>
    `;
    vitalsGrid.appendChild(card);
  });

  // Flagged list
  const flaggedContainer = document.getElementById("dash-flagged-list");
  const flagged = (data.lab_values || []).filter(l => l.status !== "normal");
  document.getElementById("dash-flagged-count").textContent = `${flagged.length} Flagged`;
  flaggedContainer.innerHTML = "";

  if (flagged.length === 0) {
    flaggedContainer.innerHTML = `<p style="color:#10b981; font-size:0.9rem;">✨ All recorded biomarkers are within healthy ranges!</p>`;
  } else {
    flagged.slice(0, 4).forEach(l => {
      const d = document.createElement("div");
      d.style.padding = "0.5rem 0";
      d.style.borderBottom = "1px solid var(--panel-border)";
      d.innerHTML = `
        <div style="display:flex; justify-content:space-between; font-weight:600; font-size:0.9rem;">
          <span>${l.test_name}: ${l.value} ${l.unit}</span>
          <span class="badge ${l.clinical_flag === 'critical' ? 'badge-critical' : 'badge-warning'}">${l.status.toUpperCase()}</span>
        </div>
        <p style="font-size:0.8rem; color:var(--text-muted); margin-top:0.2rem;">${l.interpretation || ''}</p>
      `;
      flaggedContainer.appendChild(d);
    });
  }

  // Reports timeline
  const reportsList = document.getElementById("dash-reports-list");
  reportsList.innerHTML = "";
  (data.reports || []).forEach(r => {
    let summaryText = r.summary_en;
    if (currentLang === "hi" && r.summary_hi) summaryText = r.summary_hi;
    if (currentLang === "gu" && r.summary_gu) summaryText = r.summary_gu;
    if (currentLang === "te" && r.summary_te) summaryText = r.summary_te;

    const div = document.createElement("div");
    div.style.padding = "1rem 0";
    div.style.borderBottom = "1px solid var(--panel-border)";
    div.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <strong style="color:var(--accent-blue);">${r.filename}</strong>
        <span style="font-size:0.8rem; color:var(--text-muted);">${r.report_date || 'Recent'}</span>
      </div>
      <p style="font-size:0.9rem; margin-top:0.35rem; color:var(--text-secondary);">${summaryText}</p>
    `;
    reportsList.appendChild(div);
  });

  // Active Medications list
  const medsContainer = document.getElementById("meds-list-container");
  medsContainer.innerHTML = "";
  (data.medications || []).forEach(m => {
    const div = document.createElement("div");
    div.style.padding = "0.85rem";
    div.style.background = "#ffffff";
    div.style.borderRadius = "10px";
    div.style.border = "1px solid var(--panel-border)";
    div.style.marginBottom = "0.65rem";
    div.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <strong>${m.name} <span style="font-weight:normal; color:var(--accent-blue);">${m.dosage}</span></strong>
        <label style="font-size:0.85rem; cursor:pointer;"><input type="checkbox" checked style="accent-color:var(--accent-blue);"> Taken Today</label>
      </div>
      <div style="font-size:0.82rem; color:var(--text-muted); margin-top:0.3rem;">⏰ ${m.frequency} &bull; 🍽️ ${m.timing || 'With meals'} &bull; ${m.purpose || ''}</div>
    `;
    medsContainer.appendChild(div);
  });
}

// Trends Chart
async function loadTrends() {
  try {
    const res = await fetch("/api/trends?user_id=1");
    if (!res.ok) return;
    cachedTrends = await res.json();
    const selector = document.getElementById("trend-selector");
    selector.innerHTML = "";
    Object.keys(cachedTrends).forEach(t => {
      const opt = document.createElement("option");
      opt.value = t;
      opt.textContent = t;
      selector.appendChild(opt);
    });
    selector.addEventListener("change", () => renderTrendsChart());
  } catch (e) {
    console.error(e);
  }
}

function renderTrendsChart() {
  const selector = document.getElementById("trend-selector");
  const testName = selector.value;
  if (!testName || !cachedTrends[testName]) return;

  const records = cachedTrends[testName];
  const labels = records.map(r => r.date);
  const values = records.map(r => r.value);
  const unit = records[0].unit || "";

  const ctx = document.getElementById("trendsChartCanvas").getContext("2d");
  if (trendsChart) trendsChart.destroy();

  trendsChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: `${testName} (${unit})`,
        data: values,
        borderColor: "#0284c7",
        backgroundColor: "rgba(2, 132, 199, 0.12)",
        fill: true,
        tension: 0.25,
        pointRadius: 6,
        pointBackgroundColor: "#0284c7"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "top" } }
    }
  });
}

// Doctor Summary Sheet
async function loadDoctorSummary() {
  try {
    const res = await fetch("/api/doctor-summary?user_id=1");
    if (!res.ok) return;
    const s = await res.json();
    const c = document.getElementById("doctor-sheet-content");
    c.innerHTML = `
      <div style="border-bottom:2px solid var(--accent-blue); padding-bottom:0.75rem; margin-bottom:1rem; display:flex; justify-content:space-between;">
        <div>
          <h2 style="color:var(--accent-blue);">Clinical Consultation Visit Sheet</h2>
          <p><strong>Patient:</strong> ${s.patient.name} &bull; <strong>Age:</strong> ${s.patient.age} &bull; <strong>Gender:</strong> ${s.patient.gender}</p>
        </div>
        <div style="font-size:0.85rem; color:var(--text-muted); text-align:right;">Date: ${new Date().toLocaleDateString('en-IN')}<br>Health Copilot</div>
      </div>
      <h4 style="color:#b91c1c; margin-bottom:0.4rem;">⚠️ Out-of-Range Biomarkers:</h4>
      <ul>${s.abnormal_or_flagged_biomarkers.map(b => `<li><strong>${b.test_name}:</strong> ${b.value} ${b.unit} (${b.status.toUpperCase()})</li>`).join("")}</ul>
      <h4 style="color:var(--accent-blue); margin:1rem 0 0.4rem 0;">💊 Active Medications:</h4>
      <ul>${s.active_medications.map(m => `<li><strong>${m.name} ${m.dosage}:</strong> ${m.frequency} (${m.timing})</li>`).join("")}</ul>
      <h4 style="color:#6b21a8; margin:1rem 0 0.4rem 0;">❓ Priority Questions for Doctor:</h4>
      <ol style="padding-left:1.25rem;">${s.recommended_doctor_questions.map(q => `<li>${q}</li>`).join("")}</ol>
    `;
  } catch (e) {
    console.error(e);
  }
}

// Chat History Loading
async function loadChatHistory() {
  try {
    const res = await fetch("/api/chat/history?user_id=1");
    if (!res.ok) return;
    const history = await res.json();
    if (history.length > 0) {
      document.getElementById("chat-hero").style.display = "none";
      history.forEach(m => {
        if (m.role === "user") appendUserBubble(m.content);
        else appendAssistantBubble(m.content, m.is_emergency);
      });
    }
  } catch (e) {
    console.error(e);
  }
}

// Privacy & Demo Buttons
function initPrivacyButtons() {
  document.getElementById("btn-seed").addEventListener("click", async () => {
    if (confirm("Reset and load 6 months of demo health records for Ramesh Patel?")) {
      await fetch("/api/seed-demo?user_id=1", { method: "POST" });
      location.reload();
    }
  });

  document.getElementById("btn-delete-all").addEventListener("click", async () => {
    if (confirm("⚠️ DPDP ACT RIGHT TO ERASURE:\nPermanently wipe all medical reports, lab values, and chat history?")) {
      await fetch("/api/delete-data?user_id=1", { method: "DELETE" });
      location.reload();
    }
  });
}
