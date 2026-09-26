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
`#hero` → `#diensten` (services) → `#projecten` (before/after) → `#werkwijze` (how it works) → `#waarom` (why us) → `#contact`

## js/main.js
Three independent init functions wired on `DOMContentLoaded`:
- `initMobileNav` — hamburger menu toggle
- `initSmoothScroll` — smooth-scroll for in-page anchor links
- `initContactForm` — submits the contact form via `fetch` to a FormSubmit.co endpoint, shows inline success/error status

## Known placeholders (not yet filled in with real data)
- "Reviews" section was removed (was showing made-up example quotes, which isn't something to publish as real). CSS for it (`#reviews`, `.reviews-grid`, `.review-card`) is still in `css/styles.css` for reuse — re-add the `<section id="reviews">` block once there are genuine client reviews to show.
- "Voor & Na" has one real photo (`assets/project-voor-na-1.jpg`); more can be added the same way (`.project-photo` inside `.before-after-grid`)

Real contact info in place: phone/WhatsApp `+32 456 94 17 81`, email `info@uppowerwash.be`.

## Contact form
`action="https://formsubmit.co/info@uppowerwash.be"` — no account/API key needed, FormSubmit forwards submissions by email. Requires a one-time activation click in a confirmation email FormSubmit sends to that inbox after the first-ever submission; until activated, submissions may not be delivered even though the client-side `fetch` gets a 200. A hidden `_honeypot` field is spam protection; `_subject`/`_template` set the forwarded email's subject and layout.

## Hosting & domain
Hosted on **GitHub Pages**, free because this repo is public (private repos need a paid GitHub plan for Pages). No server to manage — GitHub serves the repo's files directly.

- `CNAME` file at repo root (`uppowerwash.be`) tells GitHub Pages which custom domain to answer to.
- Domain is registered at **Combell**; DNS there points to GitHub: 4 A-records on the apex (`185.199.108.153`, `.109.153`, `.110.153`, `.111.153`) and a `www` CNAME to `uppowerwash.github.io`.
- HTTPS certificate is auto-issued/renewed by GitHub (Let's Encrypt) — no manual action needed.
- Deploys automatically on every push to `main` (Settings → Pages → source: "Deploy from a branch", `main` / root).

Stays working as long as: the repo stays public, the Combell domain registration keeps getting renewed, and nobody changes the DNS records above. No recurring cost beyond the yearly domain renewal at Combell.

## Mascot
`assets/mascotte-*.png` are cropped/cutout from a 4x3 sprite sheet the client supplied, background made transparent. Currently used: `mascotte-hogedruk` (hero), `mascotte-schild` (waarom section), `mascotte-piepen` (footer, decorative/`aria-hidden`).

**Cache-busting:** each `<img src="assets/mascotte-*.png">` in `index.html` has a `?v=N` query param. Bump it whenever a mascot PNG's *content* changes (not on unrelated edits) — GitHub Pages/browsers cache these images by filename, and without a version bump a visitor's browser can keep showing a stale image for a long time after a fix ships, which looks like the fix didn't work. Current: hogedruk `v=2`, schild `v=3`, piepen `v=3`.

`mascotte-schild` and `mascotte-piepen` are used on dark sections, but their prop (the shield / the wall) and the small droplet marks were originally drawn solid black — invisible against a dark background. Fixed by connected-component analysis on the black pixels: the prop is always the one big (~9500px) blob, recolored white; among the small (~350-900px) blobs, the ones touching the lime body are eyes (left black), the ones floating free of the body are the droplet marks, recolored to the same water-blue as the spray in `mascotte-hogedruk` (`rgb(115, 205, 250)`) since they read as water splashes. Uses 4-connectivity with a strict darkness threshold, needed because with looser (8-connectivity) settings the peeking mascot's eye — which sits right at the wall's edge — got fused into the wall's blob and wrongly recolored too. `mascotte-hogedruk`'s gun/hose prop was left black (no contrast problem there, it's not the biggest thing on a dark section the way the shield/wall were) — only its two droplet marks were recolored blue; a ~23px fleck near the gun trigger was excluded by a minimum-size check so it doesn't get mistaken for a droplet. If more poses from the sprite sheet get used later on a dark section, check for the same issue.

Every mascot eye has a tiny (~5-8px) white highlight dot inside the black pupil — that's original art style, not a bug, and it's present on all three poses.

## Conventions
- All visible copy is Dutch
- No JS framework/build tooling — edits to `js/main.js`/`css/styles.css` take effect directly on page load
