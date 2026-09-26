# UpPowerwash website

Single-page static marketing site for "Under Pressure Power Washing" (pressure washing service, Limburg, Belgium). Dutch-language content.

## Stack
- Plain static HTML/CSS/JS — no framework, no build step, no package.json
- `index.html` (main page), `privacy.html` (privacy policy)
- `css/styles.css`, `js/main.js`
- `assets/` — logo, favicon, mascot cutouts (`mascotte-*.png`, transparent background), project photo (`project-voor-na-1.jpg`)
- Google Fonts (Poppins) loaded via CDN link in `<head>`
- `CNAME` at repo root — GitHub Pages custom domain (`uppowerwash.be`), DNS managed at Combell

## Structure (index.html sections, in order)
`#hero` → `#diensten` (services) → `#projecten` (before/after) → `#werkwijze` (how it works) → `#waarom` (why us) → `#reviews` → `#contact`

## js/main.js
Three independent init functions wired on `DOMContentLoaded`:
- `initMobileNav` — hamburger menu toggle
- `initSmoothScroll` — smooth-scroll for in-page anchor links
- `initContactForm` — submits the contact form via `fetch` to a Formspree endpoint, shows inline success/error status

## Known placeholders (not yet filled in with real data)
- Contact form `action` points to a placeholder Formspree URL (`https://formspree.io/f/XXXXXXXX`)
- "Reviews" section still uses placeholder quotes — real reviews are pending
- "Voor & Na" has one real photo (`assets/project-voor-na-1.jpg`); more can be added the same way (`.project-photo` inside `.before-after-grid`)

Real contact info in place: phone/WhatsApp `+32 456 94 17 81`, email `info@uppowerwash.be`.

## Mascot
`assets/mascotte-*.png` are cropped/cutout from a 4x3 sprite sheet the client supplied, background made transparent. Currently used: `mascotte-hogedruk` (hero), `mascotte-schild` (waarom section), `mascotte-piepen` (footer, decorative/`aria-hidden`).

## Conventions
- All visible copy is Dutch
- No JS framework/build tooling — edits to `js/main.js`/`css/styles.css` take effect directly on page load
