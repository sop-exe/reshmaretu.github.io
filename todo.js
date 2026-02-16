let toastBox = document.getElementById('toastBox');

function showToast() {
  const toast = document.getElementById("toast");
  toast.classList.add("show");
  
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500); // stays visible for 2.5 seconds
}
//------------------------------------------------------Calendar


 
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

/*ADD THIS TOOLTIP CODE*/
let tooltipEl = null;
function getTooltipElement() {
    if (!tooltipEl) {
        tooltipEl = document.createElement("div");
        tooltipEl.className = "calendar__tooltip";
        document.body.appendChild(tooltipEl);
    }
    return tooltipEl;
}

function formatEventLine(ev) {
    const timeText = ev.time && String(ev.time).trim() !== "" ? ev.time : "No time";
    return `${ev.title} — ${timeText}`;
}

function showTooltipForCell(cell, headerText, dayEvents) {
    const tip = getTooltipElement();

    const parts = [];
    parts.push(`<h4>${headerText}</h4>`);

    if (!dayEvents || dayEvents.length === 0) {
        parts.push(`<div class="tooltip-line" style="text-align:center">None</div>`);
        parts.push(
            `<div class="tooltip-line" style="text-align:center">List one or more in the To-Do page</div>`
        );
    } else {
        const linesToShow = Math.min(2, dayEvents.length);
        for (let i = 0; i < linesToShow; i++) {
            parts.push(`<div class="tooltip-line">${formatEventLine(dayEvents[i])}</div>`);
        }
        if (dayEvents.length >= 3) {
            parts.push(`<div class="tooltip-more">Click to view more</div>`);
        }
    }

    tip.innerHTML = parts.join("");

    const rect = cell.getBoundingClientRect();
    const tipRect = tip.getBoundingClientRect();
    tip.style.visibility = "hidden";
    tip.classList.add("calendar__tooltip--visible");

    const measure = tip.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const topY = rect.top - 12;

    tip.style.left = `${centerX}px`;
    tip.style.top = `${topY}px`;
    tip.style.visibility = "visible";
}

function hideTooltip() {
    if (!tooltipEl) return;
    tooltipEl.classList.remove("calendar__tooltip--visible");
}
/* END OF TOOLTIP CODE */

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

        const hasEvent = events.some(
            (e) =>
                e.day === i && e.month === currentMonth + 1 && e.year === currentYear
        );

        if (hasEvent) {
            const dot = document.createElement("div");
            dot.classList.add("calendar__dot");
            cell.appendChild(dot);
        }

        // Hover tooltip
        cell.addEventListener("mouseenter", () => {
            const dayEvents = events.filter(
                (e) =>
                    e.day === i &&
                    e.month === currentMonth + 1 &&
                    e.year === currentYear
            );
            showTooltipForCell(cell, "Activities for this day...", dayEvents);
        });

        cell.addEventListener("mouseleave", () => {
            hideTooltip();
        });

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

    const dayEvents = events.filter(
        (e) =>
            e.day === selectedDay &&
            e.month === currentMonth + 1 &&
            e.year === currentYear
    );

    activityList.innerHTML = "";
    if (dayEvents.length === 0) {
        activityList.innerHTML = "<li>No events</li>";
    } else {
        dayEvents.forEach((ev) => {
            const li = document.createElement("li");
            li.textContent = `${ev.title} — ${ev.time || "No time"}`;
            activityList.appendChild(li);
        });
    }
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
        title,
        time,
        day: selectedDay,
        month: currentMonth + 1,
        year: currentYear,
    };

    events.push(newEvent);
    saveEvents();
    renderTodoList();
    todoForm.reset();
});

function renderTodoList() {
    todoList.innerHTML = "";

    if (events.length === 0) {
        todoList.innerHTML = "<li class='todo-placeholder'>No tasks yet</li>";
        return;
    }

    events.forEach((ev, index) => {
        const li = document.createElement("li");
        li.classList.add("todo-item");
        li.innerHTML = `
            <div class="left">
                <span class="title">${ev.title}</span>
                <span class="time">${ev.time || ""}</span>
            </div>
            <div class="todo-actions">
                <button class="todo-btn finish" data-index="${index}">${ev.done ? '✔ Finished' : 'Mark as finished'}</button>
                <button class="todo-btn delete" data-index="${index}">🗑️</button>
            </div>
        `;
        todoList.appendChild(li);
    });

    document.querySelectorAll('.finish').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const i = e.target.dataset.index;
            const idx = parseInt(i, 10);
            if (!events[idx]) return;
            if (events[idx].done) return;
            if (!confirm('Mark this task as finished?')) return;
            events[idx].done = true;
            saveEvents();
            renderTodoList();
        });
    });

    document.querySelectorAll(".delete").forEach((btn) =>
        btn.addEventListener("click", (e) => {
            const i = e.target.dataset.index;
            events.splice(i, 1);
            saveEvents();
            renderTodoList();
        })
    );
}

renderCalendar();
renderTodoList();

