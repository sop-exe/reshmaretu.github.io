# StudyBuddy AI Coding Instructions

## Architecture Overview
StudyBuddy is a static GitHub Pages site with a separate Node.js push notification server on Render. Frontend uses vanilla JS/HTML/CSS with localStorage persistence. Key components:
- **Frontend**: [index.html](index.html) (dashboard), [pomodoro.html](pomodoro.html), [todo.html](todo.html)
- **Backend**: [server.js](server.js) (Express + web-push, in-memory subscriptions)
- **Notifications**: Service worker ([service-worker.js](service-worker.js)) + VAPID keys

## Critical Workflows
- **Setup Notifications**: Run `node studybuddy-server/scripts/generate-keys.js` to create VAPID keys. Set `PUBLIC_VAPID_KEY`/`PRIVATE_VAPID_KEY` in Render env vars. Update `window.STUDYBUDDY_PUBLIC_VAPID` in [index.html](index.html) and `publicVapidKey` in [studbud.js](studbud.js).
- **Deploy Server**: Push [studybuddy-server/](studybuddy-server/) to GitHub, deploy on Render with start command `node server.js`.
- **Timer Logic**: Pomodoro auto-transitions (25min → 5min break → 25min → 15min break every 4 cycles). Spacebar toggles start/pause. Notifications fire on timer end via `/notify` endpoint.

## Project Conventions
- **Styling**: Bebas Neue font, green/teal color scheme (#14412c, #2a9d8f, #457b9d). Material Symbols icons. Toast notifications for "Coming soon!" features.
- **Data Model**: Events stored in localStorage as `{id, title, time, day, month, year, submitted}`. Calendar dots: red (pending tasks), green (all submitted).
- **JS Patterns**: DOM manipulation with `getElementById`, event listeners. Async functions for push notifications. Escape HTML with custom `escapeHtml()` function.
- **File Structure**: Main logic in [studbud.js](studbud.js) (pomodoro + calendar + todo). Separate [pomodoro.js](pomodoro.js) and [todo.js](todo.js) for standalone pages.
- **Audio**: Alarm and button click sounds. No video/media beyond audio.

## Examples
- Add task: `events.push({id: generateId(), title, time, day: selectedDay, month: currentMonth+1, year: currentYear, submitted: false}); saveEvents();`
- Update calendar: Call `renderCalendar()` after events change to refresh dots and tooltips.
- Push subscribe: Use `navigator.serviceWorker.ready` then `pushManager.subscribe()` with `applicationServerKey: urlBase64ToUint8Array(publicVapidKey)`.

## Key Files
- [studbud.js](studbud.js): Core app logic (timer, calendar rendering, todo management)
- [server.js](server.js): Push notification server (duplicate in [studybuddy-server/server.js](studybuddy-server/server.js))
- [studbud.css](studbud.css): Main styles (calendar grid, todo panel, timer UI)
- [README.md](README.md): Minimal; refer to [studybuddy-server/README.md](studybuddy-server/README.md) for server setup