// Runs before the page paints so a saved theme never flashes the wrong colours.
// Kept tiny and blocking on purpose. Everything else lives in theme.js.
try {
  const saved = localStorage.getItem("tb-theme");
  if (saved === "light" || saved === "dark") {
    document.documentElement.dataset.theme = saved;
  }
} catch {
  // Storage blocked. Fall back to the system setting.
}
