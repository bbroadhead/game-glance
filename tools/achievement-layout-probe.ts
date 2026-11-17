/**
 * Read-only Steam achievement layout probe.
 *
 * Run in the Steam Gaming Mode Chromium DevTools console while the standalone
 * achievements page is visible. This deliberately does not modify Steam's DOM.
 * Copy the returned JSON when investigating layout regressions.
 *
 * Usage: paste this file's body in DevTools, or run as a snippet.
 */
(() => {
  const elements = Array.from(document.querySelectorAll<HTMLElement>('body *'));
  const candidates = elements.filter((el) => {
    const label = [el.className, el.getAttribute('role'), el.getAttribute('aria-label')]
      .filter((x) => typeof x === 'string').join(' ').toLowerCase();
    return /achiev|scroll|gamepad|header/.test(label)
      || (el.scrollHeight > el.clientHeight + 24 && el.clientHeight > 40);
  });
  const entries = candidates.slice(0, 160).map((el) => {
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      tag: el.tagName.toLowerCase(),
      classes: typeof el.className === 'string' ? el.className.slice(0, 180) : '',
      role: el.getAttribute('role'),
      ariaLabel: el.getAttribute('aria-label'),
      dimensions: {
        width: Math.round(rect.width), height: Math.round(rect.height),
        clientHeight: el.clientHeight, scrollHeight: el.scrollHeight,
      },
      style: {
        display: style.display, overflowY: style.overflowY,
        minHeight: style.minHeight, maxHeight: style.maxHeight,
        flex: style.flex, position: style.position,
      },
      scrollable: el.scrollHeight > el.clientHeight + 24,
    };
  });
  const report = {
    viewport: { width: innerWidth, height: innerHeight },
    pathname: location.pathname,
    capturedAt: new Date().toISOString(),
    candidates: entries,
  };
  console.log('Game Glance achievement layout probe', report);
  return report;
})();
