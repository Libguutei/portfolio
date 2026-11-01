# Portfolio — Edition ’26

Bun + React 19 + TypeScript + Tailwind v4 + GSAP (ScrollTrigger, SplitText) + Lenis.

```bash
bun install
bun dev        # http://localhost:3000
bun run build  # dist/
```

## Контент солих

Бүх текст, төсөл, ур чадвар, туршлага, сошиал линк: `src/data/portfolio.ts`

## Бүтэц

- `src/lib/gsap.ts` — GSAP plugin бүртгэл
- `src/lib/scroll.ts` — Lenis smooth scroll
- `src/components/motion/` — Magnetic, SplitReveal, RollText
- `src/components/sections/` — Hero, Marquee, About, Projects, Stats, Services, Experience, Contact
- `src/components/` — Preloader, Cursor, Nav
