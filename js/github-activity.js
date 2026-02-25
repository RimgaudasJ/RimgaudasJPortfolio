(function () {
  const MAX_PUSHES = 6;

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    });
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
    const pushList = document.getElementById('github-push-list');

    if (!card || !pushList) {
      return;
    }

    const username = card.dataset.githubUsername;
    if (!username) {
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
        pushList.innerHTML = '<li>No public push events to display yet.</li>';
        return;
      }

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
      pushList.innerHTML = '<li>Check your username or GitHub API rate limit and try again.</li>';
    }
  }

  document.addEventListener('DOMContentLoaded', loadGithubActivity);
})();
