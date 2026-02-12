// Default values
let sessionLength = 25; // Pomodoro minutes
let breakLength = 5;  // Short break minutes
let longBreakLength = 15; // Long break minutes
let timer;
let isRunning = false;
let currentMode = "pomodoro"; // "pomodoro", "shortBreak", or "longBreak"
let timeLeft = sessionLength * 60; // in seconds
let pomodoroCount = 0;
const bodyElement = document.body;

// DOM elements
const timerDisplay = document.getElementById("timerDisplay");
const timerStatus = document.getElementById("timerStatus");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const pomoBtn = document.getElementById("pomoBtn");
const sbBtn = document.getElementById("sbBtn");
const lbBtn = document.getElementById("lbBtn");

// 🎵 Audio elements
const alarmSound = document.getElementById("alarm");
const buttonClick = document.getElementById("buttonclick");

let toastBox = document.getElementById('toastBox');

function showToast() {
  const toast = document.getElementById("toast");
  // Default values
  let sessionLength = 25; // Pomodoro minutes
  let breakLength = 5;  // Short break minutes
  let longBreakLength = 15; // Long break minutes
  let timer;
  let isRunning = false;
  let currentMode = "pomodoro"; // "pomodoro", "shortBreak", or "longBreak"
  let timeLeft = sessionLength * 60; // in seconds
  let pomodoroCount = 0;
  const bodyElement = document.body;

  // DOM elements
  const timerDisplay = document.getElementById("timerDisplay");
  const timerStatus = document.getElementById("timerStatus");
  const startBtn = document.getElementById("startBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const pomoBtn = document.getElementById("pomoBtn");
  const sbBtn = document.getElementById("sbBtn");
  const lbBtn = document.getElementById("lbBtn");

  // 🎵 Audio elements
  const alarmSound = document.getElementById("alarm");
  const buttonClick = document.getElementById("buttonclick");

  let toastBox = document.getElementById('toastBox');

  function showToast() {
    const toast = document.getElementById("toast");
    toast.classList.add("show");
  
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2500); // stays visible for 2.5 seconds
  }

  // 🖌️ Smooth transitions
  timerDisplay.style.transition = "color 0.5s ease";
  bodyElement.style.transition = "background-color 0.5s ease";
  [startBtn, pauseBtn, pomoBtn, sbBtn, lbBtn].forEach(btn => {
    btn.style.transition = "background-color 0.4s ease, color 0.4s ease";
  });

  // 🧮 Update display
  function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent =
      `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  // 🎨 Update timer, background, and button colors
  function updateColor() {
    let mainColor, lightBg;

    if (currentMode === "pomodoro") {
      mainColor = "#c1121f";   // red
      lightBg = "#fdecef";     // light red background
      timerStatus.textContent = "Ready to focus?";
    } else if (currentMode === "shortBreak") {
      mainColor = "#2a9d8f";   // teal
      lightBg = "#e6f7f5";     // light teal background
      timerStatus.textContent = "Short break time!";
    } else if (currentMode === "longBreak") {
      mainColor = "#457b9d";   // blue
      lightBg = "#e4f0f8";     // light blue background
      timerStatus.textContent = "Long break, relax!";
    }

    // Apply colors
    timerDisplay.style.color = mainColor;
    bodyElement.style.backgroundColor = lightBg;

    // Buttons color change
    [startBtn, pauseBtn, pomoBtn, sbBtn, lbBtn].forEach(btn => {
      btn.style.backgroundColor = mainColor;
      btn.style.color = "white";
      btn.style.border = "none";
    });

    // Optional hover effect (inline)
    const style = document.createElement("style");
    style.textContent = `
      button:hover { opacity: 0.85; cursor: pointer; }
    `;
    document.head.appendChild(style);
  }

  // ▶️ Start timer
  function startTimer() {
    if (!isRunning) {
      isRunning = true;
      startBtn.disabled = true;
      pauseBtn.disabled = false;

      timer = setInterval(() => {
        timeLeft--;
        updateDisplay();

        if (timeLeft <= 0) {
          clearInterval(timer);
          isRunning = false;
          startBtn.disabled = false;
          pauseBtn.disabled = true;
          alarmSound.play();

          // Automatic transition
          if (currentMode === "pomodoro") {
            pomodoroCount++;
            if (pomodoroCount % 4 === 0) {
              switchMode("longBreak");
            } else {
              switchMode("shortBreak");
            }
          } else {
            switchMode("pomodoro");
          }
        }
      }, 1000);
    }
  }

  // ⏸️ Pause timer
  function pauseTimer() {
    if (isRunning) {
      clearInterval(timer);
      isRunning = false;
      startBtn.disabled = false;
      pauseBtn.disabled = true;
      buttonClick.play();
    }
  }

  // 🔁 Switch mode manually
  function switchMode(mode) {
    clearInterval(timer);
    isRunning = false;
    currentMode = mode;
    buttonClick.play();

    switch (mode) {
      case "pomodoro":
        timeLeft = sessionLength * 60;
        break;
      case "shortBreak":
        timeLeft = breakLength * 60;
        break;
      case "longBreak":
        timeLeft = longBreakLength * 60;
        break;
    }

    startBtn.disabled = false;
    pauseBtn.disabled = true;
    updateDisplay();
    updateColor();
  }

  // 🎹 Spacebar toggles start/pause
  document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
      event.preventDefault();
      if (isRunning) {
        pauseTimer();
      } else {
        startTimer();
      }
    }
  });

  // 🖱️ Event listeners
  startBtn.addEventListener("click", startTimer);
  pauseBtn.addEventListener("click", pauseTimer);
  pomoBtn.addEventListener("click", () => switchMode("pomodoro"));
  sbBtn.addEventListener("click", () => switchMode("shortBreak"));
  lbBtn.addEventListener("click", () => switchMode("longBreak"));

  // 🚀 Initialize display
  updateDisplay();
  updateColor();
