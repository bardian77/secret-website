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
   Floating memories on the "She said yes" screen
   ----------------------------------------------------------
   ADD YOUR PHOTOS HERE. Each item is an image URL or a path
   like "photos/1.jpg". Leave the array empty to show elegant
   placeholder frames. Use 3 to 5 photos for the best look.
   Use .jpg / .png / .webp (phone HEIC files won't show in a browser).
   --------------------------------------------------------- */
const MEMORY_PHOTOS = [
  "photos/web/1.jpg",
  "photos/web/2.jpg",
  "photos/web/3.jpg",
  "photos/web/4.jpg",
  "photos/web/5.jpg",
  "photos/web/6.jpg",
];

const MEM_POSITIONS_WIDE = [
  { left: "5%",  top: "14%", rot: -8 },
  { left: "80%", top: "11%", rot: 7 },
  { left: "2%",  top: "49%", rot: 6 },
  { left: "82%", top: "47%", rot: -7 },
  { left: "15%", top: "80%", rot: -4 },
  { left: "67%", top: "81%", rot: 6 },
];
const MEM_POSITIONS_NARROW = [
  { left: "2%",  top: "6%",  rot: -7 },
  { left: "62%", top: "5%",  rot: 6 },
  { left: "3%",  top: "78%", rot: 5 },
  { left: "60%", top: "82%", rot: -6 },
];

function makePlaceholder() {
  const ph = document.createElement("div");
  ph.className = "mem-media mem-ph";
  ph.textContent = "♥"; // heart glyph
  return ph;
}

function buildMemories() {
  const field = document.getElementById("memories");
  if (!field) return;
  field.innerHTML = "";

  const narrow = window.innerWidth < 768;
  const positions = narrow ? MEM_POSITIONS_NARROW : MEM_POSITIONS_WIDE;
  const count = MEMORY_PHOTOS.length
    ? Math.min(MEMORY_PHOTOS.length, positions.length)
    : positions.length;

  for (let i = 0; i < count; i++) {
    const p = positions[i];

    const slot = document.createElement("div");
    slot.className = "mem-slot";
    slot.style.left = p.left;
    slot.style.top = p.top;
    slot.style.setProperty("--rot", `${p.rot}deg`);
    slot.style.transitionDelay = `${i * 0.09}s`;

    const frame = document.createElement("div");
    frame.className = "mem-frame";
    frame.style.animationDuration = `${7 + Math.random() * 4}s`;
    frame.style.animationDelay = `${-Math.random() * 5}s`;

    const src = MEMORY_PHOTOS[i];
    if (src) {
      const img = document.createElement("img");
      img.className = "mem-media";
      img.src = src;
      img.alt = "";
      img.loading = "lazy";
      // If a photo fails to load, fall back to the placeholder frame.
      img.addEventListener("error", () => img.replaceWith(makePlaceholder()));
      frame.appendChild(img);
    } else {
      frame.appendChild(makePlaceholder());
    }

    slot.appendChild(frame);
    field.appendChild(slot);
  }

  // Reduced motion: skip the entrance animation, show them right away.
  if (prefersReducedMotion) field.classList.add("lit");
}

function animateMemoriesIn() {
  const field = document.getElementById("memories");
  if (field) requestAnimationFrame(() => field.classList.add("lit"));
}

buildMemories();

// Rebuild only when crossing the mobile breakpoint (handles rotate / resize).
let memWasNarrow = window.innerWidth < 768;
window.addEventListener("resize", () => {
  const nowNarrow = window.innerWidth < 768;
  if (nowNarrow === memWasNarrow) return;
  memWasNarrow = nowNarrow;
  const field = document.getElementById("memories");
  const wasLit = field ? field.classList.contains("lit") : false;
  buildMemories();
  if (wasLit) animateMemoriesIn();
});

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
  // Keep it off the keyboard tab order so Enter/Space can't activate it.
  noBtn.setAttribute("tabindex", "-1");

  // The No button can never actually be clicked: it flees on hover AND on the
  // first press (before a click can register), and any stray click is cancelled.
  const flee = (e) => {
    if (e && e.cancelable) e.preventDefault();
    escalate();
    dodge();
  };

  noBtn.addEventListener("pointerenter", flee); // desktop hover + first touch contact
  noBtn.addEventListener("pointerdown", flee);  // bail before a click can complete
  noBtn.addEventListener("click", flee);        // final safety net
}

/* ---------------------------------------------------------
   Yes → celebrate + heart confetti
   --------------------------------------------------------- */
if (yesBtn) {
  yesBtn.addEventListener("click", () => {
    goToAct("celebrate");
    animateMemoriesIn();
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

  const colors = ["#c4a6ff", "#9a78ff", "#e7dbff", "#b89bff"];
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
