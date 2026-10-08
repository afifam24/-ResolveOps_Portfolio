# Resolveops reference-inspired loading screen

The supplied reference recording was used to recreate the large white character,
curious moving/blinking eyes, rapid shrink, two satellite dots, wobble and settle.
The wordmark reads exactly `Resolveops`. This is a CSS recreation, not the original
source animation, so it is not a pixel-identical copy. The phone frame, video-player
controls and recording background are not part of the loader.

Changed source files:
- src/components/WelcomeOrbLoader.tsx
- src/components/WelcomeOrbLoader.css
- src/App.tsx

Behaviour: plays for 2.4 seconds on each full page load/refresh, then fades for
350 ms. Client-side navigation does not replay it. It waits for window.load with
a five-second fallback. Reduced-motion users receive a brief static screen.
Background content remains inert and scrolling is locked until the intro exits.

## Run in Antigravity

Open the extracted ResolveOps_Portfolio folder, then run:

```sh
npm install
npm run dev
```

For deployment:

```sh
npm run build
```

To update your existing Git checkout, copy the three changed source files above
into the same paths, review `git diff`, then commit/push through your usual workflow.
Do not replace your existing .git directory. No Git push was performed here.

## Follow-up prompt for Antigravity

Inspect LOADER_README.md and the three changed source files. Run this React/Vite
project and preserve the implemented reference-inspired white orb character intro.
Keep the visible wordmark exactly “Resolveops”. Validate at 390x844 and 1440x900:
large face emerging from the bottom, eye motion, shrink into a small centered orb,
two orbiting satellites, elastic settling, wordmark reveal, then a smooth site
reveal. Keep the intro on full page load/refresh only, retain reduced-motion
support, inert background, scroll restoration, and the load timeout. Compare with
the supplied reference video if attached, refine timing only where needed, and
avoid unrelated page redesigns. Run npm run build and inspect the real browser
before reporting completion. Show the diff before committing or pushing.
