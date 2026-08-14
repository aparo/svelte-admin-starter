# Page Templates

Copy the closest `+page.svelte` into `src/routes/(app)/<feature>/`, then replace its placeholder data and labels. These files are scaffolds, not runtime modules: do not import from `templates/`, and do not sync generated pages back to them.

- `list`: searchable collection or CRUD entry point
- `form`: create/edit form with validation owned by the route
- `detail`: record summary and grouped information
- `dashboard`: metrics and overview sections
- `settings`: section navigation and grouped preferences
