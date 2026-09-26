// -----------------------------
// Zufallsfunktion
// -----------------------------
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// -----------------------------
// Aufgabenarten wie im Foto
// -----------------------------
function genPlus() {
  const a = rand(10, 99);
  const b = rand(10, 99);
  return { task: `${a} + ${b}`, solution: a + b, type: "plus" };
}

function genMinus() {
  let a = rand(20, 99);
  let b = rand(10, a);
  return { task: `${a} - ${b}`, solution: a - b, type: "minus" };
}

function genBigMinus() {
  const a = [200,300,400,500,600,700,800,900][rand(0,7)];
  const b = rand(10, 20);
  return { task: `${a} - ${b}`, solution: a - b, type: "bigminus" };
}

function genMulPlus() {
  const a = rand(3, 9);
  const b = rand(3, 9);
  const c = rand(10, 70);
  return { task: `${a} × ${b} + ${c}`, solution: a * b + c, type: "mulplus" };
}

function genMul() {
  const a = rand(20, 70);
  const b = rand(3, 9);
  return { task: `${a} × ${b}`, solution: a * b, type: "mul" };
}

function genDiv() {
  const divisors = [3,4,5];
  const d = divisors[rand(0,2)];
  const result = rand(30, 100);
  const a = result * d;
  return { task: `${a} ÷ ${d}`, solution: result, type: "div" };
}

// -----------------------------
// Mix-Modus mit 3er-Blöcken
// -----------------------------
const ALL_TYPES = ["plus", "minus", "bigminus", "mulplus", "mul", "div"];

let mixOrder = [];
let mixIndex = 0;
let blockCounter = 0;

function prepareMixOrder() {
  mixOrder = [...ALL_TYPES].sort(() => Math.random() - 0.5);
  mixIndex = 0;
  blockCounter = 0;
}

function generateMixedTask() {
  const currentType = mixOrder[mixIndex];
  const task = generateByType(currentType);

  blockCounter++;

  if (blockCounter >= 3) {
    mixIndex++;
    blockCounter = 0;

    if (mixIndex >= mixOrder.length) {
      prepareMixOrder();
    }
  }

  return task;
}

function generateByType(type) {
  switch(type) {
    case "plus": return genPlus();
    case "minus": return genMinus();
    case "bigminus": return genBigMinus();
    case "mulplus": return genMulPlus();
    case "mul": return genMul();
    case "div": return genDiv();
  }
}

// -----------------------------
// SPIELSTEUERUNG
// -----------------------------
let mode = "mix";
let totalQuestions = 10;
let currentQuestion = 0;
let correct = 0;
let currentTask = null;

const screenSetup = document.getElementById("screenSetup");
const screenQuiz = document.getElementById("screenQuiz");
const screenSummary = document.getElementById("screenSummary");

const taskText = document.getElementById("taskText");
const answerInput = document.getElementById("answerInput");
const feedback = document.getElementById("feedback");

// Auswahlfelder
document.querySelectorAll("#optType .option").forEach(opt => {
  opt.addEventListener("click", () => {
    document.querySelectorAll("#optType .option").forEach(o => o.classList.remove("active"));
    opt.classList.add("active");
    mode = opt.dataset.value;
  });
});

document.querySelectorAll("#optCount .option").forEach(opt => {
  opt.addEventListener("click", () => {
    document.querySelectorAll("#optCount .option").forEach(o => o.classList.remove("active"));
    opt.classList.add("active");
    totalQuestions = Number(opt.dataset.value);
  });
});

// Start
document.getElementById("btnStart").addEventListener("click", () => {
  prepareMixOrder();
  currentQuestion = 0;
  correct = 0;

  screenSetup.classList.add("hidden");
  screenQuiz.classList.remove("hidden");

  nextTask();
});

// Neue Aufgabe
function nextTask() {
  feedback.textContent = "";

  if (currentQuestion >= totalQuestions) {
    showSummary();
    return;
  }

  currentQuestion++;

  currentTask = (mode === "mix") ? generateMixedTask() : generateByType(mode);

  taskText.textContent = currentTask.task;
  answerInput.value = "";
  answerInput.focus();
}

// Antwort prüfen
document.getElementById("btnNext").addEventListener("click", () => {
  const val = Number(answerInput.value);

  if (val === currentTask.solution) {
    feedback.textContent = "Richtig!";
    feedback.className = "feedback ok";
    correct++;
  } else {
    feedback.textContent = "Falsch!";
    feedback.className = "feedback bad";
  }

  setTimeout(nextTask, 600);
});

// Zusammenfassung
function showSummary() {
  screenQuiz.classList.add("hidden");
  screenSummary.classList.remove("hidden");

  document.getElementById("summaryText").textContent =
    `Du hast ${correct} von ${totalQuestions} richtig.`;
}

// Neustart
document.getElementById("btnRestart").addEventListener("click", () => {
  screenSummary.classList.add("hidden");
  screenSetup.classList.remove("hidden");
});
