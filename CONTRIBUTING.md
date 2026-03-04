# Contributing to Annapurna Rasoi

Thanks for contributing.

## Setup

1. Install Node.js 20+.
2. Run `npm install`.
3. Build pages: `npm run build`.
4. Validate quality: `npm run validate`.

## Branch & PR rules

- Create feature branches from `main`.
- Keep PRs focused and small.
- Include before/after screenshots for UI changes.
- Ensure accessibility and SEO checks pass.

## Code standards

- Use semantic HTML5.
- Maintain one `h1` per page.
- Keep metadata/canonical/schema accurate.
- Use lazy-loaded images with explicit dimensions.
- Format code with Prettier.

## Commit format

Use short imperative commits:

- `feat: add menu schema blocks`
- `fix: correct canonical URLs`
- `chore: update lint workflow`

## Testing checklist

- `npm run validate` passes.
- Navigation works on mobile and desktop.
- No broken internal links.
- Lighthouse: no critical SEO/accessibility regressions.
