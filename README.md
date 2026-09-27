# Midhun Sujith Nair — Portfolio

React + TypeScript + Vite. Warm charcoal + brass amber identity, Lenis
smooth scrolling, spring-physics motion throughout.

## Run

## Deploy (Vercel)

Vercel auto-detects this setup — no config file needed:

1. Push the repo to GitHub (see below).
2. Vercel → Add New → Project → import the repo.
3. Framework preset: **Vite**. Build command `npm run build`,
   output directory `dist`, install `npm install` — all defaults.
4. Deploy. Every future `git push` to the connected branch redeploys.

```bash
npm install
npm run dev      # local dev
npm run build    # type-check + production build → dist/
npm run preview  # serve the production build
```

Deploy `dist/` anywhere static (GitHub Pages, Vercel, Cloudflare Pages).
`base: './'` in `vite.config.ts` keeps asset paths working on project subpaths.

## Structure

```
src/
├── data/portfolio.ts        # ALL content: projects, posts, journey, skills
├── lib/anim.ts              # shared entrance variants (rise + de-blur)
├── lib/scroll.ts            # Lenis setup + anchor routing
├── components/
│   ├── chrome.tsx           # Cursor, Progress, Nav, SectionHead, Magnetic, Footer
│   ├── Hero.tsx             # staggered title, dot field, ambient orb
│   ├── Work.tsx             # WorkCard + tilting ProjectVisual
│   └── Sections.tsx         # Marquee, About, Journey, Writing, Contact
├── App.tsx
├── main.tsx
└── index.css                # design tokens + all styles
```

**To add a project**, append one object to `projects` in
`src/data/portfolio.ts` — `visual` picks the preview
(`aether` | `qr` | `pass` | `event`).

**Resume:** drop the PDF at `public/Midhun_Sujith_Nair_Resume.pdf`
(nav opens it in a new tab, hero downloads it). Rebuild/redeploy after
replacing the file; commit it — `dist/` is gitignored, `public/` is not.

## Motion principles

- One easing everywhere (`--ease-out` expo-out), blur-fade entrances
- Restrained by default: dot field + orb are pointer-only, tilt ≤ 6°
- Everything respects `prefers-reduced-motion` (Lenis off, still design)

## Links

- GitHub: https://github.com/midhun122
- LinkedIn: https://www.linkedin.com/in/midhunsujithnair/
- Blog: https://blog.inovuslabs.org/author/midhun/
