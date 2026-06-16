# Archive Report Template

## Successful Archive

```
## Archive Complete

**Change:** <change-name>
**Schema:** <schema-name>
**Archived to:** openspec/changes/archive/YYYY-MM-DD-<name>/
**Specs:** ✓ Synced to main specs (or "No delta specs" or "Sync skipped")

All artifacts complete. All tasks complete.
```

## Archive with Warnings

```
## Archive Complete (with warnings)

**Change:** <change-name>
**Schema:** <schema-name>
**Archived to:** openspec/changes/archive/YYYY-MM-DD-<name>/
**Specs:** ✓ Synced to main specs

### Warnings
- Incomplete artifacts: <list>
- Incomplete tasks: N remaining

Archived with user confirmation despite warnings.
```

## Archive Blocked (Name Collision)

```
## Archive Failed

**Change:** <change-name>
**Error:** Archive target already exists: openspec/changes/archive/YYYY-MM-DD-<name>/

**Options:**
1. Rename the existing archive directory
2. Wait until tomorrow (different date prefix)
3. Manually rename the target and retry
```

## Delta Spec Sync Assessment

When delta specs exist, show a combined summary before prompting:

```
### Delta Spec Sync Assessment

| Capability | Changes | Status |
|------------|---------|--------|
| auth | +3 endpoints, ~1 modified | Needs sync |
| users | +1 endpoint | Needs sync |
| notifications | No changes | Already synced |

**Options:**
1. Sync now (recommended) — Apply delta specs to main specs before archiving
2. Archive without syncing — Delta specs remain in archive only
```

## Pre-Archive Checklist

Before archiving, verify:

1. **Artifact completion** — Run `openspec status --change "<name>" --json`
2. **Task completion** — Count `- [ ]` vs `- [x]` in tasks file
3. **Delta spec sync** — Check `openspec/changes/<name>/specs/` for delta specs
4. **Archive target** — Verify `openspec/changes/archive/YYYY-MM-DD-<name>` doesn't exist
5. **User confirmation** — Prompt if any warnings exist
