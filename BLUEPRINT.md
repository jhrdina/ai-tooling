# ai-tooling — Technical design

Authoritative as-built design for the plugin marketplace repository and local linking workflow.

## Repository layout

```
ai-tooling/
├── .claude-plugin/marketplace.json   # Claude Code marketplace registry
├── .cursor-plugin/marketplace.json   # Cursor marketplace registry
├── plugins/<name>/                   # Shared plugin payload (single source)
│   ├── aipm.config.ts                # Target envelope + metadata
│   ├── .claude-plugin/plugin.json
│   ├── .cursor-plugin/plugin.json
│   ├── skills/ | hooks/ | mcp.json
├── scripts/link-local.mjs            # Global symlink helper
└── package.json                      # aipm build/check/scaffold + link scripts
```

Decision: **aipm** (`@ai-plugin-marketplace/cli`) owns manifest generation and validation — not hand-maintained dual marketplace files beyond what build emits. Chose aipm over manual dual-manifest because it enforces target envelopes and freshness in CI.

## Target envelope

Each plugin declares supported hosts in `plugins/<name>/aipm.config.ts`:

```ts
targets: ['claude', 'cursor']
```

Build refuses plugins that carry files for undeclared targets. Current repo scope is Cursor + Claude Code only; Codex/Gemini/Open-plugins artifacts are removed, not generated.

## Build and validation

| Command | Role |
|---------|------|
| `pnpm build` | `aipm build` — regenerate marketplace registries and toolkit-owned artifacts |
| `pnpm check` | `aipm validate` — schema, envelope, marketplace registration, freshness |

CI (`.github/workflows/ci.yml`) runs build then fails if the working tree is dirty — generated files must be committed.

## Local linking (`scripts/link-local.mjs`)

| Host | Global symlink target | Discovery mechanism |
|------|----------------------|---------------------|
| **Cursor** | `~/.cursor/plugins/local/<plugin>` | `.cursor-plugin/plugin.json` present |
| **Claude Code** | `~/.claude/skills/<plugin>` | `.claude-plugin/plugin.json` present; loads in-place as `@skills-dir` |

Plugin name comes from manifest `name`, falling back to directory name.

**Idempotency:** if symlink exists and resolves to the same absolute path, skip. Otherwise replace symlink.

**Safety:** refuse to overwrite non-symlink entries at the link path.

**CLI:** `pnpm run link` / `pnpm run unlink` (not bare `pnpm link` — conflicts with pnpm's package-link command).

Decision: symlink into repo (not copy) so hook/skill edits are immediately live during development. Claude marketplace install copies to cache and is kept for distribution; link is dev-only.

## Marketplace identity

- Marketplace name: `jhrdina-ai-tooling`
- Owner: Jan Hrdka (`jan.hrdka@gmail.com`)

## Plugin: hspec

Wraps former global installs:

- Skill: `plugins/hspec/skills/hspec/SKILL.md` — explicit `/hspec` invocation only
- Hook: `plugins/hspec/hooks/hspec-requirements-sync.sh` on `stop` event, `loop_limit: 1`

After plugin install + link, global copies under `~/.cursor/skills/hspec` and `~/.cursor/hooks/` can be removed to avoid duplication.
