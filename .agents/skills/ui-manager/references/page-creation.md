# Creating and reworking pages

For new routes, choose a suitable scaffold below or a relevant live implementation. For restructuring, start from the affected page and preserve its behavior unless the user asks to change it.

| Page shape   | Optional scaffold           | Feature-owned work                           |
| ------------ | --------------------------- | -------------------------------------------- |
| List or CRUD | `templates/pages/list`      | Columns, filters, row actions, confirmation  |
| Form         | `templates/pages/form`      | Schema, controls, validation, feedback       |
| Detail       | `templates/pages/detail`    | Loading, fields, actions, not-found handling |
| Overview     | `templates/pages/dashboard` | Metrics, charts, activity                    |
| Settings     | `templates/pages/settings`  | Preferences, controls, save feedback         |

A copied scaffold becomes feature code. If none fits, compose from existing components.

## Integration

Choose the URL, route group, dynamic segments, and navigation role. Add a server load or nested layout only when needed. Use `PageContainer` and `PageHeader` with existing shared patterns and UI primitives; keep domain state and validation with the feature.

Handle applicable loading, empty, error, and destructive states. Register top-level destinations, resolve internal links, mirror new locale keys, and update `config.app.homePath` before removing the current home route. Routes must not import from `templates/`.

Validate according to `AGENTS.md`, including the affected interactions, narrow layouts, keyboard access, and light/dark appearance. Small copy or styling changes can patch the target directly.
