# UpPowerwash website

Single-page static marketing site for "Under Pressure Power Washing" (pressure washing service, Limburg & Vlaams-Brabant, Belgium). Dutch-language content.

## Stack
- Plain static HTML/CSS/JS — no framework, no build step, no package.json
- `index.html` (main page), `privacy.html` (privacy policy)
- `css/styles.css`, `js/main.js`
- `assets/` — logo, favicon
- Google Fonts (Poppins) loaded via CDN link in `<head>`

## Structure (index.html sections, in order)
`#hero` → `#diensten` (services) → `#projecten` (before/after) → `#werkwijze` (how it works) → `#waarom` (why us) → `#reviews` → `#contact`

## js/main.js
Three independent init functions wired on `DOMContentLoaded`:
- `initMobileNav` — hamburger menu toggle
- `initSmoothScroll` — smooth-scroll for in-page anchor links
- `initContactForm` — submits the contact form via `fetch` to a Formspree endpoint, shows inline success/error status

## Known placeholders (not yet filled in with real data)
- Contact section: WhatsApp/phone/email in `index.html` are placeholder numbers (`+32 495 00 00 00`) — search for `PLACEHOLDER:` comments
- Contact form `action` points to a placeholder Formspree URL (`https://formspree.io/f/XXXXXXXX`)
- "Voor & Na" (before/after) and "Reviews" sections use placeholder content — real photos/reviews are pending

## Conventions
- All visible copy is Dutch
- No JS framework/build tooling — edits to `js/main.js`/`css/styles.css` take effect directly on page load
