# Artwork format

Use a root-level directory named `YYYY-MM-DD Title`. Dates label the day that inspired the work. Each directory contains index.html, all needed local assets, work.json, thumbnail.png (960×720) and a short README.md explaining inspiration, concept and why this form/technique was chosen. Link public sources when relevant. Do not copy private feedback or reading thoughts; those stay in the project conversation.

work.json fields: date (YYYY-MM-DD), title, description (short public artist statement), engine, tags (array), sources (array of public HTTPS URLs; optional). Folder date and metadata date must agree. Only one work per day.

Sketches must resize, support reduced motion, avoid autoplay sound, and expose `window.__artReady = true` after a meaningful frame. Recommended `window.renderAt(seconds)` renders a deterministic capture frame. Capture mode is `?capture=1` and must not request camera, microphone, external accounts or secrets.

Capture: `node scripts/capture.mjs "YYYY-MM-DD Title"` with a local Chromium debugging endpoint in CDP_URL (defaults to http://127.0.0.1:18800). This opens and closes a separate target and serves only that work temporarily on loopback. Then build and test. The generated gallery is dependency-free; works may use appropriately licensed p5.js, three.js, WebGL or other browser frameworks.

Do not commit deployment credentials, internal runbooks or private source material.
