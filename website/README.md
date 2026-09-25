# Claude Parallel Profiles: website

The marketing and docs site for the
[Claude Parallel Profiles](https://marketplace.visualstudio.com/items?itemName=rivantmedia.claude-parallel-profiles)
VS Code extension, published by Rivant Media under **Rivant for the Community**.
It is a static Next.js site (App Router, TypeScript, Tailwind CSS v4) exported to
`out/` and served by GitHub Pages at
<https://rivantmedia.github.io/claude-parallel-profiles/>.

It lives beside the extension but is not part of it: `.vscodeignore` keeps
`website/**` out of the `.vsix`.

## Scripts

Run everything from this folder (`website/`), with Node 20.9 or newer.

| Command                | What it does                                                     |
| ---------------------- | ---------------------------------------------------------------- |
| `npm run dev`          | Development server at <http://localhost:3000>                    |
| `npm run build`        | Static export to `out/`                                          |
| `npm run preview`      | Build, then serve `out/` the way Pages will (see below)          |
| `npm start`            | Serve the existing `out/` without rebuilding (see below)         |
| `npm run lint`         | ESLint (Next's rules plus Rivant Media's type-aware house rules) |
| `npm run typecheck`    | Generate Next's route types, then `tsc --noEmit`                 |
| `npm run format:check` | Prettier with the Rivant house style and Tailwind class sorting  |
| `npm run format:write` | Same, writing the fixes                                          |

To check the build exactly as it will be deployed, under the project sub-path:

```bash
NEXT_PUBLIC_BASE_PATH=/claude-parallel-profiles npm run preview
# then open http://localhost:4173/claude-parallel-profiles/
```

`npm start` serves `out/` at the root unless it is given the same
`NEXT_PUBLIC_BASE_PATH` the build had; with a mismatch every page loads without
its styles and scripts.

## Environment

| Variable                | Default                                                  | Used for                                       |
| ----------------------- | -------------------------------------------------------- | ---------------------------------------------- |
| `NEXT_PUBLIC_BASE_PATH` | `""`                                                     | The sub-path the site is served from           |
| `NEXT_PUBLIC_SITE_URL`  | `https://rivantmedia.github.io/claude-parallel-profiles` | Canonical URLs, Open Graph, sitemap and robots |

The extension's version shown on the site is read from `../package.json` at
build time, so it never drifts from the release.

Any link to a file in `public/` (the brand shapes) must go through `asset()` in
`src/lib/asset.ts`, which adds the base path. Next adds it to its own links,
scripts and fonts, but not to plain strings. Metadata URLs (the Open Graph image,
canonical links) are relative and resolve against `metadataBase`, which already
carries the site URL and base path.

## Deploying

`.github/workflows/pages.yml` builds and publishes the site on every push to
`main` that touches `website/**`, `CHANGELOG.md` (the changelog page renders it),
the extension's `package.json` (the footer shows its version) or the workflow
itself, and on demand from the Actions tab. It reads the base path from
`actions/configure-pages`, so a custom domain needs no code change.

Pull requests that touch the same files run the same build, plus `lint`,
`format:check` and `typecheck`, without deploying.

One-time setup, before the first merge: in the repository's **Settings > Pages**,
set **Source** to **GitHub Actions**. That also creates the `github-pages`
environment. Without it the first run stops at "Configure Pages"; once it is set,
re-run the workflow from the Actions tab.

## Where things live

- `src/content/`: all of the site's copy, as typed modules. Edit words here.
  `site.ts` holds the name, metadata, nav and footer; `links.ts` every outside
  address. The version comes from the extension's `package.json` at build time.
- `src/components/sections/`: the four homepage sections, in page order in
  `src/app/page.tsx`: Hero, Demo (how it works, as an animation), Platforms and
  Install. Keep the page short: show how it works rather than explain it.
- `src/components/demo/`: the animated demo. `DemoTour.tsx` holds the story, one
  scene per step, with each step's length; the timings inside a step are CSS
  delays in `Demo.module.css`, so pausing holds them too. The step labels are in
  `src/content/demo.ts`.
- `src/components/primitives/`: the design system's building blocks (Section,
  SectionIntro, Container, Eyebrow, Heading, SplitText, Reveal, Parallax, Shape,
  PillButton, Command, MotionToggle and more).
- `src/components/providers/Motion.tsx`: the scroll layer behind reveals,
  parallax and magnetic buttons.
- `src/styles/globals.css`: Rivant Media's tokens (nine greys, type scale,
  eases) plus the project's spark accents, and every motion class.
- `public/art/`: the six brand shapes. The Rivant logomark is inlined by the
  `Logo` primitive, path as supplied. `src/fonts/`: Blackout (WOFF2), with its
  SIL OFL licence.
- `src/app/icon.png`, `apple-icon.png`: the extension's icon without its "by
  Rivant" sign-off, which is unreadable at favicon sizes; the nav and footer
  carry the lockup. The Marketplace keeps the signed icon (`images/icon.png`).

## Brand

Rivant Media's brand rules apply throughout: monochrome greys, weight contrast
in headings (extrabold against extralight italic), shapes cropped off edges,
motion that eases out and settles, and nothing moving for people who ask for
reduced motion. The terracotta sparks are this project's own mark: use them for
the spark art and small live indicators, never for body text or large fills.

Not affiliated with or endorsed by Anthropic. Claude and Claude Code are
trademarks of Anthropic, PBC.
