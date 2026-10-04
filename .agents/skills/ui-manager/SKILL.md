---
name: ui-manager
description: Create routes or substantially restructure pages in this SvelteKit admin starter using its shell, components, data, navigation, and i18n conventions. Small styling and copy edits do not need this workflow.
---

# Build an admin page

Deliver the requested page within the current application architecture. Follow the repository's `AGENTS.md` for shared contracts and validation.

- Inspect the affected route, callers, and relevant components. For new pages, use a matching `templates/pages/` scaffold when helpful; for existing pages, adapt the live implementation.
- Preserve the shell, server/client boundary, navigation, localization, and required interaction states. Add only the route files and reusable abstractions the feature needs.
- Treat templates as copy-on-create examples, never runtime imports or synchronized snapshots. User requirements and live source take precedence over scaffold defaults.

Read supporting guidance only where needed:

- [Architecture](references/architecture.md): route groups, shell, data boundaries, auth, navigation, and localization.
- [Page creation](references/page-creation.md): choosing a scaffold and completing new or restructured pages.
- [Components](references/components.md): selecting and extending shared patterns and UI primitives.
