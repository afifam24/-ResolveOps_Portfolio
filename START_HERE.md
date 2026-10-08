# ResolveOPS Luminous v4

This release includes the enlarged carousel, masked service names, brighter text,
Syne footer typography, specular buttons, reference border glow and the new workflow section.

Extract into a NEW folder and open the folder containing package.json.

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 5182
```

Open http://127.0.0.1:5182. Stop older dev servers to avoid seeing an old release.
At /release.json the version must be `resolveops-luminous-v4`.

Production: `npm run build`, then `npm run preview -- --host 127.0.0.1 --port 5182`.
The rebuilt dist folder is included. SPA hosting needs fallback to index.html.
REDESIGN_README.md describes the changes. QA_REPORT.md records verification.
