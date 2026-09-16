const STORAGE_KEY = "tb-theme";
const COLOURS = { light: "#FAFAF8", dark: "#161615" };

const root = document.documentElement;
const systemDark = window.matchMedia("(prefers-color-scheme: dark)");

function currentTheme() {
  const chosen = root.dataset.theme;
  if (chosen === "light" || chosen === "dark") return chosen;
  return systemDark.matches ? "dark" : "light";
}

function updateBrowserBar(theme) {
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    // With an explicit choice, both tags point at the chosen colour.
    meta.content = root.dataset.theme ? COLOURS[theme] : COLOURS[meta.dataset.themeColor];
  });
}

function sync(button) {
  const theme = currentTheme();
  button.setAttribute("aria-checked", String(theme === "dark"));
  button.title = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
  updateBrowserBar(theme);
}

export function initThemeSwitch(button) {
  if (!button) return;

  sync(button);

  button.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage blocked. The choice lasts until the page is closed.
    }
    sync(button);
  });

  // If the visitor hasn't chosen, follow system changes live.
  systemDark.addEventListener("change", () => sync(button));
}
