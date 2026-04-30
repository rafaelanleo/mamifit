const routines = [
  { name: "Fuerza funcional base", level: "Base", blocks: ["3 min: movilidad cuello-hombros-cadera", "6 min: sentadilla a silla + plancha inclinada", "6 min: puente de glúteo + remo con mochila", "5 min: core suave + respiración"] },
  { name: "Energía express", level: "Intermedio", blocks: ["4 min: calentamiento dinámico", "8 min: zancadas atrás + flexiones en pared", "5 min: bisagra de cadera + bird dog", "3 min: estiramientos activos"] },
  { name: "Día suave", level: "Recuperación", blocks: ["5 min: movilidad espinal y cadera", "8 min: sentadilla asistida + elevación de talones", "4 min: dead bug + plancha lateral de rodillas", "3 min: respiración y descarga lumbar"] }
];
const kidsExtras = ["🎈 Carrera de animales 60s entre bloques", "🧸 10 choques de manos al terminar cada bloque", "🦘 Saltitos suaves juntas durante 30s"];


const ceramicsFeed = [
  {
    title: "Tablero cerámica aesthetic · vanesaduarte",
    pinUrl: "https://ar.pinterest.com/vanesaduarte/ceramica-aesthetic/",
    sourceBoard: "ar.pinterest.com/vanesaduarte"
  },
  {
    title: "Tablero pottery aesthetic · malakyasserrr",
    pinUrl: "https://es.pinterest.com/malakyasserrr/pottery-aesthetic/",
    sourceBoard: "es.pinterest.com/malakyasserrr"
  },
  {
    title: "Ideas de cerámica aesthetic",
    pinUrl: "https://es.pinterest.com/ideas/ideas-de-ceramica-aesthetic/899073442079/",
    sourceBoard: "es.pinterest.com/ideas"
  }
];

function pickRandomItems(items, n = 3) {
  return [...items].sort(() => Math.random() - 0.5).slice(0, n);
}

function renderCeramics() {
  const container = el("ceramicsList");
  if (!container) return;

  const selected = pickRandomItems(ceramicsFeed, 3);
  container.innerHTML = selected
    .map(
      (item) => `
      <div class="ceramic-item">
        <a href="${item.pinUrl}" target="_blank" rel="noopener noreferrer">${item.title}</a>
        <p class="ceramic-meta">Fuente: ${item.sourceBoard}</p>
      </div>
    `
    )
    .join("");
}
let index = 0;
let kidsMode = false;
let selectedLevel = "Base";
let timerInterval = null;
let remainingSeconds = 20 * 60;

const el = (id) => document.getElementById(id);

function formatTime(total) {
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function loadProgress() {
  const data = JSON.parse(localStorage.getItem("mamifit_progress") || "{}");
  el("sessionsDone").textContent = data.done || 0;
  el("streak").textContent = data.streak || 0;
  const activeDays = data.activeDays || [];
  renderCalendar(activeDays);
}

function saveProgress(activeDays = null) {
  const data = JSON.parse(localStorage.getItem("mamifit_progress") || "{}");
  data.done = Number(el("sessionsDone").textContent);
  data.streak = Number(el("streak").textContent);
  if (activeDays) data.activeDays = activeDays;
  localStorage.setItem("mamifit_progress", JSON.stringify(data));
}

function routinesByLevel() {
  const filtered = routines.filter((r) => r.level === selectedLevel);
  return filtered.length > 0 ? filtered : routines;
}

function renderRoutine() {
  const options = routinesByLevel();
  const current = options[index % options.length];
  el("sessionMeta").textContent = `${current.name} · Nivel ${current.level}`;
  const list = el("routineList");
  list.innerHTML = "";
  current.blocks.forEach((b) => {
    const li = document.createElement("li");
    li.textContent = b;
    list.appendChild(li);
  });
  if (kidsMode) {
    const li = document.createElement("li");
    li.innerHTML = `<strong class="ok">Con peques: ${kidsExtras[index % kidsExtras.length]}</strong>`;
    list.appendChild(li);
  }
}

function startTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    remainingSeconds -= 1;
    el("timer").textContent = formatTime(remainingSeconds);
    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      el("timer").textContent = "¡Completada!";
    }
  }, 1000);
}

function resetTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;
  remainingSeconds = 20 * 60;
  el("timer").textContent = formatTime(remainingSeconds);
}

function completeSession() {
  const data = JSON.parse(localStorage.getItem("mamifit_progress") || "{}");
  const active = new Set(data.activeDays || []);
  const today = new Date().toISOString().slice(0, 10);
  active.add(today);
  const activeDays = Array.from(active).sort();

  const done = activeDays.length;

  const set = new Set(activeDays);
  let streak = 0;
  const cursor = new Date();
  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (!set.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  el("sessionsDone").textContent = done;
  el("streak").textContent = streak;
  localStorage.setItem("mamifit_progress", JSON.stringify({ done, streak, activeDays }));
  renderCalendar(activeDays);
}

function renderCalendar(activeDays = []) {
  const days = ["L", "M", "X", "J", "V", "S", "D"];
  const cal = el("calendar");
  cal.innerHTML = "";

  const now = new Date();
  const mondayBased = (now.getDay() + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - mondayBased);

  const weekKeys = [];
  for (let i = 0; i < 7; i += 1) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    weekKeys.push(d.toISOString().slice(0, 10));
  }

  const activeSet = new Set(activeDays);

  days.forEach((d, i) => {
    const box = document.createElement("div");
    box.className = "day";
    if (activeSet.has(weekKeys[i])) box.classList.add("active");
    box.textContent = d;
    cal.appendChild(box);
  });
}

function setTier(premium) {
  el("tierText").textContent = premium
    ? "MamiGorda premium: más acompañamiento, guía semanal y seguimiento cercano."
    : "MamiFit base: simple y directo para mantener constancia.";
}

document.querySelectorAll(".level-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    selectedLevel = btn.dataset.level;
    el("levelInfo").textContent = `Nivel actual: ${selectedLevel}`;
    index = 0;
    renderRoutine();
renderCeramics();
    resetTimer();
  });
});

el("nextRoutine").addEventListener("click", () => {
  index += 1;
  renderRoutine();
renderCeramics();
  resetTimer();
});
el("toggleKids").addEventListener("click", () => {
  kidsMode = !kidsMode;
  el("toggleKids").textContent = `Modo con peques: ${kidsMode ? "ON" : "OFF"}`;
  renderRoutine();
renderCeramics();
});
el("complete").addEventListener("click", completeSession);
el("startNow").addEventListener("click", () => el("today-session").scrollIntoView({ behavior: "smooth" }));
el("startTimer").addEventListener("click", startTimer);
el("tierBasic").addEventListener("click", () => setTier(false));
el("tierPremium").addEventListener("click", () => setTier(true));
el("refreshCeramics").addEventListener("click", renderCeramics);

el("levelInfo").textContent = `Nivel actual: ${selectedLevel}`;
el("timer").textContent = formatTime(remainingSeconds);
setTier(false);
loadProgress();
renderRoutine();
renderCeramics();
