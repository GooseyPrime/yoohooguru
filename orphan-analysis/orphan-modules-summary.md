# Orphan Module Analysis Report

**Generated:** 2025-12-09T03:26:47.904Z

## Summary

- **Total Orphans:** 5
- **Unused Dependencies:** 0
- **Unreachable Modules:** 5
- **Orphaned Files:** 0

## Recommendations

### Remove or refactor 5 unreachable modules (low priority)
These modules are not reachable from any entry point and may be dead code

**Action:** Review each module and either delete it or add proper imports

## Details



### Unreachable Modules
**apps/main:**
- hooks/useGeolocation.ts
- utils/accessibility.ts

**backend:**
- src/scripts/cleanupTestUsers.js
- src/scripts/seedCategories.js
- src/scripts/seedTestUsers.js


