import { interactionRegistry } from '../lib/interactions';
import { initializeEffects } from './interaction-effects';

type CommandItem = HTMLLIElement & {
  dataset: DOMStringMap & { searchText: string };
};

const palette = document.querySelector<HTMLDialogElement>(
  '[data-command-palette]',
);
const help = document.querySelector<HTMLDialogElement>('[data-shortcut-help]');
const shortcutStrip = document.querySelector<HTMLElement>(
  '[data-shortcut-strip]',
);
const filter = palette?.querySelector<HTMLInputElement>(
  '[data-command-filter]',
);
const empty = palette?.querySelector<HTMLElement>('[data-command-empty]');
const status = palette?.querySelector<HTMLElement>('[data-command-status]');
const items = palette
  ? [...palette.querySelectorAll<CommandItem>('[data-command-item]')]
  : [];

let returnFocus: HTMLElement | null = null;

function isEditableTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.matches('input, textarea, select') || target.isContentEditable)
  );
}

function visibleLinks(): HTMLAnchorElement[] {
  return items
    .filter((item) => !item.hidden)
    .map((item) => item.querySelector<HTMLAnchorElement>('[data-command-link]'))
    .filter((link): link is HTMLAnchorElement => Boolean(link));
}

function filterCommands(query: string): void {
  const normalizedQuery = query.trim().toLowerCase();
  let matches = 0;

  for (const item of items) {
    const isLegacy = item.hasAttribute('data-legacy-command');
    const isMatch = isLegacy
      ? normalizedQuery === 'ev3r'
      : item.dataset.searchText.toLowerCase().includes(normalizedQuery);
    item.hidden = !isMatch;
    if (isMatch) matches += 1;
  }

  if (empty) empty.hidden = matches !== 0;
  if (status) {
    status.textContent =
      status.dataset.resultTemplate?.replace('{count}', String(matches)) ??
      `${matches}`;
  }
}

function closeDialog(dialog: HTMLDialogElement | null): void {
  if (dialog?.open) dialog.close();
}

function openDialog(
  dialog: HTMLDialogElement | null,
  initialFocus: HTMLElement | null,
): void {
  if (!dialog || dialog.open) return;

  closeDialog(dialog === palette ? help : palette);
  returnFocus =
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
  dialog.showModal();
  initialFocus?.focus();
}

function togglePalette(): void {
  if (!palette) return;
  if (palette.open) {
    palette.close();
    return;
  }

  if (filter) filter.value = '';
  filterCommands('');
  openDialog(palette, filter ?? null);
}

function toggleHelp(): void {
  if (!help) return;
  if (help.open) {
    help.close();
    return;
  }

  openDialog(help, help.querySelector<HTMLElement>('[data-dialog-close]'));
}

function restoreFocus(): void {
  if (returnFocus?.isConnected) returnFocus.focus();
  returnFocus = null;
}

function matchesAltShortcut(
  event: KeyboardEvent,
  shortcut: { key: string; altKey: true },
): boolean {
  return (
    event.key.toLowerCase() === shortcut.key &&
    event.altKey &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.shiftKey
  );
}

shortcutStrip?.removeAttribute('hidden');
initializeEffects();

document
  .querySelectorAll<HTMLElement>('[data-command-palette-open]')
  .forEach((button) => button.addEventListener('click', togglePalette));
document
  .querySelectorAll<HTMLElement>('[data-shortcut-help-open]')
  .forEach((button) => button.addEventListener('click', toggleHelp));
document
  .querySelectorAll<HTMLElement>('[data-theme-shortcut-control]')
  .forEach((button) =>
    button.addEventListener('click', () => {
      document
        .querySelector<HTMLButtonElement>('[data-theme-control]')
        ?.click();
    }),
  );

palette?.addEventListener('close', restoreFocus);
help?.addEventListener('close', restoreFocus);

filter?.addEventListener('input', () => filterCommands(filter.value));
filter?.addEventListener('keydown', (event) => {
  if (event.key !== 'ArrowDown') return;
  const firstLink = visibleLinks()[0];
  if (!firstLink) return;
  event.preventDefault();
  firstLink.focus();
});

palette?.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    palette.close();
    return;
  }

  const target = event.target;
  if (!(target instanceof HTMLAnchorElement)) return;
  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;

  const links = visibleLinks();
  const currentIndex = links.indexOf(target);
  if (currentIndex < 0 || links.length === 0) return;

  event.preventDefault();
  if (event.key === 'Home') links[0]?.focus();
  else if (event.key === 'End') links.at(-1)?.focus();
  else {
    const offset = event.key === 'ArrowDown' ? 1 : -1;
    links[(currentIndex + offset + links.length) % links.length]?.focus();
  }
});

document.addEventListener('keydown', (event) => {
  if (
    event.defaultPrevented ||
    event.repeat ||
    isEditableTarget(event.target)
  ) {
    return;
  }

  if (matchesAltShortcut(event, interactionRegistry.palette.shortcut)) {
    event.preventDefault();
    togglePalette();
  } else if (matchesAltShortcut(event, interactionRegistry.theme.shortcut)) {
    event.preventDefault();
    document.querySelector<HTMLButtonElement>('[data-theme-control]')?.click();
  } else if (matchesAltShortcut(event, interactionRegistry.help.shortcut)) {
    event.preventDefault();
    toggleHelp();
  }
});
