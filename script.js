// For Siya - interactions: staged reveals, playful No button, heart confetti.

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------------------------------------------------
   Ambient petals (skipped entirely under reduced motion)
   --------------------------------------------------------- */
function seedPetals(count = 14) {
  if (prefersReducedMotion) return;
  const field = document.querySelector(".petals");
  if (!field) return;
  for (let i = 0; i < count; i++) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.left = `${Math.random() * 100}vw`;
    petal.style.animationDuration = `${9 + Math.random() * 9}s`;
    petal.style.animationDelay = `${-Math.random() * 12}s`;
    const scale = 0.6 + Math.random() * 1.1;
    petal.style.transform = `scale(${scale})`;
    field.appendChild(petal);
  }
}
seedPetals();

/* ---------------------------------------------------------
   Entrance reveals for whichever act is currently visible
   --------------------------------------------------------- */
function revealAct(section) {
  const items = section.querySelectorAll(".reveal, .stagger, .pop, .show");
  // next frame so the transition actually runs
  requestAnimationFrame(() => items.forEach((el) => el.classList.add("in")));
}

/* ---------------------------------------------------------
   Act navigation (button data-next="actId")
   --------------------------------------------------------- */
function goToAct(id) {
  const target = document.getElementById(id);
  if (!target) return;

  document.querySelectorAll(".act").forEach((act) => {
    if (act !== target) act.hidden = true;
  });

  target.hidden = false;
  target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
  revealAct(target);
}

document.querySelectorAll("[data-next]").forEach((btn) => {
  btn.addEventListener("click", () => goToAct(btn.dataset.next));
});

// Reveal the first act on load
window.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro");
  if (intro) revealAct(intro);
});

/* ---------------------------------------------------------
   Playful No button
   - On pointer devices: dodges away from the cursor.
   - Always: each attempt nudges the label toward "Yes",
     and the Yes button grows. Works under reduced motion too.
   --------------------------------------------------------- */
const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");

const NO_LABELS = [
  "No",
  "Are you sure?",
  "Really?",
  "Think again",
  "Please?",
  "Pretty please",
  "I made a whole website",
  "Last chance to say yes",
];
let noIndex = 0;
let yesScale = 1;

function escalate() {
  noIndex = Math.min(noIndex + 1, NO_LABELS.length - 1);
  noBtn.textContent = NO_LABELS[noIndex];
  yesScale = Math.min(yesScale + 0.18, 2.6);
  yesBtn.style.transform = `scale(${yesScale})`;
}

function dodge() {
  if (prefersReducedMotion) return; // keep it accessible: no jumping
  const pad = 16;
  const w = noBtn.offsetWidth;
  const h = noBtn.offsetHeight;
  const maxX = window.innerWidth - w - pad;
  const maxY = window.innerHeight - h - pad;
  const x = Math.max(pad, Math.floor(Math.random() * maxX));
  const y = Math.max(pad, Math.floor(Math.random() * maxY));
  noBtn.classList.add("dodging");
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
}

if (noBtn) {
  // mouseover handles desktop "can't click me"; click handles touch + keyboard
  noBtn.addEventListener("mouseover", () => { escalate(); dodge(); });
  noBtn.addEventListener("click", (e) => { e.preventDefault(); escalate(); dodge(); });
}

/* ---------------------------------------------------------
   Yes → celebrate + heart confetti
   --------------------------------------------------------- */
if (yesBtn) {
  yesBtn.addEventListener("click", () => {
    goToAct("celebrate");
    burstConfetti();
  });
}

/* ---------------------------------------------------------
   Heart confetti (self-contained canvas, no dependencies)
   --------------------------------------------------------- */
function burstConfetti() {
  if (prefersReducedMotion) return;

  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;

  function resize() {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);

  const colors = ["#e86a86", "#ffb3c4", "#f7ece9", "#ff8fa6"];
  const hearts = Array.from({ length: 110 }, () => ({
    x: Math.random() * window.innerWidth,
    y: -20 - Math.random() * window.innerHeight,
    size: 8 + Math.random() * 12,
    speed: 1.5 + Math.random() * 3,
    drift: (Math.random() - 0.5) * 1.4,
    rot: Math.random() * Math.PI,
    rotSpeed: (Math.random() - 0.5) * 0.1,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));

  function drawHeart(x, y, size, rot, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(size / 16, size / 16);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, 4);
    ctx.bezierCurveTo(0, 0, -8, 0, -8, 6);
    ctx.bezierCurveTo(-8, 11, 0, 14, 0, 18);
    ctx.bezierCurveTo(0, 14, 8, 11, 8, 6);
    ctx.bezierCurveTo(8, 0, 0, 0, 0, 4);
    ctx.fill();
    ctx.restore();
  }

  const start = performance.now();
  const DURATION = 5000;

  function frame(now) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hearts.forEach((h) => {
      h.y += h.speed;
      h.x += h.drift;
      h.rot += h.rotSpeed;
      if (h.y > window.innerHeight + 20) h.y = -20;
      drawHeart(h.x, h.y, h.size, h.rot, h.color);
    });
    if (now - start < DURATION) {
      requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  requestAnimationFrame(frame);
}
