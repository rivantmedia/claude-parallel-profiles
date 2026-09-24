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
| `npm start`            | Serve the existing `out/` without rebuilding                     |
| `npm run lint`         | ESLint (Next's rules plus Rivant Media's type-aware house rules) |
| `npm run typecheck`    | Generate Next's route types, then `tsc --noEmit`                 |
| `npm run format:check` | Prettier with the Rivant house style and Tailwind class sorting  |
| `npm run format:write` | Same, writing the fixes                                          |

To check the build exactly as it will be deployed, under the project sub-path:

```bash
NEXT_PUBLIC_BASE_PATH=/claude-parallel-profiles npm run preview
# then open http://localhost:4173/claude-parallel-profiles/
```

## Environment

| Variable                | Default                                                  | Used for                                       |
| ----------------------- | -------------------------------------------------------- | ---------------------------------------------- |
| `NEXT_PUBLIC_BASE_PATH` | `""`                                                     | The sub-path the site is served from           |
| `NEXT_PUBLIC_SITE_URL`  | `https://rivantmedia.github.io/claude-parallel-profiles` | Canonical URLs, Open Graph, sitemap and robots |

The extension's version shown on the site is read from `../package.json` at
build time, so it never drifts from the release.

Any link to a file in `public/` (art, logos, the Open Graph image) must go through
`asset()` in `src/lib/asset.ts`, which adds the base path. Next adds it to its own
links, scripts and fonts, but not to plain strings.

## Deploying

`.github/workflows/pages.yml` builds and publishes the site on every push to
`main` that touches `website/**`, `CHANGELOG.md` (the changelog page renders it)
or the workflow itself, and on demand from the Actions tab. It reads the base
path from `actions/configure-pages`, so a custom domain needs no code change.

One-time setup: in the repository's **Settings > Pages**, set **Source** to
**GitHub Actions**.

## Where things live

- `src/content/`: all of the site's copy, as typed modules. Edit words here.
- `src/config/site.ts`: names, addresses, navigation and the Rivant Media details.
- `src/components/sections/`: one component per homepage section, in page order
  in `src/app/page.tsx`.
- `src/components/primitives/`: the design system's building blocks (Section,
  Container, Eyebrow, Heading, SplitText, Reveal, Parallax, Shape, PillButton,
  Command and more).
- `src/components/providers/Motion.tsx`: the scroll layer behind reveals,
  parallax and magnetic buttons.
- `src/styles/globals.css`: Rivant Media's tokens (nine greys, type scale,
  eases) plus the project's spark accents, and every motion class.
- `public/art/`: the six brand shapes. `public/brand/`: the official Rivant Media
  logos, used as supplied. `src/fonts/`: Blackout, with its SIL OFL licence.

## Brand

Rivant Media's brand rules apply throughout: monochrome greys, weight contrast
in headings (extrabold against extralight italic), shapes cropped off edges,
motion that eases out and settles, and nothing moving for people who ask for
reduced motion. The terracotta sparks are this project's own mark: use them for
the spark art and small live indicators, never for body text or large fills.

Not affiliated with or endorsed by Anthropic. Claude and Claude Code are
trademarks of Anthropic, PBC.
