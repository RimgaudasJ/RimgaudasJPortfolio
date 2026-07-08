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
        right: 1.2rem;
        bottom: 1.2rem;
        z-index: 1100;
        padding: 0.55rem 0.9rem;
        border-radius: 9px;
        border: 1px solid rgba(255, 255, 255, 0.18);
        background: rgba(16, 25, 41, 0.72);
        color: #e2e8f0;
        font-weight: 600;
        letter-spacing: 0.02em;
        font-family: 'Inter', 'SF Pro Display', 'Segoe UI', sans-serif;
        cursor: pointer;
        box-shadow: 0 14px 32px rgba(0, 0, 0, 0.35);
        backdrop-filter: blur(10px);
      }
      .theme-toggle-btn:hover {
        transform: translateY(-2px);
        border-color: rgba(79, 163, 255, 0.68);
        box-shadow: 0 0 18px rgba(79, 163, 255, 0.25);
      }
      :root[data-theme='light'] .theme-toggle-btn {
        background: rgba(230, 238, 250, 0.9);
        color: #112038;
        border-color: rgba(17, 32, 56, 0.15);
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
