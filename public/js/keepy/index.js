import { createBall, kick, step } from "./physics.js";
import { render } from "./render.js";

const BEST_KEY = "tb-keepy-best";

function readBest() {
  try {
    return Number.parseInt(localStorage.getItem(BEST_KEY) ?? "0", 10) || 0;
  } catch {
    return 0;
  }
}

function saveBest(value) {
  try {
    localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // Storage blocked. The best score just won't persist.
  }
}

export function createKeepyUppy(dialog) {
  const canvas = dialog.querySelector(".keepy-pitch");
  const ctx = canvas.getContext("2d");
  const scoreEl = dialog.querySelector(".keepy-score");
  const bestEl = dialog.querySelector(".keepy-best");
  const msgEl = dialog.querySelector(".keepy-msg");
  const closeBtn = dialog.querySelector(".keepy-close");

  const view = { width: 0, height: 0, floor: 0, radius: 34 };
  let ball = createBall(0, 0);
  let score = 0;
  let best = readBest();
  let beatBest = false;
  let state = "ready";
  let squash = 0;
  let frame = 0;
  let lastTime = 0;
  let returnFocusTo = null;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    view.width = window.innerWidth;
    view.height = window.innerHeight;
    view.floor = view.height - Math.max(40, view.height * 0.08);
    view.radius = Math.max(26, Math.min(38, view.width * 0.07));
    canvas.width = view.width * dpr;
    canvas.height = view.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ball.x = Math.min(Math.max(ball.x, view.radius), view.width - view.radius);
    if (state !== "playing") ball.y = view.floor - view.radius;
  }

  function updateScore() {
    scoreEl.textContent = String(score);
    bestEl.textContent = beatBest && score ? "New best" : best ? `Best ${best}` : "";
  }

  function reset() {
    ball = createBall(view.width / 2, view.floor - view.radius);
    score = 0;
    beatBest = false;
    state = "ready";
    msgEl.textContent = "Tap the ball to keep it up";
    updateScore();
  }

  function bumpScore() {
    scoreEl.classList.add("is-bumped");
    setTimeout(() => scoreEl.classList.remove("is-bumped"), 120);
  }

  function handleTap(x, y) {
    if (state === "over") {
      reset();
      return;
    }
    if (!kick(ball, view.radius, x, y, score)) return;

    if (state === "ready") {
      state = "playing";
      msgEl.textContent = "";
    }

    score += 1;
    squash = 1;
    if (score > best) {
      best = score;
      beatBest = true;
      saveBest(best);
    }
    updateScore();
    bumpScore();
    navigator.vibrate?.(8);
  }

  function loop(time) {
    const dt = Math.min(0.033, (time - lastTime) / 1000 || 0);
    lastTime = time;

    if (state === "playing") {
      const result = step(ball, dt, { ...view, score });
      if (result === "bounced") squash = 0.7;
      if (result === "dropped") {
        state = "over";
        msgEl.textContent = score ? `Dropped it at ${score}. Tap to go again` : "Tap to go again";
      }
    }

    squash = Math.max(0, squash - dt * 7);
    render(ctx, { ...view, ball, squash });
    frame = requestAnimationFrame(loop);
  }

  function onPointerDown(event) {
    event.preventDefault();
    handleTap(event.clientX, event.clientY);
  }

  function onKeyDown(event) {
    if (event.key === "Escape") {
      close();
    } else if (event.key === "Tab") {
      // Close is the only focusable control, so keep focus there.
      event.preventDefault();
      closeBtn.focus();
    } else if (event.key === " " || event.key === "ArrowUp") {
      if (document.activeElement === closeBtn && event.key === " ") return;
      event.preventDefault();
      handleTap(ball.x, ball.y + view.radius * 0.3);
    }
  }

  function open(trigger) {
    returnFocusTo = trigger ?? null;
    dialog.hidden = false;
    document.body.classList.add("is-playing");
    resize();
    reset();
    lastTime = performance.now();
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(loop);

    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", resize);
    closeBtn.focus();
  }

  function close() {
    cancelAnimationFrame(frame);
    canvas.removeEventListener("pointerdown", onPointerDown);
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("resize", resize);
    dialog.hidden = true;
    document.body.classList.remove("is-playing");
    returnFocusTo?.focus();
  }

  closeBtn.addEventListener("click", close);

  return { open, close };
}
