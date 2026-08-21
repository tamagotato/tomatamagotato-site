# The Annotation Note

A callout that reads as paper slapped onto the page, not as a bounded aside.

**Status:** draft, design settled, texture unresolved. First designed 2026-08-20.
**Origin:** a session auditing why AI-generated designs converge on the same
container-with-left-accent pattern.

---

## Why this exists

Most callouts are a rounded rectangle with a coloured left border. That pattern is
so common it reads as generic, and it has a specific failure: the left border ends
up carrying several unrelated meanings at once.

A survey of six canonical design systems found the left-border accent is not
actually prescribed anywhere:

| Device | Mentions across the six sources |
|---|---|
| Icon as signifier | rank 1 |
| Elevation / shadow | rank 2 |
| Scale / motion | rank 3 |
| Full border / outline | rank 4 |
| Background fill shift | rank 5 |
| **Leading-edge border** | **zero** |

Sources: Material 3 cards, Primer card, Primer banner, Carbon tile, Carbon
notification, GitHub alerts. Verified twice; the word "left" appears five times in
2,892 lines of guidance and every use is positional prose.

GitHub's own definition is the useful counter-model: alerts are "displayed with
distinctive colors **and** icons." Two redundant channels, deliberately.

---

## The object

Paper. Specifically a note printed on Boldr's signature stock, resting on the page
with something pressed into it.

### Anatomy

| Part | Value | Why |
|---|---|---|
| Stock | `sun` `#FFD22C` with ripple texture | Boldr's signature motif; `boldr-brand-2025.md` names feature callouts as a sanctioned bold use |
| Corners | square, `border-radius: 0` | Paper corners are not uniformly rounded. This is the single biggest departure from the generic pattern |
| Shadow | `0 1px 1px rgba(0,0,0,0.30), 0 10px 20px -6px rgba(0,0,0,0.55)` | Two layers: a tight contact line plus a wider drop. Contact is what reads as resting on a surface rather than floating in a layout |
| Rotation | `-1.1deg` | Perfect alignment kills the illusion. One to two degrees is enough |
| Curled corner | 26px linear-gradient, bottom right | Implies thickness |
| Padding | `20px 22px 22px 22px` | |
| Body type | 14px / 22px, `dusk` `#252D49` | 9.36:1 on stock |
| Label | Roboto Mono 11px, 500, `letter-spacing: 1.4px`, uppercase, `#8a4b00` | 4.70:1 on stock. Mono uppercase with wide kerning is the sanctioned Boldr treatment for captions and technical data |

### The severity stamp

Severity is **ink pressed into the paper**, not hardware sitting on top of it. This
matters: a stamp is part of the sheet, a pin is an object resting on it.

| Property | Value |
|---|---|
| Type | Big Shoulders Display, 21px, `letter-spacing: 1.6px`, uppercase |
| Fill | solid ink block, word knocked out to stock colour |
| Blend | `mix-blend-mode: multiply`, `opacity: 0.82` |
| Rotation | `-2.5deg`, `transform-origin: left center` |

Three details do the work:

1. **Multiply blending** lets the ripple texture read through the ink, so the stamp
   belongs to the paper rather than sitting on it.
2. **The rotation disagrees with the sheet.** The note is at `-1.1deg` and the stamp
   at `-2.5deg`. Two angles that do not match is what reads as pressed on afterwards.
3. **The word is inside the stamp.** Colour and text arrive as one element, so the
   severity distinction never depends on hue alone.

### Ink colours

| State | Token | Hex | Effective after multiply | Contrast |
|---|---|---|---|---|
| Warning | orange-900 | `#7a3300` | `#924808` | 4.60:1, AAA large and AA normal |
| Info | dusk | `#252D49` | `#4c4412` | 6.77:1, AAA large and AA normal |

**The warning ink is brown, not red, and this is deliberate.** Multiply blending
over yellow drags every red toward brown. `flame` `#D1001C` measures 3.43:1, which
passes AA for large text only and fails AAA. Every true red that survived the blend
failed. Real red ink on yellow stock genuinely does go brownish, so the physics and
the accessibility agree. The word WARNING carries the meaning.

---

## Attachments

Optional, decorative, and they carry no meaning.

| Attachment | Treatment | Note |
|---|---|---|
| Tape | 60x19px, `rgba(250,247,242,0.32)`, rotated 2deg, top edge | Needs 11px clearance above the note |
| Pin | 17px circle, `nimbus` `#75808A` | If used, set `transform-origin` at the pin so the rotation reads as physics |
| Clip | 22x46px, 2.5px `#8f9aa6`, bottom border transparent | Heaviest. Needs ~16px extra padding above the label |

**Do not use an attachment to carry severity.** That was tested and rejected: a red
dot and a grey dot are the same dot in greyscale.

---

## Rules

1. **Never let the label repeat the stamp.** WARNING above COMPETITIVE RISK says the
   same thing twice. If the stamp says WARNING, the label drops its severity word.
2. **Rotation collapses below 640px.** Set `rotate(0)` or the note overflows its
   column. The stamp keeps its own rotation.
3. **Attachments are rare.** A page full of pinned notes stops meaning anything.
   Default to the bare note.
4. **The stamp is the only severity channel.** No left border, no icon in addition,
   no coloured background per state. One device, one job.
5. **Minimum stamp size is 21px type.** Below that the knocked-out word loses its
   counters and the multiply blend muddies it.

---

## Verification

Run both before shipping a change:

- **Contrast.** Compute every pair against the actual stock colour, including the
  ripple texture underneath. The texture shifts the effective background.
- **Hue-stripped read.** Apply `filter: grayscale(1)` and confirm info and warning
  are still distinguishable. If they are not, the design depends on hue alone and it
  fails WCAG 1.4.1.

---

## Open items

1. **The ripple texture is a CSS approximation.** The real Change in Ripples motif is
   an Illustrator Blend Tool construction and no SVG exists in this repo
   (`find assets -iname "*ripple*"` returns nothing). Every contrast ratio above must
   be recomputed against the real asset, because the texture sits under the ink and
   moves the effective background.
2. **The stock inverts a sanctioned pairing.** `boldr-brand-2025.md` lists four ripple
   combinations, one of which is Sun on Boldr Orange. This note uses the inverse:
   sun stock with orange ripples. That is a deviation and needs a brand decision, not
   a silent pass.
3. **Type weight.** `boldr-brand-2025.md` line 74 assigns Big Shoulders **Extra Bold
   800** to "labels, violators, callouts, pull-quotes." The stamp currently uses 900.
   Either the spec changes to 800 or this is a documented exception.
4. **The text-wrap system is unbuilt.** The note is a block element today. A separate
   placement component should offer margin note, float with square and tight wrap,
   block interrupt, and column overlap, each with a declared narrow-width collapse.

---

## Reference implementation

Canvas with all directions, the rejected options, and the measured contrast table:
`https://claude.ai/code/artifact/95381dac-2d9d-474d-a322-dca263da2137`

Working `.dc.html` sources are not committed. Regenerate from the canvas if needed.

Live reference page in this repo: `docs/annotation-note.html`. Open it in a browser.
It is plain CSS with no build step and no Nuxt dependency.

---

## Applying this to tomatamagotato-site

**The file to change is `app/assets/css/report.css`.** It currently defines:

| Class | Current treatment | Action |
|---|---|---|
| `.report-callout.info` | 4px left border, blue `#4d96ff`, radius 12px, no icon | Replace with the note plus an INFO stamp |
| `.report-callout.warning` | 4px left border, yellow `#ffd93d`, radius 12px, no icon | Replace with the note plus a WARNING stamp |
| `.report-quote` | 3px left border, coral `#ff6b6b`, radius `0 8px 8px 0` | **Keep unchanged.** A left rule on a blockquote is legitimate typographic convention and the one sanctioned use of the leading edge |

Two defects to fix while in there:

1. **Both callouts carry a `transition` on `background-color`, `border-color` and
   `color` but have no hover rule, and `cursor: auto`.** Dead CSS, copied forward from
   an interactive component. Delete it.
2. **The blog index cards** (`.blog-index-card`) fade a `border-left-color` from
   transparent to olive `rgb(85,112,47)` on hover. That is a whole-surface click
   target signalled by a single edge, so the signifier shape does not match the target
   shape. Replace with elevation plus scale (`box-shadow: 0 8px 20px rgba(0,0,0,0.14)`
   and `transform: scale(1.015)`), and guard it with `prefers-reduced-motion`.

Note that this site runs the system font stack and loads no webfont. The stamp needs
Big Shoulders Display, so add it before using the note here.
