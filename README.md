# ai-tooling

Personal AI plugin marketplace — author once, ship to **Cursor** and **Claude Code** via [`@ai-plugin-marketplace`](https://www.npmjs.com/package/@ai-plugin-marketplace/cli).

## Plugins

| Plugin | Description |
|--------|-------------|
| **hspec** | Requirements spec skill + automatic post-turn requirements sync hook |

## Development

```bash
pnpm install
pnpm exec aipm scaffold <plugin-name>   # add a plugin
pnpm build                              # regenerate marketplace manifests
pnpm check                              # validate
pnpm run link                             # symlink all plugins to ~/.cursor and ~/.claude
pnpm run unlink                           # remove those symlinks
```

Use `pnpm run link` (not bare `pnpm link`, which is pnpm's package-link command).

`pnpm link` creates:

| Host | Global path |
|------|-------------|
| **Cursor** | `~/.cursor/plugins/local/<plugin>` |
| **Claude Code** | `~/.claude/skills/<plugin>` (in-place `@skills-dir` plugin) |

Restart Cursor or Claude Code after linking.

## Install

### Cursor (team marketplace)

Dashboard → Plugins → Import from Repo → paste this repository URL.

### Cursor (local dev)

```bash
ln -s "$(pwd)/plugins/hspec" ~/.cursor/plugins/local/hspec
```

### Claude Code

```text
/plugin marketplace add <owner>/ai-tooling
/plugin install hspec@jhrdina-ai-tooling
```

## Upgrading aipm

```bash
pnpm up @ai-plugin-marketplace/cli @ai-plugin-marketplace/core
pnpm build
```
