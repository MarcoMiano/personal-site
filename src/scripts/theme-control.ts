import {
  getNextThemeMode,
  isThemeMode,
  themeStorageKey,
  type ThemeMode,
} from '../lib/interactions';

type ThemeControl = HTMLButtonElement & {
  dataset: DOMStringMap & {
    actionLabel: string;
    controlLabel: string;
    labelAuto: string;
    labelBright: string;
    labelDark: string;
  };
};

const root = document.documentElement;
const control = document.querySelector<ThemeControl>('[data-theme-control]');

function readPreference(): ThemeMode {
  try {
    const stored = localStorage.getItem(themeStorageKey);
    return isThemeMode(stored) ? stored : 'auto';
  } catch {
    return 'auto';
  }
}

function writePreference(mode: ThemeMode): void {
  try {
    if (mode === 'auto') {
      localStorage.removeItem(themeStorageKey);
    } else {
      localStorage.setItem(themeStorageKey, mode);
    }
  } catch {
    // The visual preference remains active for this page when storage is blocked.
  }
}

function applyPreference(mode: ThemeMode): void {
  if (mode === 'auto') {
    delete root.dataset.theme;
  } else {
    root.dataset.theme = mode;
  }
}

function getModeLabel(button: ThemeControl, mode: ThemeMode): string {
  if (mode === 'dark') return button.dataset.labelDark;
  if (mode === 'bright') return button.dataset.labelBright;
  return button.dataset.labelAuto;
}

function renderControl(button: ThemeControl, mode: ThemeMode): void {
  const label = button.querySelector<HTMLElement>('[data-theme-control-label]');
  const nextMode = getNextThemeMode(mode);
  const currentLabel = getModeLabel(button, mode);

  if (label) label.textContent = currentLabel;
  button.setAttribute(
    'aria-label',
    `${button.dataset.controlLabel}: ${currentLabel}. ${button.dataset.actionLabel} ${getModeLabel(button, nextMode)}.`,
  );
  button.title = `${button.dataset.controlLabel}: ${currentLabel}`;
  button.dataset.themeMode = mode;
}

if (control) {
  let preference = readPreference();

  applyPreference(preference);
  renderControl(control, preference);
  control.hidden = false;

  control.addEventListener('click', () => {
    preference = getNextThemeMode(preference);
    applyPreference(preference);
    writePreference(preference);
    renderControl(control, preference);
  });
}
