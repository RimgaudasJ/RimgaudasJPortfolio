(function () {
  const THEME_KEY = 'rj-theme';
  const root = document.documentElement;

  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    const button = document.querySelector('.theme-toggle-btn');
    if (button) {
      button.textContent = theme === 'dark' ? '☀ Light' : '🌙 Dark';
      button.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  function injectButton() {
    if (document.querySelector('.theme-toggle-btn')) return;

    const style = document.createElement('style');
    style.textContent = `
      .theme-toggle-btn {
        position: fixed;
        right: 1rem;
        bottom: 1rem;
        z-index: 1100;
        padding: 0.65rem 1rem;
        border-radius: 10px;
        border: 1.5px solid rgba(90, 143, 212, 0.45);
        background: rgba(255, 255, 255, 0.88);
        color: #2c3e5f;
        font-weight: 700;
        font-family: 'Segoe UI', 'Roboto', Tahoma, Geneva, Verdana, sans-serif;
        cursor: pointer;
        box-shadow: 0 8px 24px rgba(15, 23, 42, 0.15);
        backdrop-filter: blur(6px);
      }
      .theme-toggle-btn:hover {
        transform: translateY(-2px);
      }
      :root[data-theme='dark'] .theme-toggle-btn {
        background: rgba(15, 23, 42, 0.9);
        color: #e2e8f0;
        border-color: rgba(148, 163, 184, 0.45);
      }
    `;
    document.head.appendChild(style);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-toggle-btn';
    button.addEventListener('click', function () {
      const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });

    document.body.appendChild(button);
    applyTheme(root.getAttribute('data-theme') || getPreferredTheme());
  }

  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectButton);
  } else {
    injectButton();
  }
})();
