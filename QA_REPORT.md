# QA — ResolveOPS Luminous v4

Verified 7 October 2026 with Chromium automation and visual screenshot inspection.

## Requested changes

- Enlarged carousel viewport: 1360 × 650px at the desktop test size, with larger card planes.
- Six service selections drive both the details and the masked background title.
  Next selects UI/UX; the right arrow selects SEO; horizontal drag selects UI/UX.
- Normal vertical wheel scrolling does not change the selected service.
- Desktop-to-mobile resizing preserves the gallery position after the resize fix.
- Body and secondary copy use lavender #D8CCFA; muted labels use #BAA6E5.
- Syne display font is loaded locally and verified. Footer wordmark fits within 1440px.
- Specular shine uses one shared OGL canvas and the supplied SDF shaders.
  Pointer proximity/angle changes the rim; all native button semantics remain in place.
- Edge glow is approximately 0.997 near the tested workflow border and 0 at its center.
  The screenshot shows the pearl highlight, violet falloff and clean panel interior.
- Workflow selection displays Design & Build with its full description and focus items.
  A mobile Test & Launch panel is also captured after selecting phase 04.

## Functional checks

TypeScript and Vite production build pass. Home, Services, Work, About and Contact
render without horizontal document overflow. At a 390px mobile viewport there is
no horizontal overflow, the workflow selectors wrap, and the enlarged carousel fits.
RØVA opens and returns a service response. Reduced motion switches the gallery to
its static image fallback, removes the specular WebGL canvas and leaves service
selection working. No browser JavaScript or console errors were recorded.

The existing 3D scene reports a THREE.Clock deprecation warning. Vite reports large
main/3D bundle warnings; they do not prevent the successful production build.

## Evidence

qa-v4/results.json and final-checks.json contain the browser check outputs.
qa-v4/ contains desktop and mobile screenshots of the gallery, buttons, border glow,
workflow, contact form and corrected footer. Original business/service/project data
is preserved; screenshots from v3 were removed to avoid confusing the releases.

Mobile checks use a resized Chromium viewport; a physical phone was not tested.
No live email was sent. Production hosting/email delivery and device-specific GPU
failure are outside these checks. The implemented static WebGL fallback remains available.
