(function () {
  const RECENT_DAYS = 28;
  const MAX_PUSHES = 6;

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    });
  }

  function createCalendar(daysContainer, pushEvents) {
    const dailyCounts = new Map();

    pushEvents.forEach((event) => {
      const dayKey = new Date(event.created_at).toISOString().slice(0, 10);
      dailyCounts.set(dayKey, (dailyCounts.get(dayKey) || 0) + 1);
    });

    const today = new Date();
    daysContainer.innerHTML = '';

    for (let index = RECENT_DAYS - 1; index >= 0; index -= 1) {
      const day = new Date(today);
      day.setDate(today.getDate() - index);
      const dayKey = day.toISOString().slice(0, 10);
      const count = dailyCounts.get(dayKey) || 0;

      const square = document.createElement('span');
      square.className = 'calendar-day';
      square.dataset.level = count >= 3 ? '3' : String(count);
      square.title = `${day.toDateString()} • ${count} public push${count === 1 ? '' : 'es'}`;
      daysContainer.appendChild(square);
    }
  }

  async function getRepoLanguage(repoFullName, languageCache) {
    if (languageCache.has(repoFullName)) {
      return languageCache.get(repoFullName);
    }

    try {
      const response = await fetch(`https://api.github.com/repos/${repoFullName}`);
      if (!response.ok) {
        languageCache.set(repoFullName, 'Unknown');
        return 'Unknown';
      }

      const repoData = await response.json();
      const language = repoData.language || 'Unknown';
      languageCache.set(repoFullName, language);
      return language;
    } catch (_error) {
      languageCache.set(repoFullName, 'Unknown');
      return 'Unknown';
    }
  }

  async function loadGithubActivity() {
    const card = document.querySelector('.github-activity-card');
    const calendarContainer = document.getElementById('github-calendar');
    const pushList = document.getElementById('github-push-list');

    if (!card || !calendarContainer || !pushList) {
      return;
    }

    const username = card.dataset.githubUsername;
    if (!username) {
      calendarContainer.textContent = 'GitHub username is not configured.';
      pushList.innerHTML = '<li>Set data-github-username on the activity card.</li>';
      return;
    }

    try {
      const eventsResponse = await fetch(`https://api.github.com/users/${username}/events/public`);
      if (!eventsResponse.ok) {
        throw new Error('Unable to fetch GitHub events.');
      }

      const events = await eventsResponse.json();
      const pushEvents = events.filter((event) => event.type === 'PushEvent');

      if (pushEvents.length === 0) {
        calendarContainer.textContent = 'No recent public pushes found.';
        pushList.innerHTML = '<li>No public push events to display yet.</li>';
        return;
      }

      createCalendar(calendarContainer, pushEvents);

      const recentPushes = pushEvents.slice(0, MAX_PUSHES);
      const repoNames = [...new Set(recentPushes.map((event) => event.repo.name))];
      const languageCache = new Map();

      await Promise.all(repoNames.map((repo) => getRepoLanguage(repo, languageCache)));

      pushList.innerHTML = '';
      recentPushes.forEach((event) => {
        const listItem = document.createElement('li');
        const latestCommitSha = event.payload && event.payload.head ? event.payload.head : null;
        const repoUrl = `https://github.com/${event.repo.name}`;
        const commitUrl = latestCommitSha
          ? `${repoUrl}/commit/${latestCommitSha}`
          : repoUrl;

        const repoName = document.createElement('a');
        repoName.className = 'repo-name';
        repoName.href = repoUrl;
        repoName.target = '_blank';
        repoName.rel = 'noopener noreferrer';
        repoName.textContent = event.repo.name;

        const meta = document.createElement('a');
        meta.className = 'meta';
        meta.href = commitUrl;
        meta.target = '_blank';
        meta.rel = 'noopener noreferrer';
        meta.textContent = `${languageCache.get(event.repo.name) || 'Unknown'} • ${formatDate(event.created_at)}`;

        listItem.appendChild(repoName);
        listItem.appendChild(meta);

        pushList.appendChild(listItem);
      });
    } catch (_error) {
      calendarContainer.textContent = 'Could not load GitHub activity.';
      pushList.innerHTML = '<li>Check your username or GitHub API rate limit and try again.</li>';
    }
  }

  document.addEventListener('DOMContentLoaded', loadGithubActivity);
})();
