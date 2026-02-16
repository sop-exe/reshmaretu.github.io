// Insights Page - Personality, Confusion, Progress, Mood History

document.addEventListener('DOMContentLoaded', function() {
    const confusionList = document.getElementById('confusionList');
    const confusionTopics = JSON.parse(localStorage.getItem('confusionTopics') || '[]');

    if (confusionList) {
        if (confusionTopics.length === 0) {
            confusionList.innerHTML = '<li class="empty-msg">No confusing topics yet.</li>';
        } else {
            confusionList.innerHTML = confusionTopics.map(t => `<li>🔴 ${t}</li>`).join('');
        }
    }

    document.getElementById('reviewConfusionBtn')?.addEventListener('click', function() {
        if (confusionTopics.length > 0) {
            window.location.href = 'index.html#startSession';
        } else {
            alert('No topics to review yet. Mark topics as confusing during Focus Mode.');
        }
    });

    // Mood history (last 7 days)
    const moodHistoryList = document.getElementById('moodHistoryList');
    if (moodHistoryList && typeof getRecentMoods === 'function') {
        const recent = getRecentMoods(7);
        if (recent.length === 0) {
            moodHistoryList.innerHTML = '<li>No mood entries yet.</li>';
        } else {
            moodHistoryList.innerHTML = recent.map(m => {
                const emoji = m.value === 3 ? '😄' : m.value === 2 ? '😐' : '😞';
                return `<li>${emoji} ${m.date} – ${m.note || ''}</li>`;
            }).join('');
        }
    }

    // Stats (sessions, accuracy) – unchanged
    const stats = typeof getStats === 'function' ? getStats() : {};
    const sessionsCount = stats.sessions_completed || 0;
    const sessionsEl = document.getElementById('sessionsCount');
    if (sessionsEl) sessionsEl.textContent = sessionsCount;
});