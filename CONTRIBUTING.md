# Artwork format

Use a root-level directory named `YYYY-MM-DD Title`. Dates label the day that inspired the work. Each directory contains index.html, all needed local assets, work.json, thumbnail.png (960×720) and a short README.md explaining inspiration, concept and why this form/technique was chosen. Link public sources when relevant. Do not copy private feedback or reading thoughts; those stay in the project conversation.

work.json fields: date (YYYY-MM-DD), title, description (short public artist statement), engine, tags (array), sources (array of public HTTPS URLs; optional). New works also include a public concept object with nonempty plain-text strings: subtitle (optional translation used as subtitle), heading, summary, question, form, time, interaction. Each string must be 1–4000 characters; all seven keys are required when concept is present, and unknown keys are rejected. This allows the gallery to display the complete concept, not just link a README. Never put private feedback or research reflections in metadata. Legacy works without concept retain an explicit README fallback. Folder date and metadata date must agree. Only one work per day.

Sketches must resize, support reduced motion, avoid autoplay sound, and expose `window.__artReady = true` after a meaningful frame. Recommended `window.renderAt(seconds)` renders a deterministic capture frame. Capture mode is `?capture=1` and must not request camera, microphone, external accounts or secrets.

Capture: `node scripts/capture.mjs "YYYY-MM-DD Title"` with a local Chromium debugging endpoint in CDP_URL (defaults to http://127.0.0.1:18800). This opens and closes a separate target and serves only that work temporarily on loopback. Then build and test. The generated gallery is dependency-free; works may use appropriately licensed p5.js, three.js, WebGL or other browser frameworks.

Read DESIGN.md for exhibition principles and the reference survey. Before each new publication, evaluate whether gallery scale, typography, layout, color and viewing mode still fit the actual work. Scoped gallery revisions are permitted when a concrete mismatch warrants them, with tests and real rendering verification; no forced daily restyling. Preserve work URLs, accessibility, reduced-motion behavior, privacy and source provenance. Do not change hosting/network policy or identity as part of design evolution.

Do not commit deployment credentials, internal runbooks or private source material.
