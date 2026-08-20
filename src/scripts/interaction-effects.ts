const reducedMotionQuery = '(prefers-reduced-motion: reduce)';
const increasedContrastQuery = '(prefers-contrast: more)';
const bootDuration = 4000;
const lineInterval = 650;
const textStart = 700;
const titleStart = 250;

export function initializeEffects(): void {
  const root = document.documentElement;
  const panel = document.querySelector<HTMLElement>('[data-boot-panel]');
  const pageTitle = document.querySelector<HTMLElement>('[data-page-title]');
  const eyebrow = document.querySelector<HTMLElement>('[data-entry-effect]');
  const contentElements = [
    ...document.querySelectorAll<HTMLElement>('[data-content-effect-visual]'),
  ];
  const prearmed = root.dataset.firstSessionEffect === 'active';

  if (!panel || !prearmed) return;
  if (
    matchMedia(reducedMotionQuery).matches ||
    matchMedia(increasedContrastQuery).matches
  ) {
    delete root.dataset.firstSessionEffect;
    return;
  }

  const activePanel = panel;
  const skip = activePanel.querySelector<HTMLButtonElement>('[data-boot-skip]');
  const lines = [
    ...activePanel.querySelectorAll<HTMLElement>('[data-boot-line]'),
  ];
  const completeEyebrow = eyebrow?.textContent?.trim() ?? '';
  const completePageTitle = pageTitle?.textContent?.trim() ?? '';
  const completeContent = contentElements.map(
    (element) => element.textContent?.trim() ?? '',
  );
  let animationTimer: number | undefined;
  let completionTimer: number | undefined;
  let finished = false;

  function finish(): void {
    if (finished) return;
    finished = true;
    if (animationTimer !== undefined) window.clearInterval(animationTimer);
    if (completionTimer !== undefined) window.clearTimeout(completionTimer);
    activePanel.hidden = true;
    if (pageTitle) pageTitle.textContent = completePageTitle;
    if (eyebrow) eyebrow.textContent = completeEyebrow;
    contentElements.forEach((element, index) => {
      element.textContent = completeContent[index] ?? '';
    });
    delete root.dataset.firstSessionEffect;
    document.removeEventListener('keydown', handleEscape);
  }

  function handleEscape(event: KeyboardEvent): void {
    if (
      event.defaultPrevented ||
      event.key !== 'Escape' ||
      document.querySelector('dialog[open]') !== null
    ) {
      return;
    }

    event.preventDefault();
    finish();
  }

  activePanel.hidden = false;
  root.dataset.firstSessionEffect = 'active';
  if (pageTitle) pageTitle.textContent = '';
  if (eyebrow) eyebrow.textContent = '';
  contentElements.forEach((element) => {
    element.textContent = '';
  });

  const startedAt = performance.now();
  const renderFrame = (): void => {
    const elapsed = performance.now() - startedAt;

    lines.forEach((line, index) => {
      line.hidden = elapsed < index * lineInterval;
    });

    if (pageTitle) {
      const step = Math.max(
        24,
        Math.floor(1500 / Math.max(completePageTitle.length, 1)),
      );
      const length = Math.max(0, Math.floor((elapsed - titleStart) / step));
      pageTitle.textContent = completePageTitle.slice(0, length);
    }

    if (eyebrow) {
      const length = Math.max(0, Math.floor((elapsed - textStart) / 34));
      eyebrow.textContent = completeEyebrow.slice(0, length);
    }

    completeContent.forEach((content, contentIndex) => {
      const start = textStart + contentIndex * 250;
      const step = Math.max(14, Math.floor(2600 / Math.max(content.length, 1)));
      const length = Math.max(0, Math.floor((elapsed - start) / step));
      const element = contentElements[contentIndex];
      if (element) element.textContent = content.slice(0, length);
    });
  };

  renderFrame();
  animationTimer = window.setInterval(renderFrame, 16);
  completionTimer = window.setTimeout(finish, bootDuration);
  skip?.addEventListener('click', finish, { once: true });
  document.addEventListener('keydown', handleEscape);
}
