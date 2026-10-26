# Svelte Admin Starter v2.0.0

This release fixes tab and form state failures, makes shared components safer to reuse, and connects application localization and branding. It includes behavior and TypeScript contract changes described below.

## What's changed

- Serialize tab creation and overflow confirmation, cancel pending work on reset, and preserve cached pages during route errors. Each tab keeps its own route parameters, URL, load data, and form result.
- Derive table pagination during SSR, normalize invalid page inputs, reuse a collator for sorting, and use a set for selection lookups. Sorting and search controls expose accessible, translatable labels.
- Recover authentication submissions after network or malformed-response failures, validate API and cached users, and honor the configured password minimum.
- Reject invalid date/time inputs, enforce inclusive calendar-day bounds, and preserve minute precision. Date formatting also handles early years and non-Gregorian calendars.
- Read theme and language from their shared state, add typed English/Chinese dictionaries and locale-aware application formatters, and synchronize the HTML language before and after hydration.
- Make AppShell the normal application page-title owner, resolve navigation through the configured base path, and give repeated pages unique form and SVG IDs.
- Share demo user records within each app-layout instance so list edits, creation, and deletion appear in detail tabs. Extract user drawers, shared presentation rules, and order fixtures.
- Prevent new line-item IDs from colliding with incoming rows, replace application runtime barrel imports with direct imports, and refresh the guides and page scaffolds.
- Unify repository instructions in `AGENTS.md` and canonical skills in `.agents/skills/`, removing client-specific forwarding files and skill adapters.

## Portable core (`src/lib/core`)

- Add `TAB_ROUTE` and `TabRoute`, optional route snapshots on the tab controller, and optional route props on KeepAliveOutlet and LayoutChain. A failed-load snapshot preserves the previous successful data. `leafCrumb.clear()` supports cleanup at the application boundary.
- Add pure pagination derivation and correct the DataTable's initial SSR page controls. Existing pagination controller methods remain available.
- Add the optional fourth `exportToCsv` argument, `CsvOptions`, with spreadsheet text protection enabled by default.
- Share guarded JSON storage helpers while preserving the different write semantics: `persisted` writes on assignment; `useLocalStorage` also tracks nested reactive changes through its effect.
- Add optional locale arguments and bounded caches to number, date, date-time, and relative-time formatters. Existing argument positions and English defaults remain available.
- Add optional translated ThemeToggle labels and SearchInput clear labels. Existing component and barrel entry points remain available; no existing core API is removed.

The downstream export contract remains `src/lib/core/**` plus `LICENSE`. Application auth, i18n, demo data, and shell adapters remain outside the portable core.

## Migration

1. **CSV output:** formula-like string cells and headers now receive a tab prefix inside quotes. Numeric values retain their numeric representation. General CSV integrations that require the original text can use `exportToCsv(rows, filename, columns, { spreadsheetSafe: false })`. Spreadsheet import and save behavior varies; quoting alone is not formula protection.
2. **Translation keys:** application `t()` accepts `TranslationKey`. Add keys to both locale dictionaries; use `translate()` for dynamic keys or broad portable-core callback contracts. Application formatting helpers live in `$lib/i18n/formatters`; portable formatters continue to accept an explicit locale.
3. **Custom auth providers:** return `{ ok: true, user }` on success or `{ ok: false, error }` on failure. Successful API responses and cached sessions must satisfy the `User` shape; malformed values are rejected.
4. **Cached routes and titles:** dynamic pages should consume the supplied `params` / `url` / `form` props or `TAB_ROUTE` rather than global page parameters. Normal app pages should leave `<title>` to AppShell and use `$props.id()` prefixes for repeated field and fragment IDs. Error pages retain their own titles.
5. **Demo user state:** custom mounts of the Users pages must provide `USERS_STATE` from `createUsersState()` in their layout context. Records are local to that app-layout instance and are not backend persistence.
6. **Date validation:** DateTimePicker min/max constrain the calendar day, including both boundary days. Valid seconds are normalized to minutes; invalid seconds are rejected. Picker `required` announces the requirement through ARIA; parent forms must validate the bound value.
7. **Agent tooling:** read `AGENTS.md` directly and use the canonical `.agents/skills/` entries. Client-specific instruction files and discovery adapters are no longer maintained.

## Dependencies

- Remove the unused root `date-fns` dependency.
- Preserve all other resolved dependency versions and the existing Node requirement, `^20.19.0 || >=22.12.0`.

## Validation and measured bundle changes

- `npm run verify` passes: type checking, Prettier/ESLint, 24 test files with 135 tests, production build, and the closed portable-core export check.
- Production preview checks cover the login page, protected-route loading skeleton, configured HTML language, and 404 response.
- Compared with v1.4.2, the login route's recursive static JavaScript dependencies decrease from 188,721 to 144,943 gzip bytes (23.2%). This includes layouts and excludes the additional startup entry; it is build-artifact analysis, not browser network or Core Web Vitals measurement.
- Browser interaction, visual checks, and Core Web Vitals measurements have not been performed.
