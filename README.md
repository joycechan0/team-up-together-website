# Team Up Together — Nonprofit Website

A modern, responsive single-page website for the fictional nonprofit **Team Up Together**, built with plain HTML, CSS, and JavaScript (no frameworks, no build step).

## Sections

- **Home / Hero** — headline, calls to action, floating impact cards
- **Mission** — purpose statement and core values
- **Programs** — six program cards with themed visuals
- **Impact** — animated statistics counters and a testimonial
- **Volunteer** — sign-up form with validation
- **Donate** — call-to-action with selectable donation amounts
- **Contact** — contact details, socials, and a validated message form
- **Footer** — navigation and newsletter sign-up

## Features

- Fully responsive (mobile, tablet, desktop) with a collapsible mobile nav
- Scroll-reveal animations via `IntersectionObserver`
- Animated number counters in the Impact section
- Client-side form validation with inline feedback
- Sticky header, smooth scrolling, and a back-to-top button
- Accessible markup (ARIA labels, `prefers-reduced-motion` support)

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page structure and content |
| `styles.css` | Styles, layout, responsive rules |
| `script.js`  | Interactivity (nav, reveal, counters, forms) |

## Usage

Just open `index.html` in any modern browser — no installation required.

To serve locally (optional):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

> Note: Forms are front-end only and simulate submission. To make them live,
> connect them to a backend or a form service (e.g. Formspree, Netlify Forms).
