# For Siya

A small single-page site to ask Siya out. Plain HTML/CSS/JS, no build step.

## What it does

Four short "acts": a lead-in, a message, the question (with a playful **No** button that
runs away and a **Yes** that grows), and a celebration with heart confetti.

## See it live

Hosted on GitHub Pages: **https://bardian77.github.io/secret-website**

## Run it locally

Open `index.html` in a browser, or:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000

## Make it more personal (optional)

- **Add photos of you two (they float around the "She said yes." screen):** put image files
  in the `photos/` folder and list them in `MEMORY_PHOTOS` at the top of `script.js`.
  See `photos/README.md` for the exact steps.
- **Edit the words:** all the copy lives directly in `index.html`. The final line under
  "She said yes." is the easiest one to personalize.

## Edit it from your phone

Open **claude.ai/code**, pick the `secret-website` repo, and tell Claude what to change.
