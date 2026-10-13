# Motion / Interaction Contract

**Style C = restrained cinematic polish.** Visual quality comes primarily from typography, composition, authentic content and strong visual hierarchy, not continuously animated effects.

## Timings and constraints
- Standard tap/hover transitions: 150–220ms; max translate 4px.
- Card hover: 180–260ms; translate <=4px, modest border tint; focus gets an equally strong non-hover state.
- Enter viewport: <=500ms, opacity with <=16px translation, only once; only decorative movement, not access to content.
- Hero introductory effects: <=650ms, do not delay text visibility.
- Architecture explorer state changes: <=220ms; animation secondary to content update.
- Image zoom on hover <=1.025 scale; maintain object-fit; must not imply hidden tappable destination.
- No scroll hijack, custom cursor, autoplay soundtrack, compulsory introduction animation, page-covering loader or gratuitous WebGL in MVP.

## Accessible fallback
CSS: `@media (prefers-reduced-motion: reduce)` disable transforms/parallax and smooth scroll; focus remains visible. React: `MotionConfig reducedMotion="user"` and `useReducedMotion()` where behavioral changes are needed. The document content renders semantically without JS, including project summaries, headings, image descriptions and contact methods.

## Interaction states to specify in component implementation
Every interactive component: `default`, `hover` (where applicable), `focus-visible`, `active/pressed` (where applicable), `disabled` (where applicable), `error` or `success` if applicable, and reduced-motion state. Don't misuse pointer cursor on decorative UI. Provide real feedback to clipboard action and unavailable features.

## Visual review
Capture before/after of focus, hover, mobile menu open and diagram selected states. Profile on midrange mobile: if the animation harms INP, power usage or legibility, simplify or remove it.
