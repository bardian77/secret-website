// ====== CONFIG ======
// Add your photos to the images/ folder and list their filenames here.
// They'll appear (in order) on the celebration screen after she clicks "Yes".
const PHOTOS = [
  "images/us-1.jpg",
  "images/us-2.jpg",
  "images/us-3.jpg",
];

const INTRO_TEXT = "Hey SP, I have a question…";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ====== SCREEN HELPERS ======
const screens = {
  intro: document.getElementById("screen-intro"),
  question: document.getElementById("screen-question"),
  celebrate: document.getElementById("screen-celebrate"),
};

// Fluid hand-off: current screen lifts away, next eases in.
function showScreen(name) {
  Object.entries(screens).forEach(([key, el]) => {
    if (key === name) return;
    if (el.classList.contains("is-active")) {
      el.classList.remove("is-active");
      el.classList.add("is-leaving");
      setTimeout(() => el.classList.remove("is-leaving"), 700);
    }
  });
  // Next frame so the browser registers the starting transform before animating.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => screens[name].classList.add("is-active"));
  });
}

// ====== Tactile press + ripple on every button ======
function attachPressFX(btn, { ripple = true } = {}) {
  const press = () => btn.classList.add("is-pressed");
  const release = () => btn.classList.remove("is-pressed");

  btn.addEventListener("pointerdown", (e) => {
    press();
    if (ripple && !reduceMotion) spawnRipple(btn, e);
  });
  btn.addEventListener("pointerup", release);
  btn.addEventListener("pointerleave", release);
  btn.addEventListener("pointercancel", release);
}

function spawnRipple(btn, e) {
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2.2;
  const r = document.createElement("span");
  r.className = "ripple";
  r.style.width = r.style.height = size + "px";
  r.style.left = (e.clientX - rect.left) + "px";
  r.style.top = (e.clientY - rect.top) + "px";
  btn.appendChild(r);
  setTimeout(() => r.remove(), 600);
}

// ====== SCREEN 1: typewriter ======
const typedEl = document.getElementById("typed");
const continueBtn = document.getElementById("continue-btn");

function typeWriter(text, el, speed = 75) {
  if (reduceMotion) {
    el.textContent = text;
    continueBtn.classList.add("show");
    return;
  }
  let i = 0;
  (function step() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i++;
      const ch = text[i - 2];
      // Natural pauses on the comma and the trailing ellipsis.
      const delay = ch === "," ? speed * 5 : ch === "…" ? speed * 5 : speed;
      setTimeout(step, delay);
    } else {
      setTimeout(() => continueBtn.classList.add("show"), 450);
    }
  })();
}

continueBtn.addEventListener("click", () => showScreen("question"));

// ====== SCREEN 2: question + runaway No button ======
const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");

let dodgeCount = 0;
function dodge() {
  noBtn.classList.add("runaway");

  const pad = 14;
  const w = noBtn.offsetWidth;
  const h = noBtn.offsetHeight;
  const maxX = Math.max(pad, window.innerWidth - w - pad);
  const maxY = Math.max(pad, window.innerHeight - h - pad);

  const x = Math.random() * (maxX - pad) + pad;
  const y = Math.random() * (maxY - pad) + pad;

  // Each escape it shrinks a touch and tilts — playful, never disappears.
  dodgeCount++;
  const scale = Math.max(0.55, 1 - dodgeCount * 0.05);
  const tilt = (Math.random() * 26 - 13).toFixed(1);

  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";
  noBtn.style.transform = `rotate(${tilt}deg) scale(${scale})`;
}

attachPressFX(noBtn, { ripple: false });
noBtn.addEventListener("click", (e) => { e.preventDefault(); dodge(); });
noBtn.addEventListener("mouseenter", dodge);

attachPressFX(yesBtn);
yesBtn.addEventListener("click", (e) => {
  if (!reduceMotion) burstHearts(e.clientX, e.clientY);
  // Let the burst + press read for a beat, then glide to celebration.
  setTimeout(() => {
    showScreen("celebrate");
    buildGallery();
    startHearts();
  }, reduceMotion ? 0 : 280);
});

// A quick pop of hearts radiating from the Yes button.
function burstHearts(cx, cy) {
  const chars = ["💖", "💕", "✨", "💗", "🩷"];
  for (let i = 0; i < 14; i++) {
    const b = document.createElement("span");
    b.className = "burst";
    b.textContent = chars[i % chars.length];
    const angle = (Math.PI * 2 * i) / 14;
    const dist = 60 + Math.random() * 70;
    b.style.left = cx + "px";
    b.style.top = cy + "px";
    b.style.setProperty("--bx", Math.cos(angle) * dist + "px");
    b.style.setProperty("--by", Math.sin(angle) * dist + "px");
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 900);
  }
}

// ====== SCREEN 3: gallery + hearts ======
function buildGallery() {
  const gallery = document.getElementById("gallery");
  if (gallery.dataset.built) return;
  gallery.dataset.built = "true";

  const list = window.__DEMO_PHOTOS || PHOTOS;
  list.forEach((src, idx) => {
    const img = new Image();
    img.alt = "Me & SP";
    img.style.setProperty("--tilt", `${(idx % 2 === 0 ? -1 : 1) * (2 + idx)}deg`);
    img.style.setProperty("--pd", `${0.5 + idx * 0.12}s`);
    // Only show photos that actually load, so missing files never leave broken icons.
    // Attach listeners BEFORE setting src — cached/data-URI images can fire load
    // synchronously, which would otherwise be missed and the photo never appears.
    img.addEventListener("load", () => gallery.appendChild(img));
    img.addEventListener("error", () => {});
    img.src = src;
  });
}

const HEART_CHARS = ["❤️", "💕", "💖", "💗", "💓", "💘", "🩷"];
let heartTimer = null;

function spawnHeart() {
  const heartsLayer = document.getElementById("hearts");
  const heart = document.createElement("span");
  heart.className = "heart";
  heart.textContent = HEART_CHARS[Math.floor(Math.random() * HEART_CHARS.length)];
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.fontSize = (1 + Math.random() * 1.8).toFixed(2) + "rem";
  const duration = 4.5 + Math.random() * 4;
  heart.style.animationDuration = duration + "s";
  heart.style.setProperty("--drift", (Math.random() * 140 - 70).toFixed(0) + "px");
  heartsLayer.appendChild(heart);
  setTimeout(() => heart.remove(), duration * 1000);
}

function startHearts() {
  if (heartTimer || reduceMotion) return;
  for (let i = 0; i < 14; i++) setTimeout(spawnHeart, i * 110);
  heartTimer = setInterval(spawnHeart, 320);
}

// ====== BOOT ======
typeWriter(INTRO_TEXT, typedEl);
