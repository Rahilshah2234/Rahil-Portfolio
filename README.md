# Rahil Shah · Portfolio

Personal portfolio built with React 19, Vite, TypeScript, Tailwind CSS v4, Framer Motion and Lucide icons.

## Run it

```bash
npm install
npm run dev       # local dev server
npm run build     # type-check + production build into dist/
npm run preview   # serve the production build
```

## Edit content

Every fact on the site lives in `src/data/profile.ts`: name, links, projects,
skills, timeline, certifications and extracurriculars. Change it there; no
component needs touching.

## Structure

| File | What it renders |
| --- | --- |
| `components/Loader.tsx` | "Loading the card" counter, the 3D ability card and the "Click to enter" gate (skipped on repeat visits in the same tab) |
| `components/Header.tsx` | Fixed header with rolling nav links, live IST clock and full-screen menu |
| `components/Hero.tsx` | Headline with rotating interest, CTAs, tilting ability card, status bar |
| `components/Doors.tsx` | "One door per project" wall: draggable, swipeable, doors swing open on hover, project sheet on click |
| `components/Toolkit.tsx` | Skills marquee, skill groups, languages |
| `components/Story.tsx` | "Let's go back in time": pinned horizontal timeline on desktop, vertical on mobile |
| `components/Certifications.tsx` | Certification rows with fill-on-hover, volleyball block |
| `components/Closing.tsx` | Call to action, footer, contact modal (opens the visitor's email app) |
| `components/Cursor.tsx` | Custom cursor on mouse devices only |

Animations respect `prefers-reduced-motion`. The custom cursor is off on touch devices.

## Deploy to GitHub Pages

`vite.config.ts` uses `base: './'`, so the `dist/` folder works at any path.
Push the repo, then in **Settings → Pages** pick **GitHub Actions** and use the
"Static HTML" workflow with `npm ci && npm run build` and `path: dist`.
