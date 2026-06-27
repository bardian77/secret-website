// ====== CONFIG ======
// Add your photos to the images/ folder and list their filenames here.
// They'll appear (in order) on the celebration screen after she clicks "Yes".
const PHOTOS = [
  "images/us-1.jpg",
  "images/us-2.jpg",
  "images/us-3.jpg",
];

const INTRO_TEXT = "Hey SP, I have a question…";

// ====== SCREEN HELPERS ======
const screens = {
  intro: document.getElementById("screen-intro"),
  question: document.getElementById("screen-question"),
  celebrate: document.getElementById("screen-celebrate"),
};

function showScreen(name) {
  Object.values(screens).forEach((s) => s.classList.remove("is-active"));
  screens[name].classList.add("is-active");
}

// ====== SCREEN 1: typewriter ======
const typedEl = document.getElementById("typed");
const continueBtn = document.getElementById("continue-btn");

function typeWriter(text, el, speed = 75) {
  let i = 0;
  (function step() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i++;
      // Slight natural pause on the comma and ellipsis.
      const ch = text[i - 2];
      const delay = ch === "," ? speed * 5 : ch === "…" ? speed * 4 : speed;
      setTimeout(step, delay);
    } else {
      continueBtn.classList.remove("continue-hidden");
    }
  })();
}

continueBtn.addEventListener("click", () => showScreen("question"));

// ====== SCREEN 2: question + runaway No button ======
const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");

function dodge() {
  // Detach the button so it can roam anywhere on screen.
  noBtn.classList.add("runaway");

  const pad = 12;
  const w = noBtn.offsetWidth;
  const h = noBtn.offsetHeight;
  const maxX = Math.max(pad, window.innerWidth - w - pad);
  const maxY = Math.max(pad, window.innerHeight - h - pad);

  const x = Math.random() * (maxX - pad) + pad;
  const y = Math.random() * (maxY - pad) + pad;

  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";

  // A cheeky little wobble each time it escapes.
  noBtn.style.transform = `rotate(${(Math.random() * 30 - 15).toFixed(1)}deg)`;
}

// Move on click/tap, and also when a cursor gets near (desktop teasing).
noBtn.addEventListener("click", (e) => {
  e.preventDefault();
  dodge();
});
noBtn.addEventListener("mouseenter", dodge);

yesBtn.addEventListener("click", () => {
  showScreen("celebrate");
  buildGallery();
  startHearts();
});

// ====== SCREEN 3: gallery + hearts ======
function buildGallery() {
  const gallery = document.getElementById("gallery");
  if (gallery.dataset.built) return;
  gallery.dataset.built = "true";

  PHOTOS.forEach((src, idx) => {
    const img = new Image();
    img.src = src;
    img.alt = "Me & SP";
    img.loading = "lazy";
    img.style.setProperty("--tilt", `${(idx % 2 === 0 ? -1 : 1) * (2 + idx)}deg`);
    // Only show photos that actually load, so missing files don't leave broken icons.
    img.addEventListener("load", () => gallery.appendChild(img));
    img.addEventListener("error", () => {});
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
  const duration = 4 + Math.random() * 4;
  heart.style.animationDuration = duration + "s";
  heart.style.setProperty("--drift", (Math.random() * 120 - 60).toFixed(0) + "px");
  heartsLayer.appendChild(heart);
  setTimeout(() => heart.remove(), duration * 1000);
}

function startHearts() {
  if (heartTimer) return;
  for (let i = 0; i < 12; i++) setTimeout(spawnHeart, i * 120);
  heartTimer = setInterval(spawnHeart, 350);
}

// ====== BOOT ======
typeWriter(INTRO_TEXT, typedEl);
