# Design QA

## Visual truth and evidence

- Primary hero reference: `/Users/samoilov2004/Downloads/ChatGPT Image 23 авг. 2026 г., 03_52_41.png` — 1487 × 1058
- Section reference: `/Users/samoilov2004/Downloads/ChatGPT Image 23 авг. 2026 г., 04_00_21.png` — 1024 × 1536
- Sleeping-cat pose reference: `/Users/samoilov2004/Desktop/Screenshot 2026-08-23 at 05.13.18.png` — 1592 × 1018
- Final hero capture: `design/implementation-paper-hero.png`
- Final 1024 px viewport: `design/implementation-paper-1024-viewport.png`
- Final section captures: `design/implementation-paper-work.png`, `design/implementation-paper-education.png`, `design/implementation-paper-tech.png`, `design/implementation-paper-contacts.png`
- Final tablet capture: `design/implementation-paper-tablet.png`
- Final mobile captures: `design/implementation-paper-mobile.png`, `design/implementation-paper-mobile-work.png`, `design/implementation-paper-mobile-tech.png`, `design/implementation-paper-mobile-contact.png`
- Side-by-side hero comparison: `design/qa-paper-hero-comparison.png`
- Section comparison board: `design/qa-paper-sections-comparison.jpg`
- Revision hero capture: `design/qa-hero-revision.jpg`
- Revision side-by-side comparison: `design/qa-comparison-revision.png`
- Sleeping-cat revision captures: `design/qa-hero-sleeping-revision.jpg`, `design/qa-cat-sleeping-focus.jpg`
- Education alignment capture: `design/qa-education-alignment-revision.jpg`
- Technology 6 × 6 capture: `design/qa-tech-6x6-revision.jpg`
- Sleeping-cat focused comparison: `design/qa-cat-pose-comparison.png`

The hero comparison normalizes the source and browser capture to the same pixel frame without cropping. The section board compares the complete structural reference against four real rendered section states.

## Fidelity review

- Layout: the hero keeps the reference composition and scale — identity and contacts on the left, the night-window scene on the right, followed by `Work → Education → Open Source → Technologies → Contacts`. The removed `What I do` block leaves no excess gap.
- Typography: self-hosted Kalam is used for display text and Patrick Hand for navigation/body copy. Both fonts reached `document.fonts.status = loaded` in the browser.
- Color and surfaces: the implementation maps the approved paper, navy-ink, and orange tokens directly. Surfaces use thin rules, almost no rounding, no gradients, no shadows, and no generic floating UI cards.
- Imagery: the active cat/window scene is a 2658 × 2364 high-resolution master for 4K displays. The cat now matches the supplied sleeping pose — curled body, closed eyes, and head on its paws — while the established skyline, plant, palette, and editorial rendering remain consistent. The previous looking-at-camera hero is recoverable from `legacy/cat-window-looking-at-camera-2026-08-23/`. Books, plane, and moon use background-free PNGs so no pale rectangles show against the paper.
- Icons: interface symbols use local Iconoir SVG files. Technologies, profiles, and schools use local official SVG marks, including the supplied and whitespace-trimmed MEPhI vector; no emoji, inline SVG, CSS illustration, or placeholder art is present.
- Content: MEPhI replaces HSE for 2026–2028, the open-source statement is neutral, LinkedIn replaces email in the three-link hero row, six profile/contact links remain in Contacts, and 36 technology pins are grouped into six named categories.

## Responsive and interaction checks

- 1487 × 1058: hero aligned to the source; single-line name; cat and note fully visible; no horizontal overflow.
- 1024 × 1536: hero and editorial sections retain a balanced two-column rhythm; all raster assets load without layout stretching.
- 768 × 1024: navigation remains usable and the hero keeps the intended compact side-by-side composition.
- 390 × 844: desktop navigation is hidden; name, details, GitHub/Telegram/LinkedIn links, and the sleeping-cat scene stack in the required order; each technology category becomes a balanced 3 × 2 grid; no horizontal overflow.
- Wide desktop: the content remains bounded by the 1320 px editorial canvas rather than producing an empty expanding layout.
- All five anchor links update the hash and active menu state correctly. The final section is selected when the page reaches the bottom.
- GitHub, Telegram, Kaggle, LeetCode, and LinkedIn links use `_blank` with `noreferrer`; email uses `mailto:`.
- Skip-link is present and targets a programmatically focusable `main` element. All links have visible focus outlines.
- `prefers-reduced-motion` disables smooth scrolling and effectively removes transitions/animations; reveal content remains visible.
- Browser console: zero warnings and zero errors.
- Local image audit: 47 rendered images, zero failed loads. Both self-hosted fonts report loaded. No horizontal overflow at desktop, tablet, or mobile checkpoints.

## Comparison passes and fixes

### Pass 1 — hero proportions

- Finding: the name wrapped to two lines and the window sat too low relative to the source.
- Fix: restored the source-like single-line scale and independently aligned text and art without affecting reveal animation.

### Pass 2 — raster sizing

- Finding: width-constrained books, plane, and moon retained their HTML height attributes, making Education and Contacts much taller than the reference.
- Fix: applied intrinsic proportional scaling to all images. Education and Contacts now match the reference density and the contact strip returns to a compact desktop height.

### Pass 3 — navigation state

- Finding: intersection-ratio selection could leave the previous item active after an anchor jump.
- Fix: active navigation now follows a stable scroll marker, updates immediately on click, and handles the bottom-of-page Contacts state.

### Pass 4 — mobile cat note

- Finding: the source note became hard to read when placed directly over the dark window at 390 px.
- Fix: retained the exact source crop but moved it into the paper gap immediately above the window, keeping the annotation readable without obscuring the cat.

### Pass 5 — 4K imagery and paper surfaces

- Finding: the original 685 × 610 cat crop visibly softened on high-density displays, while the books, plane, and moon carried slightly different paper-colored rectangles.
- Fix: replaced the hero source with a 2658 × 2366 restored master and switched the supporting drawings to alpha-transparent PNGs. The final 1487 × 1058 comparison confirms the hero still follows the approved reference composition.

### Pass 6 — dense technology catalog

- Finding: the 12-item flat list no longer reflected the fuller categorized badge system the user preferred.
- Fix: restored 38 compact icon badges across six categories, preserving the warm editorial visual language and maintaining three columns at 390 px without overflow.

### Pass 7 — education and contact revisions

- Finding: the education path and profile set were outdated; the supplied MEPhI logo had large internal whitespace and appeared too small in the timeline.
- Fix: replaced HSE with MEPhI / Machine Learning, trimmed only the SVG viewBox, added Kaggle, LeetCode, and LinkedIn, and verified the two-column mobile contact layout at 390 × 844.

### Pass 8 — sleeping pose, education rhythm, and 6 × 6 technologies

- Finding: the restored cat looked at the viewer instead of sleeping; the MEPhI row used a wider grid track than the other schools; technology groups had uneven counts and ragged final rows.
- Fix: generated a non-destructive sleeping-pose edit from the active hero plus the supplied pose reference, archived the previous hero, moved all three education text blocks onto one shared start line, widened the MEPhI mark inside a uniform logo column, and reduced every technology category to exactly six pins. ONNX, Matplotlib, and Seaborn were removed.
- Post-fix evidence: `design/qa-cat-pose-comparison.png` confirms the closed-eye curled pose; the browser measured all Education text blocks at the same x-coordinate; all six technology lists contain six items at desktop and form 3 × 2 grids at 390 px.

## Final result

final result: passed
