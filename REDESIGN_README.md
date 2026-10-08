# ResolveOPS Luminous v4

Built on v3 in response to the six new screenshots, border glow video and
user-provided SpecularButton source. This folder contains the complete React project.

## Changes

1. Larger circular carousel: viewport grows from 460px to 650px on desktop and
   from 340px to 460px on mobile. Textured planes also use a larger scale.
2. Selected service typography: oversized Syne text sits behind the opaque cards
   and fades with a vertical mask. Buttons, keyboard and drag update it alongside
   the corresponding service details. All six real disciplines are represented.
3. Text color: neutral gray secondary text becomes lavender #D8CCFA, muted labels
   use #BAA6E5, section cues use cyan #67E8F9 and key titles stay white.
4. Footer: the old Manrope uppercase watermark becomes a fitted Syne 800
   ResolveOPS wordmark, with a slight slant, violet/cyan gradient and lower fade.
5. Buttons: the provided React Bits SpecularButton SDF shaders drive a pearl rim
   that follows cursor direction and fades with proximity. The diagonal sway and
   eased angle/brightness behavior follow the supplied source. CTA links and
   native buttons share ONE OGL context; their click, navigation and form semantics
   are preserved. The SpecularButton wrapper is used for carousel and workflow controls.
6. Card borders: crisp warm-white highlights and a diffuse violet halo follow the
   nearest edge, including proximity just outside the card, matching the supplied
   video direction. The center of the card stays clean. Contact, project, service,
   about, workflow and RØVA surfaces share the effect.
7. How we work: five compact native step buttons control a persistent detail panel
   with phase number, original description, focus list and progress indicator.
   Home and About share the same component; there are no empty tall inactive cards.

## Motion and resources

Button rendering is scissored to visible elements, excludes obscured controls,
uses a capped device pixel ratio and stops requesting frames after shine fades.
Its observers, event listeners and WebGL resources are removed on unmount.
Reduced motion and touch use static button/focus feedback. CircularGallery keeps
its reduced-motion/WebGL fallback and semantic controls. The card edge light uses
CSS variables and one scheduled pointer update without mousemove React state.
The Syne and Manrope fonts are bundled locally; no runtime font CDN is needed.

## Main files

src/components/ServiceCardStage.tsx / .css and CircularGallery.jsx / .css
src/components/SpecularButton.tsx, SpecularButtons.tsx, specular-shaders.ts / .css
src/components/BorderGlow.tsx
src/components/WorkflowJourney.tsx / .css (also used by ProcessTimeline.tsx)
src/theme-v4.css, src/index.css, src/components/SiteFooter.tsx

Original service/project copy, Contact enquiry flow, RØVA responses and loader
remain integrated. Contact composes a mailto/copy draft; no enquiry was sent in QA.
RØVA uses the existing curated local engine. This change adds no external AI backend.

## Component attribution

CircularGallery and the SpecularButton shader/lighting behavior are adapted from
React Bits source provided by the user. Source references:
https://reactbits.dev/components/circular-gallery
https://reactbits.dev/components/specular-button
https://github.com/DavidHDev/react-bits
The supplied prompts are retained in reference-prompts. Retain upstream license
requirements when redistributing those component adaptations. BorderGlow is a
local implementation based on the user's supplied video, not a claim of copying
an unseen React Bits BorderGlow component.
