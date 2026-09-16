import { startClock } from "./clock.js";
import { nudgeOnce } from "./nudge.js";
import { initThemeSwitch } from "./theme.js";

startClock(document.getElementById("clock"));
initThemeSwitch(document.getElementById("theme-switch"));

const ballButton = document.getElementById("ball-btn");
const dialog = document.getElementById("keepy");

if (ballButton && dialog) {
  nudgeOnce(ballButton);

  let game;
  ballButton.addEventListener("click", async () => {
    // The game only downloads the first time someone clicks the ball.
    if (!game) {
      const { createKeepyUppy } = await import("./keepy/index.js");
      game = createKeepyUppy(dialog);
    }
    game.open(ballButton);
  });
}
