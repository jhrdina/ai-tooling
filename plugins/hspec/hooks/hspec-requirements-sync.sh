#!/bin/bash
# After each completed agent turn, prompt a single hspec requirements sync check.

set -euo pipefail

input=$(cat)
status=$(echo "$input" | jq -r '.status // empty')
loop_count=$(echo "$input" | jq -r '.loop_count // 0')

if [[ "$status" != "completed" || "$loop_count" -ge 1 ]]; then
  echo '{}'
  exit 0
fi

read -r -d '' followup_message <<'EOF' || true
/hspec — requirements sync check (automatic hook).

Review this conversation turn for user-facing behavior changes (new/changed/removed outcomes, acceptance criteria, constraints visible to users/stakeholders).

1. Load and follow the hspec skill.
2. Determine scope: folders/files touched in this turn; read existing REQUIREMENTS.md / *.requirements.md there.
3. If user-facing behavior changed → update requirements per hspec (user outcomes only; move implementation detail to blueprint / ## Technical design). Do not change production code.
4. If nothing user-facing changed → reply exactly on its own line: HSPEC_SYNC: unchanged

Do not run a full hspec audit unless requirements files were edited. Keep the response brief.
EOF

jq -n --arg msg "$followup_message" '{ followup_message: $msg }'
exit 0
