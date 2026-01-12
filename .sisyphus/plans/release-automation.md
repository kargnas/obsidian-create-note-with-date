# Plan: Release Automation & Safety Guardrails

## Context

### Original Request
- **Auto-release**: Switch to `minor` version updates on push.
- **Manual release**: Add dropdown for version selection (Patch/Minor/Major), default to `patch`.
- **Safety**: Skip auto-release if changes exceed 300 lines (insertions or deletions).
- **Protection**: Prevent infinite loops in CI.

### Momus Review (Reject & Fixes)
- **Diff Logic**: `HEAD~1` is brittle. Use event payload ranges (`before`..`sha`).
- **Parsing**: `--shortstat` is brittle (singular/plural). Use `--numstat`.
- **Atomic Push**: `release.mjs` pushes separately. Use `git push --follow-tags`.
- **Versions.json**: Must be staged and updated.
- **Loop Prevention**: Use BOTH `[skip ci]` (in commit) AND existing message check (in workflow).
- **Tag Alignment**: `release.mjs` uses `0.x.x` (no `v`), but workflows might expect `v0.x.x`. Keep existing behavior (no `v`) for now to match current `release.mjs` logic, unless user requested change.

---

## Work Objectives

### Core Objective
Make release automation robust, safe from infinite loops, and flexible (auto=minor, manual=user-choice).

### Concrete Deliverables
1. **Updated `release.mjs`**:
   - Updates `versions.json`.
   - Uses `[skip ci]`.
   - Uses `git push --follow-tags`.
2. **Updated `.github/workflows/auto-release.yml`**:
   - `workflow_dispatch` with inputs.
   - Robust diff check using `--numstat`.
   - Explicit branching for Auto(Minor) vs Manual(Input).

### Must Have
- `versions.json` sync in `release.mjs`.
- `git diff --numstat` logic (summing columns).
- Threshold: If `sum(insertions) > 300` OR `sum(deletions) > 300`, skip.
- **Auto-release**: Defaults to `minor` (unless skipped).
- **Manual release**: Defaults to `patch` (or user selection).

---

## Verification Strategy

### Manual Execution Verification

1. **Test `release.mjs` logic**:
   - Dry run locally to check `versions.json` update.
   - Verify commit message format.

2. **Test Diff Logic**:
   - Run `git diff --numstat HEAD~1 HEAD | awk '{s+=$1} END {print s}'` manually.
   - Verify it sums correctly.

---

## Task Flow
1. Update `release.mjs` (Logic Fixes)
2. Update `.github/workflows/auto-release.yml` (Workflow Logic)

---

## TODOs

- [ ] 1. Update `release.mjs` for robustness

  **What to do**:
  - **Read versions.json**: Load existing versions.
  - **Update versions.json**: Add `[newVersion]: minAppVersion`.
  - **Write versions.json**: Save back to disk.
  - **Stage versions.json**: Add to `git add` command.
  - **Commit Message**: Change to `chore: release ${version} [skip ci]`.
  - **Atomic Push**: Replace `git push && git push --tags` with `git push --follow-tags origin main`.
  - **Tag Check**: Before tagging, check if tag exists (idempotency).

  **References**:
  - `version-bump.mjs` (logic source for versions.json).
  - `release.mjs`.

  **Acceptance Criteria**:
  - [ ] `node release.mjs patch` (dry run) updates `versions.json`.
  - [ ] Commit message contains `[skip ci]`.
  - [ ] Push is atomic.

- [ ] 2. Update `.github/workflows/auto-release.yml` with strict guardrails

  **What to do**:
  - **Inputs**: Add `version_type` (default: patch, type: choice).
  - **Diff Check Step**:
    ```bash
    # Determine range
    if [ "${{ github.event_name }}" == "push" ]; then
      RANGE="${{ github.event.before }}..${{ github.sha }}"
      # Handle initial/force push (zero sha)
      if [[ "${{ github.event.before }}" =~ ^0+$ ]]; then
        RANGE="HEAD~1..HEAD" # Fallback or just HEAD
      fi
    else
      # Manual dispatch: just check last commit for safety, or skip check
      RANGE="HEAD~1..HEAD"
    fi

    # Robust parsing with numstat
    # Output format: inserted deleted file
    STATS=$(git diff --numstat $RANGE)
    INS=$(echo "$STATS" | awk '{s+=$1} END {print s+0}')
    DEL=$(echo "$STATS" | awk '{s+=$2} END {print s+0}')
    
    echo "Insertions: $INS, Deletions: $DEL"
    
    if [ "$INS" -gt 300 ] || [ "$DEL" -gt 300 ]; then
      echo "skip_release=true" >> $GITHUB_OUTPUT
      echo "⚠️ Skipping release: Changes too large ($INS ins, $DEL del)"
    else
      echo "skip_release=false" >> $GITHUB_OUTPUT
    fi
    ```
  - **Release Step**:
    - `id: check_size`
    - `if: steps.check_size.outputs.skip_release != 'true'`
    - Logic:
      - Manual: `npm run release ${{ inputs.version_type }}`
      - Push: `npm run release:minor`

  **References**:
  - `.github/workflows/auto-release.yml`

  **Acceptance Criteria**:
  - [ ] Workflow valid.
  - [ ] Manual triggers allow patch/minor/major.
  - [ ] Auto triggers force minor.
  - [ ] Large changes skip execution (success state, but no action).

  **Commit**:
  - `ci: update release workflow with robust guardrails`
