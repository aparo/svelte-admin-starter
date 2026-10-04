---
name: git-release
description: Update versions, create tags, or publish GitHub releases for this SvelteKit admin starter, limited to the release actions the user requested. Not for ordinary code changes or commits.
---

# Version and release work

Match the requested scope: a version bump updates package metadata; a tag request creates a tag; a full release includes commit, tag, push, and GitHub publication. Reuse existing authorization without asking again. Follow [the release procedure](../../../docs/RELEASE.md) for full releases.

## Preparation

- Read `package.json`, the lockfile, branch status, and relevant release history. Honor an explicit target; otherwise default to the next patch for a requested bump or release.
- Preserve unrelated changes. Do not stash or commit them to obtain a clean tree. Use an isolated checkout when needed; clarify only if the release contents cannot be determined.
- Update the package version and both lockfile version fields without changing dependencies. For version-only work, validate their agreement and finish without tagging or publishing.
- For a full release, run `npm run verify`, inspect the diff since the previous release, and prepare notes with actual portable-core changes and migration needs. Use a notes file rather than inline shell text.

## Publication

Use the repository's Conventional Commit style and annotated `vX.Y.Z` tags. Verify the intended branch, commit, remote, and target version before publishing. Never replace an existing tag or release.

Follow the release procedure to push and publish only the authorized scope. If an external operation fails, inspect local and remote state before retrying; if the result or permission is unclear, stop dependent mutations and report completed work and the specific blocker. Verify the remote tag and release URL before reporting publication complete.
