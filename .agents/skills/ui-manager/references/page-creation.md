# Creating and reworking pages

Start with the closest small scaffold in `templates/pages/`, then make the copied route own its business behavior. Templates are intentionally generic and are not kept synchronized with generated pages.

## Classify the page

| Page shape   | Start from                  | Add in the generated route                                |
| ------------ | --------------------------- | --------------------------------------------------------- |
| List or CRUD | `templates/pages/list`      | Domain columns, filters, row actions, confirmation        |
| Form         | `templates/pages/form`      | Schema, controls, validation, submit feedback             |
| Detail       | `templates/pages/detail`    | Record loading, fields, actions, empty/not-found handling |
| Overview     | `templates/pages/dashboard` | Domain metrics, charts, summaries, activity               |
| Settings     | `templates/pages/settings`  | Preference sections, controls and save feedback           |

If no scaffold fits, build from the architecture and component contracts instead of copying an unrelated page.

## Creation workflow

1. Read the applicable project instructions and inspect the route tree with `rg --files src/routes`.
2. Decide the URL, route group, dynamic segments, and whether the page is a top-level navigation destination.
3. Copy the closest `templates/pages/<shape>/+page.svelte`, then inspect a nearby live page only for feature-specific behavior.
4. Create the smallest route surface needed: the copied `+page.svelte`, plus `+page.server.ts`, `+page.ts`, or a nested layout only when the feature requires them.
5. Compose the page with `PageContainer`, `PageHeader`, shared patterns, and UI primitives. Keep feature-specific state and validation in the feature.
6. Put real data access in the server seam. Handle loading, empty, error, and destructive states in proportion to the feature.
7. Register top-level navigation and use `resolve()` for every internal destination.
8. Add new strings to both locales and keep their object shapes aligned.
9. Run the complete verification pipeline.

## Existing page changes

For copy, labels, examples, styling corrections, or a small component insertion, patch the target page directly. Re-run formatting and the relevant checks, but do not recreate the route or refresh a page snapshot. Use the full workflow only when changing the page's structure, data boundary, navigation role, or archetype.

## Completion checklist

- The page lives in the correct route group and uses the existing shell.
- Data does not cross the server/client boundary incorrectly.
- Navigation, localization, responsive layout, dark mode, accessibility, and empty/error states are covered.
- The route does not import from `templates/`; its copied scaffold now belongs to the feature.
- If the route is the application home, set `config.app.homePath`; deleting a configured nav route hides its menu entry automatically.
- `npm run check`, `npm run lint`, and `npm run build` pass.
