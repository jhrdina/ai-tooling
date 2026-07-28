---
name: hspec
description: >-
  Create, edit, audit, or retroactively document application and feature specs
  (CLAUDE.md, REQUIREMENTS.md, *.requirements.md, BLUEPRINT.md, *.blueprint.md).
  Use only when the user explicitly invokes hspec (e.g. "$hspec", "/hspec",
  "use hspec") or asks to write, audit, or backfill requirements with strict
  user-vs-technical separation.
disable-model-invocation: true
---

# hspec — Requirements specification

Author, audit, and backfill feature specs. **Explicit invocation only** — do not load unless the user named hspec.

## AI doc roles

Four markdown roles. Keep each in its lane:

| File | Role |
|------|------|
| `CLAUDE.md` | Folder navigation index — what the folder is, file index, links |
| `REQUIREMENTS.md` / `{component}.requirements.md` | User/stakeholder requirements — outcomes, acceptance |
| `BLUEPRINT.md` / `{component}.blueprint.md` | Authoritative technical design (as-built or agreed target) and **why** — present tense, no deltas |
| Inline `## Technical design` | Same role as blueprint, but inside a `{component}.requirements.md` when the spec is small |

### `CLAUDE.md`

Folder-level navigation index. Keep super-brief.

- One-paragraph overview of what the folder contains.
- **File table** (or short bulleted index) with one-line purpose per relevant file.
- **Links** to sibling `REQUIREMENTS.md` / `*.requirements.md`, `BLUEPRINT.md` / `*.blueprint.md`, child `CLAUDE.md` files.
- No long architecture, no acceptance criteria, no "why" essays.

Reference (fictional app **dog-tinder**): `src/features/dog-search/CLAUDE.md`.

### `REQUIREMENTS.md` and `{component}.requirements.md`

User/stakeholder perspective only. Stable when implementation changes.

**Naming & placement**

| Pattern | Scope | Where |
|---------|-------|-------|
| `REQUIREMENTS.md` | Folder-wide (folder + subfolders) | Feature/module root, or `requirements/REQUIREMENTS.md` |
| `{component}.requirements.md` | One component or file | Same directory as `{component}.ts` / `.tsx` (kebab-case stem) |

**Naming rules**

- Folder-wide scope → `REQUIREMENTS.md`, not `{feature}.requirements.md`.
- Single-component scope → `{component}.requirements.md`, not `REQUIREMENTS.md`.
- Mirror the same split for blueprints: `BLUEPRINT.md` vs `{component}.blueprint.md`.

### `BLUEPRINT.md` and `{component}.blueprint.md`

Authoritative technical design and reasoning. Replaceable without rewriting user requirements. **Not** a migration plan, todo list, or delta changelog.

**Tense:** always **present tense** — describe the design as it is (or as agreed), even if code still lags: "Uses shared `Accordion`", not "Will replace legacy accordion".

**When to update:** normally to match landed code (as-built). During implementation prep, rewriting to the **agreed target** state is fine — still present tense, no delta prose.

- Module / file structure, key types, data flow, lifecycle.
- **Decisions and trade-offs — include why** (e.g. "Chose X over Y because …").
- Gotchas, constraints, integration points.
- Stay brief — link to source files instead of pasting large code blocks.

**Does not belong here:** deltas ("remove X", "replace A with B", "add Y that will …"), step lists, or backlogs. Those live in tickets, Cursor plans, or `change-requests/`.

Use a **separate blueprint file** when technical detail is large or shared across components. Use **inline `## Technical design`** only for small, single-file specs (e.g. one small component).

Reference (user reqs only, **dog-tinder**): `src/features/dog-search/dog-search.requirements.md`.
Reference (inline user + tech, **dog-tinder**): `src/components/favorite-button.requirements.md`.

## Core rule: strict separation

Never mix user outcomes with implementation in the same section.

- User requirements → outcomes: "User can…", "Admin sees…", "System prevents…"
- Technical design / blueprint → how and why

**Implementation leak** — flag and move out of user requirements if a bullet:

- Names components, hooks, props, types, libraries, or CSS classes.
- References file paths or specific functions.
- Describes mechanics ("uses `useRef(Map)`", "renders inside `FormProvider`", "wraps with `React.memo`").
- Reads like a how-to instead of an outcome.

Rewrite the AC as a user-visible outcome; move the mechanic to blueprint or `## Technical design`.

## Document templates

### Small spec (single component, inline tech)

```markdown
# {Title}

{2–4 sentences: user problem, who is affected, outcome. No implementation.}

## User requirements

### Acceptance criteria
- {User-visible outcome}

## Technical design

- {Approach, APIs, types}
- Decision: {X over Y because …}
```

### Large spec (folder-wide or many behaviors)

```markdown
# {Title}

{2–4 sentences: user problem. Link to CLAUDE.md / BLUEPRINT.md if present.}

## Feature: {behavior area}

### Acceptance criteria
- {User-visible outcome only}

## Feature: {another area}

### Acceptance criteria
- …
```

Pair with `BLUEPRINT.md` for technical detail. Do **not** duplicate blueprint content in requirements.

`## User story` is optional — add only when the user asks.

## When to split

- One `REQUIREMENTS.md` grows many unrelated behaviors → split into `{component}.requirements.md` per component.
- Requirements file accumulates architecture / "how" → extract to `BLUEPRINT.md` or `{component}.blueprint.md`.
- `CLAUDE.md` exceeds ~200 lines of architecture → move architecture to blueprint; keep `CLAUDE.md` as index only.
- Long monolithic sections → break into `## Feature:` blocks with `### Acceptance criteria`.
- Repeated content across files → deduplicate; link instead.

Prefer short bullets, headings, and tables. No filler prose.

## Determine scope

Before authoring, auditing, or backfilling:

1. **Implicit** — user is editing or creating an AI-doc file → scope to that file's folder.
2. **From the prompt** — user named a folder or file path → use it.
3. **Ask** — if unclear, one focused `AskQuestion` with options:
   - "The folder I am currently in"
   - "The file I am editing"
   - "Let me paste a path"
4. **Repo-wide** — only when the user explicitly requests it. Warn that it is broad and slow.

Do not start until scope is set.

## Workflows

### A — Author or edit

1. Set scope and pick the correct file(s) and naming pattern.
2. Read existing specs, `CLAUDE.md`, source files, tickets. Do not invent requirements.
3. Draft or edit using the appropriate template.
4. Audit separation (see leaks above) before finishing.
5. Add cross-links: requirements ↔ blueprint ↔ `CLAUDE.md`.

### B — Retroactive spec for an existing feature

Use when the user asks to document a feature that already exists in code.

1. Set scope to the feature folder or component.
2. **Research before writing** — read implementation, tests, `CLAUDE.md`, tickets, i18n keys, API usage. Infer behavior from code; do not guess.
3. **User requirements first** — describe what the feature does for users today, as outcomes. Strip implementation detail even if the code uses specific libraries.
4. **Technical design second** — document implementation in blueprint or `## Technical design`: present tense, decisions + **why**. For migrations, write the **agreed target** design (not a delta checklist).
5. Mark uncertain bullets with `(inferred — verify)` when behavior cannot be confirmed from artifacts.
6. Create missing files (`REQUIREMENTS.md`, `BLUEPRINT.md`, `CLAUDE.md` links) only as needed; offer paths when none exist.
7. Do not change production code unless the user explicitly asks.

### C — Audit

Use when the user asks to audit, review, or reorganize specs in scope.

Run checks per file:

**Role mismatches**

- Implementation in requirements → move to blueprint / `## Technical design`.
- User outcomes in blueprint → move to requirements.
- Architecture or ACs in `CLAUDE.md` → move to blueprint or requirements.

**AC perspective** — every `### Acceptance criteria` bullet must be user/stakeholder perspective (see implementation leak).

**Missing structure**

- Large requirements file without `## Feature:` / `### Acceptance criteria` → propose restructuring.
- Blueprint without any "why" reasoning → flag.
- Blueprint that reads like a plan, backlog, or **delta** ("migrate/replace/remove/add …", "will …", unchecked todos) → propose moving that content out; keep only resulting design in present tense.
- `CLAUDE.md` without file index or sibling links → flag.

**Size & scannability** — smells listed in "When to split".

**Cross-links** — missing links between `CLAUDE.md`, requirements, and blueprint.

**Naming** — wrong folder-wide vs per-component naming.

**Report format** — print findings in chat:

```markdown
## hspec audit — <scope>

**Files inspected**
- path/to/REQUIREMENTS.md
- …

**Findings**

### path/to/REQUIREMENTS.md
- _AC perspective_ — bullet 2 names `useRef(Map)`. **Proposed:** AC → "user sees undo toast"; move mechanic to blueprint.
- _Size_ — 410 lines with architecture. **Proposed:** extract to `BLUEPRINT.md`.

**Apply these?**
```

**Stop and wait** for confirmation. Edit files only after the user approves (whole or subset). Print a short "Applied:" recap after edits.

## Editing rules

- Preserve valid user requirements when refactoring technical design.
- Implementation changes → update blueprint / `## Technical design` to match the authoritative design (present tense); touch user requirements only if user-facing behavior changed.
- Legacy single `## Requirements` section → reorganize into user + technical unless the user forbids it.

## Output behavior

- Write or edit files when the user asked for file changes.
- Draft-only requests → output markdown in chat using the templates above.
- Chat in the user's language; **spec file content in English** unless requested otherwise.
- Do not implement code, run tests, or update `CLAUDE.md` unless the user explicitly asks in the same request.

## Example (small inline spec)

Fictional app **dog-tinder** — save a dog to favorites from search results.

```markdown
# Favorite dog from search

Dog lovers browsing nearby dogs need a quick way to save profiles they like and get clear feedback when something goes wrong.

## User requirements

### Acceptance criteria
- User can save a dog profile to favorites from the search results list.
- User sees confirmation when a profile is saved successfully.
- If the user is not signed in, they are prompted to sign in before the save completes.
- Server failure shows an error; the user can retry without losing which profile they selected.

## Technical design

- Reuse `ModalShell` from the shared dialog patterns.
- `useToggleFavorite` calls `POST /api/dogs/{id}/favorite`; invalidate `favoriteDogsQueryKey` on success.
- Decision: Zod field validation on client before submit — immediate feedback, fewer round trips.
- i18n under `DOG_FINDER.SEARCH.FAVORITE.*`.
```
