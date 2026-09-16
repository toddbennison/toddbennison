const STORAGE_KEY = "tb-nudged";
const DELAY_MS = 2000;

/** Bounces the ball icon once per browser session to hint that it does something. */
export function nudgeOnce(button) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  try {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // Storage can be blocked. Nudging every visit is fine in that case.
  }

  setTimeout(() => {
    button.classList.add("is-nudging");
    button.addEventListener("animationend", () => button.classList.remove("is-nudging"), {
      once: true,
    });
  }, DELAY_MS);
}
