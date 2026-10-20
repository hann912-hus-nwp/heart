
const canvas = document.getElementById("heart");
const ctx = canvas.getContext("2d");

const colors = [
  "#4682b4", "#1e90ff", "#00bfff",
  "#6495ed", "#4169e1"
];

const particles = [];
let startTime = performance.now();

function heart(t) {
  return {
    x: 16 * Math.sin(t) ** 3,
    y: -(13 * Math.cos(t)
      - 5 * Math.cos(2 * t)
      - 2 * Math.cos(3 * t)
      - Math.cos(4 * t))
  };
}

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  createParticles();
}

function createParticles() {
  particles.length = 0;

  const scale = Math.min(innerWidth / 42, innerHeight / 34);
  const cx = innerWidth / 2;
  const cy = innerHeight / 2;

  function add(x, y, order, size) {
    particles.push({
      x: cx + x * scale,
      y: cy + y * scale,
      order,
      size,
      color: colors[Math.floor(Math.random() * colors.length)],
      word: ["love you", "Love You", "LOVE YOU"][
        Math.floor(Math.random() * 3)
      ],
      phase: Math.random() * Math.PI * 2,
      delay: order * 12
    });
  }

  // Heart outline
  for (let i = 0; i < 160; i++) {
    const p = heart(i / 160 * Math.PI * 2);
    add(p.x, p.y, i, 12 + Math.random() * 5);
  }

  // Heart fill
  for (let i = 0; i < 125; i++) {
    const t = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * 0.83;
    const p = heart(t);
    add(p.x * r, p.y * r, 180 + i, 10 + Math.random() * 4);
  }
}

function draw(now) {
  const elapsed = now - startTime;
  const w = innerWidth;
  const h = innerHeight;

  ctx.clearRect(0, 0, w, h);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (const p of particles) {
    const progress = Math.max(0, Math.min(1,
      (elapsed - p.delay) / 650
    ));

    if (progress <= 0) continue;

    const flicker = 0.75 + 0.25 *
      Math.sin(now * 0.004 + p.phase);

    ctx.globalAlpha = progress * flicker;
    ctx.font = `bold ${p.size}px Arial`;

    ctx.shadowColor = p.color;
    ctx.shadowBlur = 12;
    ctx.fillStyle = p.color;
    ctx.fillText(p.word, p.x, p.y);
  }

  // Twinkling blue particles around the heart
  for (let i = 0; i < 100; i++) {
    const p = particles[i * 2];
    if (!p) continue;

    ctx.globalAlpha = 0.25 + 0.75 *
      Math.abs(Math.sin(now * 0.003 + p.phase));

    ctx.shadowColor = "#168bff";
    ctx.shadowBlur = 10;
    ctx.fillStyle = "#55cfff";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 1 + Math.random() * 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  requestAnimationFrame(draw);
}

window.addEventListener("resize", resize);
resize();
requestAnimationFrame(draw);
