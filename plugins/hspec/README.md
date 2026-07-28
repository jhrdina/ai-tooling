# hspec

Requirements specification for AI-assisted development.

## Contents

| Component | Purpose |
|-----------|---------|
| `skills/hspec/SKILL.md` | Author, audit, and backfill `REQUIREMENTS.md` / blueprint docs |
| `hooks/hspec-requirements-sync.sh` | After each agent turn, trigger `/hspec` sync when behavior may have changed |

## Usage

### Cursor

Install from the `jhrdina-ai-tooling` team marketplace, or link locally from the repo root:

```bash
pnpm run link
```

Manual symlink (single plugin):

```bash
ln -s /path/to/ai-tooling/plugins/hspec ~/.cursor/plugins/local/hspec
ln -s /path/to/ai-tooling/plugins/hspec ~/.claude/skills/hspec
```

Invoke explicitly: `/hspec`, `$hspec`, or `use hspec`.

The `stop` hook runs automatically when the plugin is enabled.

### Claude Code

```text
/plugin marketplace add <your-org>/ai-tooling
/plugin install hspec@jhrdina-ai-tooling
```

## Hook behavior

On agent completion (`stop` event, `loop_limit: 1`):

1. Sends a follow-up prompting `/hspec` requirements sync
2. Agent checks for user-facing behavior changes in the turn
3. Updates requirements per hspec rules, or replies `HSPEC_SYNC: unchanged`
