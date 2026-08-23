# Design QA

## Evidence

- Source visual truth: `design/reference-homepage.png`
- Browser-rendered desktop hero: `design/implementation-hero.png`
- Browser-rendered desktop education/open-source view: `design/implementation-sections.png`
- Browser-rendered desktop technology view: `design/implementation-technologies.png`
- Browser-rendered mobile hero: `design/implementation-mobile-hero.png`
- Combined visual comparison: `design/qa-comparison.png`
- Source pixels: 1024 × 1536.
- Desktop CSS viewport: 1280 × 720 at device pixel ratio 2; captured content pixels: 1265 × 712 after browser scrollbar allocation.
- Mobile CSS viewport: 390 × 844 at device pixel ratio 1; captured content pixels: 375 × 812 after browser scrollbar allocation.
- State: dark theme, initial hero plus scrolled education/open-source/technology states.
- Density normalization: all comparison inputs were proportionally fit into equal 700 × 520 cells without cropping; the source is a tall composite while the implementation evidence uses real viewport states.

## Full-view comparison

`design/qa-comparison.png` places the source and all three desktop implementation states in one image. The implementation preserves the source's charcoal surface, warm-white monospaced typography, restrained acid-green accent, page-level grid, generous whitespace, thin dividers, small network signature, and icon-led technology index. The additional open-source row is an intentional user-requested extension.

## Focused region comparison

- Hero: checked separately in `design/implementation-hero.png`; identity, contacts, signature asset, and scroll cue match the selected direction while giving the name slightly more prominence.
- Education and open source: checked in `design/implementation-sections.png`; rows remain typographic and unboxed. The reference's circular timeline nodes were intentionally simplified to rules for easier maintenance and less ornament.
- Technologies: checked in `design/implementation-technologies.png`; all 12 labels and icons align to a consistent baseline without pills or cards.
- Mobile: checked in `design/implementation-mobile-hero.png`; the name wraps cleanly, all three contacts fit, the decorative asset remains secondary, and there is no horizontal overflow.

## Required fidelity surfaces

- Fonts and typography: IBM Plex Mono loads successfully; weights, tracking, line height, and hierarchy closely match the source. Body copy remains at readable product sizes.
- Spacing and layout rhythm: the hero occupies one viewport; sections use a consistent two-column grid on desktop and one-column layout on mobile. No broken margins, clipping, or horizontal overflow found.
- Colors and visual tokens: solid `#101210` background, warm text, neutral dividers, and one `#9dcc3f` accent match the reference. Quiet text was brightened during QA for small-text contrast.
- Image quality and asset fidelity: the network signature is a dedicated transparent PNG, not CSS art. Technology marks use real existing SVG badges or Devicon sources and remain crisp at 21–24 px.
- Copy and content: name, role, employer, location, three education records, open-source summary, contacts, and all 12 technologies are present and accurate to the supplied project context.

## Interaction and browser checks

- The `Education / Technologies` cue scrolls to `#profile` and updates the URL hash.
- GitHub, Telegram, email, and open-source destinations were verified from rendered anchors.
- Desktop and mobile browser consoles contain no errors or warnings.
- The preserved `legacy/` site loads independently, displays its H1, and has no console errors or warnings.

## Comparison history

### Pass 1

- P2: the Bash logo was too dark against the charcoal background because native black SVG fills survived the first grayscale filter.
- P2: quiet 12–13 px helper and footer text used a borderline low-contrast token.

Fixes:

- Normalized all technology marks with a grayscale/invert filter and retained native brand color on hover.
- Raised the quiet text token from `#6f726b` to `#858780`.

Post-fix evidence:

- `design/implementation-technologies.png` shows all 12 marks visibly and consistently.
- `design/implementation-hero.png` shows the revised scroll cue contrast.

## Follow-up polish

- P3: institution-specific education marks could be explored later, but the current text-only rows better support the requested small-site scope.

## Final result

final result: passed
