# Repository Guidelines

## Project Structure & Module Organization

Application code lives in `src/`. SvelteKit routes are grouped under `src/routes/(app)` for authenticated screens and `src/routes/(auth)` for login flows. Shared application code belongs in `src/lib`; keep portable, downstream-safe code in `src/lib/core`, while auth, i18n, mock data, and app-shell integrations remain outside it. Static files live in `static/`, contributor documentation in `docs/`, and maintenance scripts in `scripts/`. Tests are colocated with their subjects as `*.test.ts` files.

## Build, Test, and Development Commands

- `npm install`: install dependencies (use the Node versions declared in `package.json`).
- `npm run dev`: start the Vite development server.
- `npm run check`: run Svelte and TypeScript diagnostics.
- `npm run lint`: check Prettier formatting and ESLint rules.
- `npm test`: run the Vitest suite once.
- `npm run build`: create a production build; use `npm run preview` to inspect it.
- `npm run check:export`: validate the portable-core export contract.

Before opening a pull request, run the same verification sequence as CI: `npm run check && npm run lint && npm test && npm run build && npm run check:export`.

## Coding Style & Naming Conventions

Use TypeScript, Svelte 5 runes, and existing SvelteKit patterns. Prettier enforces tabs, single quotes, no trailing commas, and a 100-character line width; run `npm run format` to apply it. Name Svelte components in PascalCase (`PageHeader.svelte`), utilities and stores descriptively in kebab-case or lowercase (`route-registry.ts`, `calendar.ts`), and follow SvelteKit's `+page.svelte`/`+layout.ts` route conventions. Reuse existing UI primitives in `src/lib/core/components/ui` before adding dependencies or custom abstractions.

## Testing Guidelines

Vitest is the test runner. Add focused `*.test.ts` coverage beside non-trivial logic and regression fixes. There is no repository-wide coverage threshold; prioritize observable behavior and portable-core contracts. Run `npm test` locally, plus `npm run check` for component and type errors.

## Commit & Pull Request Guidelines

Recent history follows Conventional Commit-style subjects such as `feat:`, `fix:`, `refactor:`, `chore:`, and `style:`. Keep commits scoped and imperative. Pull requests should explain the change and validation performed, link relevant issues, and include screenshots for visible UI changes. Call out changes under `src/lib/core` because they may affect downstream exports.
