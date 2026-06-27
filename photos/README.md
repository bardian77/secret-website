# photos

Your original uploads live in this folder (the `IMG_*.jpeg` / `IMG_*.JPG` files).

The site does NOT load those directly. They are large (several MB each), so smaller
web-optimized copies are generated into `web/` (`web/1.jpg`, `web/2.jpg`, ...) and those
are what the page uses. This keeps the page fast on a phone.

## To change which photos show

Edit `MEMORY_PHOTOS` near the top of `script.js`. It points at `photos/web/1.jpg` and so on.
Up to 6 photos drift around the "She said yes." screen (4 on phones).

## To add or replace photos later

1. Add a new `IMG` / `.jpg` here.
2. Make a web-sized copy in `web/`. On a Mac you can run:

   ```bash
   sips -s format jpeg -s formatOptions 72 -Z 1000 INPUT.jpg --out web/7.jpg
   ```

3. Add `"photos/web/7.jpg"` to `MEMORY_PHOTOS` in `script.js`.

Use `.jpg` / `.png` / `.webp`. Browsers can't display iPhone `.HEIC` files.
