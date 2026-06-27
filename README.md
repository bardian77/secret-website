# Secret Website

A plain HTML/CSS site, set up so it can be built and edited remotely from a phone.

## Build it from your phone (away from your laptop)

1. Open **claude.ai/code** in your phone's browser and sign in.
2. Pick this repository.
3. Type what you want — e.g. *"add a countdown timer to the homepage"* — and Claude builds it and commits the change.

Your laptop does not need to be on. The code lives on GitHub, so the cloud session and your phone always see the same thing.

## Run it locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000
