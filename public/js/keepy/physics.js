export const TUNING = {
  gravity: 1900,
  gravityPerTouch: 14,
  kickSpeed: 880,
  kickSpeedRandom: 120,
  kickSpeedPerTouch: 4,
  sideKick: 320,
  sideRandom: 90,
  difficultyCap: 60,
  wallBounce: 0.8,
  floorBounce: 0.35,
  settleSpeed: 220,
  hitRadius: 1.9,
};

export function createBall(x, y) {
  return { x, y, vx: 0, vy: 0, angle: 0, spin: 0 };
}

function difficulty(score) {
  return Math.min(score, TUNING.difficultyCap);
}

/**
 * Applies a kick if the tap is close enough to the ball.
 * Returns true when the kick counts.
 */
export function kick(ball, radius, tapX, tapY, score) {
  const dx = ball.x - tapX;
  const dy = ball.y - tapY;
  if (Math.hypot(dx, dy) > radius * TUNING.hitRadius) return false;

  const level = difficulty(score);
  const offset = Math.max(-1, Math.min(1, dx / radius));
  const wildness = 1 + level / TUNING.difficultyCap;

  ball.vy = -(
    TUNING.kickSpeed +
    Math.random() * TUNING.kickSpeedRandom +
    level * TUNING.kickSpeedPerTouch
  );
  ball.vx =
    ball.vx * 0.35 +
    offset * TUNING.sideKick * wildness +
    (Math.random() - 0.5) * TUNING.sideRandom * wildness;
  ball.spin = offset * 9 + (Math.random() - 0.5) * 3;
  return true;
}

/**
 * Advances the ball by dt seconds inside the pitch.
 * Returns "flying", "bounced" or "dropped".
 */
export function step(ball, dt, { width, floor, radius, score }) {
  ball.vy += (TUNING.gravity + difficulty(score) * TUNING.gravityPerTouch) * dt;
  ball.x += ball.vx * dt;
  ball.y += ball.vy * dt;
  ball.angle += ball.spin * dt;
  ball.vx *= 0.995;
  ball.spin *= 0.99;

  if (ball.x < radius) {
    ball.x = radius;
    ball.vx = Math.abs(ball.vx) * TUNING.wallBounce;
    ball.spin *= -0.6;
  } else if (ball.x > width - radius) {
    ball.x = width - radius;
    ball.vx = -Math.abs(ball.vx) * TUNING.wallBounce;
    ball.spin *= -0.6;
  }

  if (ball.y < radius) {
    ball.y = radius;
    ball.vy = Math.abs(ball.vy) * 0.4;
  }

  if (ball.y > floor - radius) {
    ball.y = floor - radius;
    if (Math.abs(ball.vy) > TUNING.settleSpeed) {
      ball.vy = -ball.vy * TUNING.floorBounce;
      ball.vx *= 0.7;
      return "bounced";
    }
    ball.vx = 0;
    ball.vy = 0;
    ball.spin = 0;
    return "dropped";
  }

  return "flying";
}
