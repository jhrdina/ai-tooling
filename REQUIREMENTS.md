# ai-tooling

Developers maintain personal AI agent plugins (skills, hooks, MCP) once and use them consistently in Cursor and Claude Code, without duplicating configuration across global install locations.

## Feature: Multi-platform plugin repository

### Acceptance criteria

- Developer authors each plugin in a single shared payload under `plugins/<name>/` (skills, hooks, agents, MCP definitions).
- Developer ships the same plugin to Cursor and Claude Code without maintaining two independent copies of skill or hook content.
- Developer adds a new plugin through a repeatable scaffold workflow and registers it in both host marketplaces from one repository.
- Developer validates the repository before commit; validation fails when plugin structure or marketplace registration is inconsistent with declared host targets.
- Developer upgrades the build toolkit via a routine dependency bump without forking build scripts into the repository.

## Feature: Generated host manifests (aipm)

### Acceptance criteria

- Developer declares which AI hosts a plugin supports (at minimum Cursor and Claude Code) in one per-plugin configuration.
- Developer runs a single build command that regenerates host-specific marketplace registries and other generated artifacts from that configuration.
- Developer sees build or validation errors when a plugin contains artifacts for a host it does not declare support for.
- Generated marketplace registries list every supported plugin with correct name, source path, and description.
- CI rejects changes where generated artifacts are stale relative to sources (build output must match committed files).

## Feature: Local global linking (`pnpm run link`)

### Acceptance criteria

- Developer links all plugins in the repository to global Cursor and Claude Code install locations with one command.
- Developer unlinks all repository plugins from those global locations with one command.
- Linking applies only to hosts for which the plugin has a manifest; a Cursor-only or Claude-only plugin is linked only where applicable.
- Re-running link is idempotent: existing correct symlinks are left unchanged; incorrect symlinks are replaced.
- Linking refuses to overwrite a global path that is a real directory or file (not a symlink).
- After linking, edits in the repository are visible to both hosts without reinstall or copy step (in-place development workflow).
- Developer receives clear console output listing each plugin linked or skipped and is reminded to restart the host application.

## Feature: Plugin distribution

### Acceptance criteria

- Developer installs plugins from this repository into Cursor via team marketplace import or local symlink workflow.
- Developer installs plugins from this repository into Claude Code via marketplace install or local symlink workflow.
- Team member can discover which plugins the repository provides from README or marketplace metadata without reading source layout.

## Feature: Initial plugin set

### Acceptance criteria

- Repository includes an **hspec** plugin that provides requirements-spec authoring and an automatic post-turn requirements sync hook (replacing prior global-only installs of the same capability).
- hspec is invokable explicitly by the developer; the sync hook runs after agent completion without manual invocation.

## Out of scope

- Public Cursor Marketplace submission (manual review process).
- Support for hosts beyond those declared in each plugin's target envelope (e.g. Gemini, Codex) unless explicitly added later.
- Replacing host-native plugin cache or marketplace install mechanics — local link is a development convenience, not the only distribution path.
