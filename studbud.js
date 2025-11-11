//------------------------------------------------------Pomodoro
// (unchanged pomodoro code up to timer initialization)
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
let hasAttemptedPushSubscribe = false;

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
    timerStatus.textContent = "Ready to focus?";
  } else if (currentMode === "shortBreak") {
    mainColor = "#2a9d8f";   // teal
    timerStatus.textContent = "Short break time!";
  } else if (currentMode === "longBreak") {
    mainColor = "#457b9d";   // blue
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
    buttonClick.play();

    if (!hasAttemptedPushSubscribe) {
      hasAttemptedPushSubscribe = true;
      if (typeof subscribeUser === 'function') {
        subscribeUser().catch(function (err) {
          // eslint-disable-next-line no-console
          console.error('Push subscribe failed:', err);
        });
      }
    }

    timer = setInterval(() => {
      timeLeft--;
      updateDisplay();

      if (timeLeft <= 0) {
        clearInterval(timer);
        isRunning = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        alarmSound.play();
        if (typeof notifyEnd === 'function') {
          notifyEnd().catch(function (err) {
            // eslint-disable-next-line no-console
            console.error('Notify end failed:', err);
          });
        }

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
  const activeElement = document.activeElement;
  const isTyping = activeElement && (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA");

  // only toggle when NOT typing
  if (event.code === "Space" && !isTyping) {
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


//------------------------------------------------------Calendar & To-Do

const calendarGrid = document.getElementById("calendar-grid");
const calendarTitle = document.getElementById("calendar-title");
const prevBtn = document.getElementById("prev-month");
const nextBtn = document.getElementById("next-month");
const activityList   = document.getElementById("activity-list");
const selectedDateDisplay = document.getElementById("selected-date");

let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let selectedDay = today.getDate();

let events = JSON.parse(localStorage.getItem("events")) || [];

function generateId() {
  return 'evt_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2,9);
}

// ensure events have ids and submitted flag
function ensureEventIds() {
  let changed = false;
  events.forEach((e) => {
    if (!e.id) {
      e.id = generateId();
      changed = true;
    }
    if (typeof e.submitted === 'undefined') {
      e.submitted = false;
      changed = true;
    }
  });
  if (changed) {
    localStorage.setItem("events", JSON.stringify(events));
  }
}
ensureEventIds();

function renderCalendar() {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const prevLastDay = new Date(currentYear, currentMonth, 0);
    const prevDays = prevLastDay.getDate();
    const lastDate = lastDay.getDate();
    const firstDayIndex = firstDay.getDay();
    const nextDays = 42 - (firstDayIndex + lastDate);

    calendarTitle.textContent = `${firstDay.toLocaleString("default", {
        month: "long",
    })} ${currentYear}`;

    calendarGrid.innerHTML = "";

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    daysOfWeek.forEach((d) => {
        const label = document.createElement("div");
        label.classList.add("calendar__cell", "calendar__cell--label");
        label.textContent = d;
        calendarGrid.appendChild(label);
    });

    for (let x = firstDayIndex; x > 0; x--) {
        const cell = document.createElement("div");
        cell.classList.add("calendar__cell", "calendar__cell--muted");
        cell.textContent = prevDays - x + 1;
        calendarGrid.appendChild(cell);
    }

    for (let i = 1; i <= lastDate; i++) {
        const cell = document.createElement("div");
        cell.classList.add("calendar__cell");
        cell.textContent = i;

        const isToday =
            i === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear();

        if (isToday) cell.classList.add("today");
        if (i === selectedDay) cell.classList.add("active");

        // find events for the day (for coloring the dot)
        const dayEvents = events.filter(
            (e) =>
                e.day === i && e.month === currentMonth + 1 && e.year === currentYear
        );

        if (dayEvents.length > 0) {
            const dot = document.createElement("div");
            dot.classList.add("calendar__dot");
            // if all submitted -> green, else -> red
            if (dayEvents.every(ev => ev.submitted)) {
              dot.classList.add('submitted');
            } else {
              dot.classList.add('pending');
            }
            cell.appendChild(dot);
        }

        cell.addEventListener("click", () => {
            selectedDay = i;
            document
                .querySelectorAll(".calendar__cell")
                .forEach((c) => c.classList.remove("active"));
            cell.classList.add("active");
            updateEventList();
        });

        calendarGrid.appendChild(cell);
    }

    for (let j = 1; j <= nextDays; j++) {
        const cell = document.createElement("div");
        cell.classList.add("calendar__cell", "calendar__cell--muted");
        cell.textContent = j;
        calendarGrid.appendChild(cell);
    }

    updateEventList();
}

function updateEventList() {
    const dateLabel = `${currentYear}-${String(currentMonth + 1).padStart(
        2,
        "0"
    )}-${String(selectedDay).padStart(2, "0")}`;
    selectedDateDisplay.textContent = dateLabel;

    // Dues list should show only UNsubmitted tasks for the selected date
    const dueEvents = events.filter(
        (e) =>
            e.day === selectedDay &&
            e.month === currentMonth + 1 &&
            e.year === currentYear &&
            !e.submitted
    );

    activityList.innerHTML = "";
    if (dueEvents.length === 0) {
        activityList.innerHTML = "<li>No dues</li>";
    } else {
        dueEvents.forEach((ev) => {
            const li = document.createElement("li");
            li.innerHTML = `
              <div class="due-left">
                <strong style="margin-right:8px;">${escapeHtml(ev.title)}</strong>
                <span style="opacity:0.85">${ev.time || "No time"}</span>
              </div>
              <div class="due-actions">
                <button class="submit-btn pending" data-id="${ev.id}" aria-label="Submit ${escapeHtml(ev.title)}">Submit</button>
              </div>
            `;
            activityList.appendChild(li);
        });
    }

    // attach submit handlers
    document.querySelectorAll(".submit-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.dataset.id;
        const ev = events.find(x => x.id === id);
        if (!ev) return;
        showSubmitModal(ev.id, ev.title);
      });
    });
}

prevBtn.addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
});

nextBtn.addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
});

//------------------------------------------------------To-Do List

const todoForm = document.getElementById("todo-form");
const todoTitle = document.getElementById("todo-title");
const todoTime = document.getElementById("todo-time");
const todoList = document.getElementById("todo-list");

function saveEvents() {
    localStorage.setItem("events", JSON.stringify(events));
    renderCalendar();
    updateEventList();
}

todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = todoTitle.value.trim();
    const time = todoTime.value.trim();

    if (!title) return;

    const newEvent = {
        id: generateId(),
        title,
        time,
        day: selectedDay,
        month: currentMonth + 1,
        year: currentYear,
        submitted: false
    };

    events.push(newEvent);
    saveEvents();
    renderTodoList();
    todoForm.reset();
});


function escapeHtml(text) {
  return String(text).replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ---------- renderTodoList ---------- */
function renderTodoList() {
    todoList.innerHTML = "";

    const pending = events.filter(ev => !ev.submitted);

    if (pending.length === 0) {
        todoList.innerHTML = "<li class='todo-placeholder'>No tasks yet</li>";
        return;
    }

    pending.forEach((ev) => {
        const li = document.createElement("li");
        li.classList.add("todo-item");
        li.innerHTML = `
            <div class="left" title="${escapeHtml(ev.title)}">
                <span class="title">${escapeHtml(ev.title)}</span>
                <span class="time">${escapeHtml(ev.time || "")}</span>
            </div>
            <div class="todo-actions">
                <button class="todo-btn delete" data-id="${ev.id}" aria-label="Delete ${escapeHtml(ev.title)}">🗑️</button>
            </div>
        `;
        todoList.appendChild(li);
    });

    document.querySelectorAll(".delete").forEach((btn) =>
        btn.addEventListener("click", (e) => {
            const id = e.currentTarget.dataset.id;
            const ev = events.find(x => x.id === id);
            if (!ev) return;
            showConfirmModal(ev.id, ev.title);
        })
    );
}

/* ---------- RenderCalendar ---------- */
function renderCalendar() {
    hideCalendarTooltip();

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const prevLastDay = new Date(currentYear, currentMonth, 0);
    const prevDays = prevLastDay.getDate();
    const lastDate = lastDay.getDate();
    const firstDayIndex = firstDay.getDay();
    const nextDays = 42 - (firstDayIndex + lastDate);

    calendarTitle.textContent = `${firstDay.toLocaleString("default", {
        month: "long",
    })} ${currentYear}`;

    calendarGrid.innerHTML = "";

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    daysOfWeek.forEach((d) => {
        const label = document.createElement("div");
        label.classList.add("calendar__cell", "calendar__cell--label");
        label.textContent = d;
        calendarGrid.appendChild(label);
    });

    for (let x = firstDayIndex; x > 0; x--) {
        const cell = document.createElement("div");
        cell.classList.add("calendar__cell", "calendar__cell--muted");
        cell.textContent = prevDays - x + 1;
        calendarGrid.appendChild(cell);
    }

    for (let i = 1; i <= lastDate; i++) {
        const cell = document.createElement("div");
        cell.classList.add("calendar__cell");
        cell.textContent = i;

        const isToday =
            i === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear();

        if (isToday) cell.classList.add("today");
        if (i === selectedDay) cell.classList.add("active");

        const dayEvents = events.filter(
            (e) =>
                e.day === i && e.month === currentMonth + 1 && e.year === currentYear
        );

        if (dayEvents.length > 0) {
            const dot = document.createElement("div");
            dot.classList.add("calendar__dot");
            if (dayEvents.every(ev => ev.submitted)) {
              dot.classList.add('submitted');
            } else {
              dot.classList.add('pending');
            }
            cell.appendChild(dot);
        }

        cell.setAttribute('tabindex', 0);
        cell.dataset.day = i;

        cell.addEventListener("click", () => {
            selectedDay = i;
            document
                .querySelectorAll(".calendar__cell")
                .forEach((c) => c.classList.remove("active"));
            cell.classList.add("active");
            updateEventList();
        });

        cell.addEventListener("mouseenter", (ev) => {
          if (!dayEvents || dayEvents.length === 0) {
            hideCalendarTooltip();
            return;
          }
          const rect = cell.getBoundingClientRect();
          showCalendarTooltip(dayEvents, rect, `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(i).padStart(2,'0')}`);
        });

        cell.addEventListener("mousemove", (ev) => {
          if (!tooltipVisible) return;
          const rect = cell.getBoundingClientRect();
          showCalendarTooltip(null, rect);
        });

        cell.addEventListener("mouseleave", () => {
          hideCalendarTooltip();
        });

        cell.addEventListener("focus", () => {
          if (!dayEvents || dayEvents.length === 0) {
            hideCalendarTooltip();
            return;
          }
          const rect = cell.getBoundingClientRect();
          showCalendarTooltip(dayEvents, rect, `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(i).padStart(2,'0')}`);
        });
        cell.addEventListener("blur", () => hideCalendarTooltip());

        calendarGrid.appendChild(cell);
    }

    for (let j = 1; j <= nextDays; j++) {
        const cell = document.createElement("div");
        cell.classList.add("calendar__cell", "calendar__cell--muted");
        cell.textContent = j;
        calendarGrid.appendChild(cell);
    }

    updateEventList();
}

/* ===========================
   Confirmation modal (delete)
   =========================== */

let pendingDeleteId = null;
let pendingDeleteTitle = null;

function createConfirmModal() {

  if (document.querySelector('.confirm-modal')) return;

  const modal = document.createElement('div');
  modal.className = 'confirm-modal';
  modal.innerHTML = `
    <div class="confirm-modal__overlay" data-close="true"></div>
    <div class="confirm-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div class="confirm-modal__title" id="confirm-title">Delete task</div>
      <div class="confirm-modal__message" id="confirm-message">Are you sure?</div>
      <div class="confirm-modal__actions">
        <button class="cancel-btn" id="confirm-cancel">No</button>
        <button class="confirm-btn" id="confirm-yes">Yes</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const overlay = modal.querySelector('.confirm-modal__overlay');
  const btnYes = modal.querySelector('#confirm-yes');
  const btnNo = modal.querySelector('#confirm-cancel');

  overlay.addEventListener('click', closeConfirmModal);

  btnNo.addEventListener('click', closeConfirmModal);
  btnYes.addEventListener('click', () => {
    if (!pendingDeleteId) {
      closeConfirmModal();
      return;
    }
    events = events.filter(ev => ev.id !== pendingDeleteId);
    saveEvents();
    renderTodoList();
    closeConfirmModal();
  });

  document.addEventListener('keydown', (e) => {
    const modalEl = document.querySelector('.confirm-modal.open');
    if (modalEl && e.key === 'Escape') {
      closeConfirmModal();
    }
  });
}

function showConfirmModal(id, title) {
  createConfirmModal();
  pendingDeleteId = id;
  pendingDeleteTitle = title;
  const modal = document.querySelector('.confirm-modal');
  const message = modal.querySelector('#confirm-message');
  message.textContent = `Delete "${title}"? This action cannot be undone.`;
  modal.classList.add('open');

  const yesBtn = modal.querySelector('#confirm-yes');
  if (yesBtn) yesBtn.focus();
}

function closeConfirmModal() {
  const modal = document.querySelector('.confirm-modal');
  if (!modal) return;
  modal.classList.remove('open');
  pendingDeleteId = null;
  pendingDeleteTitle = null;
}

/* ===========================
   Submit modal (for Dues submit)
   =========================== */

let pendingSubmitId = null;
let pendingSubmitTitle = null;

function createSubmitModal() {
  if (document.querySelector('.submit-modal')) return;

  const modal = document.createElement('div');
  modal.className = 'confirm-modal submit-modal';
  modal.innerHTML = `
    <div class="confirm-modal__overlay" data-close="true"></div>
    <div class="confirm-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="submit-title">
      <div class="confirm-modal__title" id="submit-title">Submit task</div>
      <div class="confirm-modal__message" id="submit-message">Are you sure you want to submit this task?</div>
      <div class="confirm-modal__actions">
        <button class="cancel-btn" id="submit-cancel">No</button>
        <button class="confirm-btn" id="submit-yes">Yes</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const overlay = modal.querySelector('.confirm-modal__overlay');
  const btnYes = modal.querySelector('#submit-yes');
  const btnNo = modal.querySelector('#submit-cancel');

  overlay.addEventListener('click', closeSubmitModal);
  btnNo.addEventListener('click', closeSubmitModal);

  btnYes.addEventListener('click', () => {
    if (!pendingSubmitId) {
      closeSubmitModal();
      return;
    }
    // mark as submitted
    events = events.map(ev => {
      if (ev.id === pendingSubmitId) return Object.assign({}, ev, { submitted: true });
      return ev;
    });
    saveEvents();
    renderTodoList();
    updateEventList();
    closeSubmitModal();
  });

  // close on ESC
  document.addEventListener('keydown', (e) => {
    const modalEl = document.querySelector('.submit-modal.open');
    if (modalEl && e.key === 'Escape') {
      closeSubmitModal();
    }
  });
}

function showSubmitModal(id, title) {
  createSubmitModal();
  pendingSubmitId = id;
  pendingSubmitTitle = title;
  const modal = document.querySelector('.submit-modal');
  const message = modal.querySelector('#submit-message');
  message.textContent = `Mark "${title}" as submitted?`;
  modal.classList.add('open');

  const yesBtn = modal.querySelector('#submit-yes');
  if (yesBtn) yesBtn.focus();
}

function closeSubmitModal() {
  const modal = document.querySelector('.submit-modal');
  if (!modal) return;
  modal.classList.remove('open');
  pendingSubmitId = null;
  pendingSubmitTitle = null;
}

/* ---------- Calendar tooltip --------- */

let calendarTooltipEl = null;
let tooltipVisible = false;

function createCalendarTooltip() {
  if (calendarTooltipEl) return;
  const el = document.createElement('div');
  el.className = 'calendar-tooltip';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = `<div class="tt-header"></div><div class="tt-body"></div>`;
  document.body.appendChild(el);
  calendarTooltipEl = el;
}

function showCalendarTooltip(dayEvents, rect, dateLabel) {
  createCalendarTooltip();
  if (!calendarTooltipEl) return;
  const header = calendarTooltipEl.querySelector('.tt-header');
  const body = calendarTooltipEl.querySelector('.tt-body');

  if (dayEvents) {
    header.textContent = dateLabel || '';
    body.innerHTML = '';
    dayEvents.forEach((ev) => {
      const row = document.createElement('div');
      row.className = 'tt-row';
      const title = document.createElement('div');
      title.className = 'tt-title';
      title.innerHTML = escapeHtml(ev.title) + (ev.time ? ` • ${escapeHtml(ev.time)}` : '');
      const status = document.createElement('div');
      status.className = 'tt-status ' + (ev.submitted ? 'submitted' : 'pending');
      status.textContent = ev.submitted ? 'Submitted' : 'Pending';
      row.appendChild(title);
      row.appendChild(status);
      body.appendChild(row);
    });
    calendarTooltipEl.setAttribute('aria-hidden', 'false');
    calendarTooltipEl.classList.add('show');
    tooltipVisible = true;
  } else {
    if (!tooltipVisible) return;
  }

  const tooltipRect = calendarTooltipEl.getBoundingClientRect();

  let x = rect.left + window.scrollX + 6;
  let y = rect.bottom + window.scrollY + 6;

  const winW = document.documentElement.clientWidth || window.innerWidth;
  if (x + tooltipRect.width + 16 > winW) {
    x = Math.max(8, rect.right + window.scrollX - tooltipRect.width - 6);
  }

  const winH = document.documentElement.clientHeight || window.innerHeight;
  if (y + tooltipRect.height + 16 > window.scrollY + winH) {
    y = rect.top + window.scrollY - tooltipRect.height - 6;
  }

  calendarTooltipEl.style.left = `${Math.round(x)}px`;
  calendarTooltipEl.style.top = `${Math.round(y)}px`;
}

function hideCalendarTooltip() {
  if (!calendarTooltipEl) return;
  calendarTooltipEl.setAttribute('aria-hidden', 'true');
  calendarTooltipEl.classList.remove('show');
  tooltipVisible = false;
}

createCalendarTooltip();

window.addEventListener('scroll', () => hideCalendarTooltip(), { passive: true });
document.addEventListener('click', (e) => {
  if (!calendarTooltipEl) return;
  if (!calendarTooltipEl.contains(e.target) && !calendarGrid.contains(e.target)) {
    hideCalendarTooltip();
  }
});

renderCalendar();
renderTodoList();


// ------------------------------------------------------ Push Subscription
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function subscribeUser() {
  try {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;

    const reg = await navigator.serviceWorker.ready;

    // TODO: Replace with your actual PUBLIC VAPID KEY
    const publicVapidKey = '<YOUR PUBLIC VAPID KEY>';

    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });

    await fetch('https://studybuddyserver.onrender.com/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription)
    });
  } catch (err) {
    throw err;
  }
}

async function notifyEnd() {
  try {
    await fetch('https://studybuddyserver.onrender.com/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Your timer is finished!' })
    });
  } catch (err) {
    throw err;
  }
}

// ------------------------------------------------------ Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    // Use relative path so it works on GitHub Pages subpaths
    navigator.serviceWorker.register('service-worker.js').catch(function (err) {
      // eslint-disable-next-line no-console
      console.error('ServiceWorker registration failed:', err);
    });
  });
}

