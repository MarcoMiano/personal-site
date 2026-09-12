// This is a classic, parser-blocking script: keep it import-free so Vite can
// emit it as a fingerprinted asset. Configuration comes from the layout.
(() => {
  const { themeStorageKey, bootSessionKey } = document.currentScript.dataset;

  try {
    const storedTheme = localStorage.getItem(themeStorageKey);
    if (storedTheme === 'dark' || storedTheme === 'bright') {
      document.documentElement.dataset.theme = storedTheme;
    }
  } catch {
    // The CSS operating-system preference remains the fallback.
  }

  try {
    const effectsDisabled =
      matchMedia('(prefers-reduced-motion: reduce)').matches ||
      matchMedia('(prefers-contrast: more)').matches;
    if (!effectsDisabled && sessionStorage.getItem(bootSessionKey) !== 'true') {
      sessionStorage.setItem(bootSessionKey, 'true');
      document.documentElement.dataset.firstSessionEffect = 'active';
    }
  } catch {
    // Leave effects disabled if session storage cannot be read or written.
  }
})();
