function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function pentagon(ctx, radius, rotation) {
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = rotation + (i * 2 * Math.PI) / 5 - Math.PI / 2;
    const x = Math.cos(a) * radius;
    const y = Math.sin(a) * radius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function drawGround(ctx, width, floor, colour) {
  ctx.strokeStyle = colour;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, floor + 0.5);
  ctx.lineTo(width, floor + 0.5);
  ctx.stroke();
}

function drawShadow(ctx, ball, radius, floor, height, colour) {
  const lift = Math.max(0, floor - radius - ball.y);
  const scale = Math.max(0.25, 1 - lift / (height * 0.8));
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.ellipse(ball.x, floor - 2, radius * scale, radius * 0.18 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawBall(ctx, ball, radius, squash, ink, paper) {
  ctx.save();
  ctx.translate(ball.x, ball.y);
  const s = squash * 0.12;
  ctx.scale(1 + s, 1 - s);
  ctx.rotate(ball.angle);

  ctx.fillStyle = paper;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.clip();
  ctx.fillStyle = ink;
  ctx.strokeStyle = ink;
  pentagon(ctx, radius * 0.36, 0);
  ctx.fill();
  ctx.lineWidth = 1.6;

  for (let i = 0; i < 5; i++) {
    const a = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * radius * 0.36, Math.sin(a) * radius * 0.36);
    ctx.lineTo(Math.cos(a) * radius * 0.78, Math.sin(a) * radius * 0.78);
    ctx.stroke();

    ctx.save();
    ctx.translate(Math.cos(a) * radius * 1.02, Math.sin(a) * radius * 1.02);
    pentagon(ctx, radius * 0.3, a + Math.PI / 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();

  ctx.strokeStyle = ink;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

export function render(ctx, { width, height, floor, radius, ball, squash }) {
  const ink = cssVar("--ink");
  const line = cssVar("--line");
  const paper = cssVar("--bg");

  ctx.clearRect(0, 0, width, height);
  drawGround(ctx, width, floor, line);
  drawShadow(ctx, ball, radius, floor, height, line);
  drawBall(ctx, ball, radius, squash, ink, paper);
}
