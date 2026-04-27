# VideoCircle Design System — Gold Brutalist

## 1. Visual Theme & Atmosphere

VideoCircle is a video-calling product styled like a terminal manifesto. The screen is near-black (`#080808`) and the only chromatic color is a single gold (`#D4A017`) — every surface, border, label, and CTA is some opacity of that one hue. Where most video apps lean rounded, glassy, and friendly, VideoCircle is rectangular, monospace, and a little stern.

The signature move is bracket-notation typography: every interactive element wears its label inside literal square brackets — `[JOIN]`, `[CHAT]`, `[V_C_26]`, `[2026]`, `[×]`. Combined with `Anton` display headlines that fill the viewport (uppercase, line-height 0.88, gold halo) and a faint animated ASCII canvas painting mono glyphs across the background, the interface reads like a control panel from a film about a brand that's too cool for skeuomorphism.

What makes the system distinctive is its **near-monochromatic discipline**. There is one accent color and ~10 opacities of it. Borders are gold-tinted at 0.12–0.38 alpha. Form panels are `rgba(4,4,4,0.82)` over the same near-black. Sharp corners are the default — MUI's theme is configured with `borderRadius: 0` and most surfaces honor that. Depth comes from 1px gold borders and soft text-shadow halos, not from drop-shadows or rounded cards.

**Key Characteristics:**
- Near-black canvas (`#080808`) with a 3.8% noise SVG overlay and an animated ASCII canvas backdrop on every full-screen page
- Single gold accent (`#D4A017`) used at ~10 opacity steps — there are no other chromatic colors except a coral error tone (`#FF7070`)
- `Anton` for hero display, `JetBrains Mono` for everything else, `Playfair Display` *italic* for small "script" overlines
- Bracket-notation as the visual language for controls and labels — preserved across every page
- Sharp corners by default (`border-radius: 0` from the MUI theme); rounded corners only on image previews and a few cards (10–20px)
- Hover = inversion. Gold-on-black ↔ black-on-gold. `:active` adds `transform: scale(0.94)` press
- Mouse-tracked radial spotlight (`--mouse-x` / `--mouse-y` updated globally on every `mousemove`) creates ambient parallax

## 2. Color Palette & Roles

Tokens live in `frontend/src/shared/styles/tokens.css`. Most existing class rules still hardcode the literals — new code should reference the vars.

### Primary
- **Gold Primary** (`#D4A017`) — the only chromatic color. Used for headline text, primary CTA fills, borders, icons, focus states, and every label that matters. Accessed via `var(--gold-primary)`.
- **Ink Primary** (`#080808`) — the page background and the inverted text color used on gold fills. `var(--ink-primary)`.

### Gold opacity ladder (the entire system runs on this)
| Token | Value | Use |
|---|---|---|
| `--gold-primary-soft` | `rgba(212,160,23,0.55)` | Secondary text, dim labels, italic overlines |
| `--gold-primary-dim` | `rgba(212,160,23,0.25)` | Default input borders, faint dividers |
| `--gold-primary-faint` | `rgba(212,160,23,0.03)` | Input field background tint |
| `--gold-glow` | `rgba(185,138,18,0.42)` | Glow halos on emphasized text |
| ad-hoc 0.88 | `rgba(212,160,23,0.88)` | Brand wordmark text (`.landingBrand`) |
| ad-hoc 0.75 | `rgba(212,160,23,0.75)` | Inactive tab text |
| ad-hoc 0.45 | `rgba(212,160,23,0.45)` | MUI input label resting state |
| ad-hoc 0.38 | `rgba(212,160,23,0.38)` | Stronger borders than `--dim` |
| ad-hoc 0.22 | `rgba(212,160,23,0.22)` | Form-panel borders, tab dividers |
| ad-hoc 0.12 | `rgba(212,160,23,0.12)` | Top-bar bottom border |
| ad-hoc 0.08 | `rgba(212,160,23,0.08)` | Tab hover background |

### Secondary & Accent
- **Coral Error** (`#FF7070`) — the one off-palette color, reserved for inline error text on `rgba(255,112,112,0.06)` panels.
- There is no neutral gray. "Lighter" gold is just lower-opacity gold.

### Surface
- **Page Black** (`#080808`) — every full-screen page background.
- **Panel Black 82%** (`rgba(4,4,4,0.82)`) — auth/guest form panels over the ASCII backdrop.
- **Panel Black 72%** (`rgba(4,4,4,0.72)`) and **60%** (`rgba(4,4,4,0.6)`) — variants for less-emphasized panels.
- **Field Tint** (`rgba(212,160,23,0.03)`) — MUI outlined-input fill, applied via the `goldTheme`.

### Legacy / unused — do not introduce in new code
`index.css` still defines `--accent: #00C8FF`, `--cta: #FF9D42`, and `--text: #DDE6F0` from a pre-gold design. The mouse-spotlight pseudo-element on `body::after` still uses the cyan token. Don't reach for these in new components — the palette is gold-only.

## 3. Typography Rules

### Font Family
- **Display**: `'Anton', 'Syne', sans-serif` — only used for hero/title headlines. Single weight (400). Uppercase. Tight tracking.
- **UI / Body / Controls**: `'JetBrains Mono', monospace` — every button, label, input, nav link, paragraph. Single source of typographic identity.
- **Script Overline**: `'Playfair Display', Georgia, serif` *italic* — small leading lines like "meet the world,", "enter the circle,", "your sessions,". The lower-case humanizing counterpoint to the brutalist Anton headers.
- Fallback `var(--font-body) = 'DM Sans'` exists in `index.css` but is rarely used directly — the mono is the body.

Loaded via `<link>` in `frontend/public/index.html`: Anton, Syne, Playfair Display, DM Sans, JetBrains Mono.

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Hero Display (landing) | Anton | `clamp(5.5rem, 19vw, 22vw)` | 400 | 0.88 | -0.01em | Two-word stack, gold halo `text-shadow` |
| Auth/Guest Title | Anton | `clamp(3.5rem, 10vw, 8rem)` | 400 | 0.88 | -0.01em | Two-line `<br/>` titles |
| History Title | Anton | `clamp(3.8rem, 21vw, 5.5rem)` | 400 | 0.88 | -0.01em | Two-line `<br/>` |
| Script Overline | Playfair Display *italic* | `clamp(1rem, 1.8vw, 1.4rem)` to `clamp(1.3rem, 2.2vw, 2rem)` | 400 | 1.0 | -0.01em | Color: `rgba(212,160,23,0.55)` |
| Brand Wordmark | JetBrains Mono | 0.72rem | 400 | normal | 0.06em | `rgba(212,160,23,0.88)` |
| Bracket Label | JetBrains Mono | 0.7–0.72rem | 400 | normal | 0.1em | UPPERCASE, color `#D4A017` |
| Nav Link Bracket | JetBrains Mono | 0.7rem | 400 | normal | 0.1em | UPPERCASE, 1px gold-70% border, padded `0.3rem 0.65rem` |
| Tab | JetBrains Mono | 0.72rem | 400 (700 active) | normal | 0.1em | UPPERCASE |
| Primary CTA Text | JetBrains Mono | 0.82rem | 400 (`.startBtn`) or 700 (`.authSubmitBtn`) | normal | 0.08–0.1em | UPPERCASE |
| Body / Control | JetBrains Mono | 0.82rem | 400 | normal | 0.06–0.08em | MUI input default |
| Caption | JetBrains Mono | 0.68–0.78rem | 400 | normal | 0.06–0.1em | Small metadata |

### Principles
- **One mono for everything UI**. There is no separate body sans/mono distinction — JetBrains Mono is the body. The system is intentionally typewriter-flavored.
- **Anton lives on its own pedestal**. Use Anton only for full-bleed page titles. It is never used for buttons, labels, or paragraphs.
- **UPPERCASE + letter-spacing on small mono text**. Every label-sized mono element (≤ 0.82rem) is `text-transform: uppercase` with `letter-spacing: 0.06–0.1em`. This compensates for monospace's denseness at small sizes.
- **Negative tracking on Anton**. Display text uses `letter-spacing: -0.01em` and tight `line-height: 0.88` — the opposite direction from body mono. The two systems do not borrow each other's tracking.
- **Italic Playfair as the only "soft" voice**. The script overline is the one place serifs and lower-case appear. Use it sparingly — once per page, above a major headline.

## 4. Component Stylings

### Buttons

**Solid CTA** — `.startBtn`, `.authSubmitBtn`, `.authTab.active`
- Background: Gold Primary (`#D4A017`)
- Text: Ink Primary (`#080808`), JetBrains Mono, UPPERCASE, `letter-spacing: 0.08–0.1em`
- Padding: `0.65rem 1.3rem` (start) / `0.9rem 1.5rem` (auth submit)
- Border: `1px solid #D4A017` (intentionally same color as fill — keeps geometry stable on hover)
- Radius: 0
- Hover: invert — `background: transparent; color: #D4A017;` (border carries the shape)
- Active: `transform: scale(0.96); opacity: 0.85`

**Bracket Outline** — `.navLinkBracket`, `.lobbyMediaBtn`
- Background: transparent
- Text: Gold Primary (`#D4A017`), JetBrains Mono, UPPERCASE, `letter-spacing: 0.1em`
- Padding: `0.3rem 0.65rem`
- Border: `1px solid rgba(212,160,23,0.7)`
- Radius: 0
- Hover: invert — `background: #D4A017; color: #080808; border-color: #D4A017;`
- Active: `transform: scale(0.94); opacity: 0.8`

**MUI buttons** inherit `goldTheme`. Match the bracket-notation language by labeling them `[ACTION]` rather than `Action` — a `<Button>` reading `[JOIN]` looks correct; reading `Join` does not.

### Cards & Containers

**Form Panel** — `.authFormPanel`, `.guestPanel`
- Background: `rgba(4,4,4,0.82)`
- Border: `1px solid rgba(212,160,23,0.22)`
- Padding: `0 1.8rem 1.8rem`
- Radius: 0
- Width: max 420px

**Image Preview** — `.heroPreviewImgWrap`
- Radius: 20px (the rare exception to sharp corners)
- 3D tilt on `mousemove` via inline `transform: perspective(900px) rotateX(...) rotateY(...)`
- No border; the image itself is the surface

**History Card Item** — `.historyCardItem`
- Background: transparent
- Top-only border: `1px solid rgba(212,160,23,0.22)` on adjacent siblings
- Code in mono left, formatted date in dim gold right
- Radius: 0

### Inputs (MUI, themed via `goldTheme.js`)

- Background: `rgba(212,160,23,0.03)` (faint gold tint over near-black)
- Text color: `#D4A017`, `'JetBrains Mono'`, `letter-spacing: 0.08em`
- Outline: `rgba(212,160,23,0.25)` resting → `rgba(212,160,23,0.6)` hover → `#D4A017` focused
- Label: `rgba(212,160,23,0.45)` resting → `#D4A017` focused, `letter-spacing: 0.06em`, 0.82rem
- Radius: 0 (`borderRadius: '0 !important'` on the notched outline)

### Navigation — `.landingTopBar`, `.landingBottomBar`
- Background: transparent (the page-level near-black shows through)
- Bottom border on top bar: `1px solid rgba(212,160,23,0.12)`
- Layout: `[BRACKET LABEL]   VideoCircle®   [NAV] [LINKS]` — a 3-zone flex layout
- Wordmark: `.landingBrand` (mono 0.72rem, 88% gold)
- Nav links: `.navLinkBracket` outline buttons with literal brackets in the text

### Page Backdrop (every full-screen page)

Three stacked layers, in order from back to front:
1. `<canvas className="pageCanvas">` — animated ASCII glyphs from `useASCIICanvas()`. Fixed-position, full viewport, 80ms repaint interval, very faint gold.
2. `<div className="pageOverlay" />` — darkening layer that softens the canvas under the content.
3. `<div className="pageContent ...">` — the actual page, which sits above both.

The body also carries a fixed SVG fractal-noise texture at 3.8% opacity (`body::before`) and a 700px radial gold spotlight following `--mouse-x` / `--mouse-y` (currently cyan in code, scheduled for re-tinting — see Legacy in §2).

### Distinctive Components

**Bracket-Notation Controls**
- Every control wears its label inside literal `[...]` characters in the JSX text.
- Examples in code today: `[V_C_26]`, `[JOIN AS GUEST]`, `[REGISTER]`, `[LOGIN]`, `[START A MEETING]`, `[FREE]`, `[INSTANTLY]`, `[ANYWHERE]`, `[2026]`, `[HOME]`, `[SIGN IN]`, `[JOIN MEETING →]`, `[HISTORY]`, `[∅]` (empty state).
- Always uppercase, mono, letter-spaced 0.1em.

**ASCII Canvas Backdrop**
- `frontend/src/shared/hooks/useASCIICanvas.js` — returns a ref. Attach to a `<canvas>` placed before content.
- Self-managed: handles resize, runs an 80ms repaint, paints monospace glyphs at low gold opacity.
- Don't mount inside `<LiveKitRoom>` — too expensive next to live video.
- One canvas per full-screen page is the convention.

**Anton Hero Stack**
- `Playfair Display` italic overline ("meet the world,") above
- `Anton` two-line uppercase title with `<span class="heroLine">` per word, `line-height: 0.88`, `text-shadow: 0 0 80px rgba(212,160,23,0.25), 0 4px 40px rgba(0,0,0,0.8)`
- The pattern repeats on `/`, `/auth`, `/guest`, `/history` — keep it for any new full-page route.

**Empty State Icon**
- `<span className="historyEmptySymbol">[∅]</span>` — a bracketed glyph as the icon. New empty states should follow this idiom (e.g. `[—]`, `[∅]`, `[?]`) instead of pulling in `@mui/icons-material`.

## 5. Layout Principles

### Spacing System
- The base unit is `0.5rem` (8px). Most spacing values are in `rem`: 0.2, 0.3, 0.4, 0.5, 0.65, 0.75, 0.9, 1, 1.3, 1.5, 1.8, 2, 3, 4.
- Top bar padding: `2rem` horizontal.
- Form panel padding: `1.8rem` horizontal, `1.8rem` bottom.
- Generous vertical breathing on hero sections (`flex: 1` between top and bottom bars).

### Page Frame
Every full-screen page follows the same 3-row vertical frame:

```
┌─────────────────────────────────────────────┐
│ landingTopBar    [BRACKET]  Brand  [LINKS] │   header
├─────────────────────────────────────────────┤
│ landingHero / authCard / guestMain / ...    │   main (flex: 1)
├─────────────────────────────────────────────┤
│ landingBottomBar  [2026]  [START A MEETING] │   footer
└─────────────────────────────────────────────┘
```

The frame is reused with content swapped in. New top-level pages should adopt it.

### Containers
- Width: full-viewport. The design is edge-to-edge; there is no centered max-width container.
- Hero is a `flex-direction: row` split between text-left (40–55%) and image-right (max-width 44%). On narrow viewports, it stacks.

### Border Radius
- **Default: 0** (set globally via `goldTheme.shape.borderRadius = 0` and `borderRadius: '0 !important'` on MUI notched outlines).
- **10px**: occasional small CSS-module exceptions in `videoComponent.module.css`.
- **20px**: the hero image preview container (`.heroPreviewImgWrap`) — the only major rounded surface in the system.
- Don't introduce 8px or 12px rounding "to soften" — the brutalism is intentional.

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No border, no shadow | Page background, ASCII canvas backdrop |
| Hairline (Level 1) | `1px solid rgba(212,160,23,0.12)` | Top-bar bottom border, sibling list dividers |
| Contained (Level 2) | `1px solid rgba(212,160,23,0.22)` | Form panels, tab dividers, history rows |
| Outlined Interactive (Level 3) | `1px solid rgba(212,160,23,0.7)` | Bracket-outline buttons, focus precursor |
| Solid (Level 4) | `1px solid #D4A017` + gold fill or transparent | Primary CTAs, focused inputs, active tabs |
| Halo (Level 5) | `text-shadow: 0 0 60–80px rgba(212,160,23,0.2–0.25), 0 4px 30–40px rgba(0,0,0,0.8)` | Anton hero text — the only "lift" effect |

**Shadow Philosophy**: VideoCircle communicates depth through **border weight and opacity**, not box-shadows. The only shadows in the system are text-shadows on hero titles (creating a soft gold halo over the page noise) and a barely-perceptible dark fall (`0 4px 40px rgba(0,0,0,0.8)`) that pushes the text off the canvas. There are no card drop-shadows.

### Decorative Depth
- **ASCII canvas + noise + spotlight** stack: each adds atmospheric texture without geometric depth — the page feels lit, not layered.
- **Mouse-tracked spotlight**: a 700px radial gradient at `var(--mouse-x) var(--mouse-y)` follows the cursor across the whole document. Subtle, always-on.
- **Hover inversion**: instead of lifting a button on hover, swap fill and text color. The geometry stays put; the chrome flips.

## 7. Do's and Don'ts

### Do
- Use `var(--gold-primary)` and `var(--ink-primary)` for new code — stop hard-coding `#D4A017` / `#080808`.
- Use the gold opacity ladder for any "muted" effect — never reach for a gray.
- Wrap controls in literal `[...]` brackets in the JSX text. It is the brand voice, not decoration.
- Use `JetBrains Mono` UPPERCASE with `letter-spacing: 0.06–0.1em` for any small UI text.
- Use `Anton` only for page-title hero text, paired with a `Playfair Display` italic overline.
- Default to `border-radius: 0`.
- On hover, invert fill/text colors. On `:active`, scale to 0.94–0.96.
- Place the standard `landingTopBar` / main / `landingBottomBar` frame on every new full-screen page.
- Mount one `useASCIICanvas` per full-page route, behind a `pageOverlay`.
- Use the `<span>[∅]</span>` idiom for empty states and inline glyph icons.

### Don't
- Don't introduce a second accent color. There is one accent and one error tone (coral `#FF7070`) — that's it.
- Don't use the legacy `--accent: #00C8FF` / `--cta: #FF9D42` tokens from `index.css`. They predate the gold palette and are scheduled for retirement.
- Don't round corners on cards, buttons, or panels. The `.heroPreviewImgWrap` (20px) is the lone exception, and it's an image container, not a UI surface.
- Don't use sans-serif body text. JetBrains Mono is the body — DM Sans / Syne / system-ui are not.
- Don't use `Anton` for anything except full-page hero titles. It does not work at small sizes.
- Don't add box-shadow drop-shadows to cards or buttons. Depth is borders + text-shadow halos.
- Don't write button labels as `Save` or `Join`. Write `[SAVE]` / `[JOIN]`.
- Don't mount `useASCIICanvas` inside `<LiveKitRoom>` — it competes with live video for paint cycles.
- Don't lift on hover (`translateY(-2px)`, scale up). Hover means **invert**, not float.
- Don't introduce a centered max-width container. The design is edge-to-edge.

## 8. Responsive Behavior

### Breakpoints (implicit; CSS uses `clamp()` more than media queries)

| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <768px | Hero stacks vertical; image preview moves below text; `landingHero` becomes `flex-direction: column`. |
| Tablet | 768–1199px | Two-zone layout returns; hero `flex-direction: row` with image at ~44% max-width. |
| Desktop | 1200px+ | Full-bleed two-column hero; Anton title hits its `clamp` ceiling (22vw). |

### Touch Targets
- Bracket-outline buttons (`.navLinkBracket`) are `0.3rem 0.65rem` padded — fine for desktop, tight on mobile. New mobile-primary controls should use the `.startBtn` / `.authSubmitBtn` size class (`0.65–0.9rem` padding).
- Form inputs inherit MUI sizing, which is comfortable.

### Scaling Strategy
- **Fluid type via `clamp()`**: hero titles use `clamp(min, vw, max)` so the headline grows with the viewport without media-query stair-stepping.
- **Edge-to-edge always**: the design has no narrow content column to collapse — only horizontal padding (`2rem`) reduces.
- **Image preview** scales with `max-width: 44%` and stacks below text on narrow viewports.
- **ASCII canvas** auto-resizes; no manual breakpoint logic needed.

### Image Behavior
- Hero preview maintains aspect ratio inside its 20px-radius container.
- 3D tilt (mousemove → `rotateX/rotateY`) is desktop-only; on touch, the listener fires once on `touchstart` and never resets — acceptable but not designed for.

## 9. Agent Prompt Guide

### Quick Token Reference
- Brand fill: **Gold Primary `#D4A017`** / `var(--gold-primary)`
- Page background: **Ink Primary `#080808`** / `var(--ink-primary)`
- Form-panel background: `rgba(4,4,4,0.82)`
- Form-panel border: `rgba(212,160,23,0.22)`
- Body text on dark: Gold Primary `#D4A017`
- Inverted text on gold fills: Ink Primary `#080808`
- Dim secondary text: `rgba(212,160,23,0.55)` / `var(--gold-primary-soft)`
- Faint border: `rgba(212,160,23,0.12)`
- Error text: Coral `#FF7070` on `rgba(255,112,112,0.06)`

### Example Component Prompts

- "Create a full-screen page with the standard frame: a `<canvas className='pageCanvas'>` from `useASCIICanvas`, a `<div className='pageOverlay'>`, and a `landingTopBar` / main / `landingBottomBar` layout. Background `#080808`. Top-bar bottom border `1px solid rgba(212,160,23,0.12)`."

- "Add a hero stack: a Playfair Display italic overline at `clamp(1rem, 1.8vw, 1.4rem)` in `rgba(212,160,23,0.55)`, then an `Anton` two-line title in uppercase `#D4A017`, `font-size: clamp(3.5rem, 10vw, 8rem)`, `line-height: 0.88`, `letter-spacing: -0.01em`, with `text-shadow: 0 0 60px rgba(212,160,23,0.2), 0 4px 30px rgba(0,0,0,0.8)`."

- "Make a bracket-outline button: text `[SAVE]` in JetBrains Mono `0.7rem` UPPERCASE `letter-spacing: 0.1em` color `#D4A017`, transparent background, `1px solid rgba(212,160,23,0.7)` border, `0.3rem 0.65rem` padding, `border-radius: 0`. On hover invert to `background: #D4A017; color: #080808;`. On active `transform: scale(0.94); opacity: 0.8;`."

- "Make a solid CTA: gold fill `#D4A017`, ink text `#080808`, JetBrains Mono `0.82rem` UPPERCASE `letter-spacing: 0.08em`, `0.65rem 1.3rem` padding, `1px solid #D4A017` border (matches fill), `border-radius: 0`. Hover inverts to transparent fill with gold text; the border carries the shape."

- "Place a form panel `max-width: 420px`, `background: rgba(4,4,4,0.82)`, `1px solid rgba(212,160,23,0.22)`, sharp corners. Inside, MUI `<TextField outlined>` will pick up `goldTheme` automatically — gold text, gold focus outline, dim gold label."

- "Empty-state block: large `<span>[∅]</span>` glyph in `Anton` or mono, then `<h3>` and `<p>` in JetBrains Mono with `rgba(212,160,23,0.55)` body color. No icon library — bracketed glyphs only."

### Iteration Guide
1. **Default to gold-on-black**. If you reach for a second color, stop — you don't need it.
2. **Bracket the labels**. `[ACTION]` not `Action`. Always.
3. **Mono everywhere except hero titles**. Anton is reserved; Playfair italic is the rare overline; everything else is JetBrains Mono.
4. **Reference the var, not the hex**. New code should use `var(--gold-primary)` and the opacity tokens. Existing literals stay until the file is touched for other reasons.
5. **Sharp corners by default**. If a comp shows rounded corners, ask before adding them.
6. **Hover inverts**. Don't lift, don't glow — swap fill and text.
7. **Page = top-bar + main + bottom-bar + ASCII canvas backdrop**. Reuse the frame; don't invent a new one.
