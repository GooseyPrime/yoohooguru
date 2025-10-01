# Orphan Module Detection

This directory contains tools and reports for detecting orphaned modules, unused dependencies, and dead code in the yoohoo.guru platform.

## Overview

Orphan module detection helps maintain a clean codebase by identifying:

- **Unused Dependencies**: npm packages listed in package.json but not actually used in code
- **Unreachable Modules**: JavaScript files that can't be reached from application entry points
- **Orphaned Files**: Backup, temporary, or deprecated files that should be cleaned up

## Tools

### `detect-orphan-modules.js`

The main detection script that analyzes the entire codebase.

**Usage:**
```bash
node scripts/detect-orphan-modules.js [options]

Options:
  --verbose                 Enable verbose output
  --include-dev-deps       Include dev dependencies in analysis
  --output=<dir>           Specify output directory for reports
```

**Environment Variables:**
- `ORPHAN_ERROR_THRESHOLD`: Number of orphans before script exits with error code (default: 0)

### `ci-orphan-detection.sh`

CI integration script that runs orphan detection and prepares reports for artifact upload.

**Usage:**
```bash
ORPHAN_ERROR_THRESHOLD=50 ./scripts/ci-orphan-detection.sh
```

## CI Integration

Orphan module detection is integrated into the CI workflow and runs after the build step. It:

1. **Analyzes the codebase** for orphans using configurable thresholds
2. **Generates reports** in JSON, HTML, and Markdown formats
3. **Uploads artifacts** containing detailed analysis results
4. **Continues the build** even if orphans are found (configurable)

### CI Configuration

The CI workflow includes these environment variables:

- `ORPHAN_ERROR_THRESHOLD`: Max orphans before failing build (default: 50)

### Artifact Structure

CI artifacts include:

```
orphan-module-reports-{run_number}/
├── ci-orphan-summary.md      # Human-readable summary with CI metadata
├── ci-orphan-data.json       # JSON data with CI context
├── orphan-modules.json       # Full analysis results
├── orphan-modules.html       # Interactive HTML report
└── orphan-modules-summary.md # Markdown summary
```

## Reports

### JSON Report (`orphan-modules.json`)

Complete analysis results in machine-readable format:

```json
{
  "timestamp": "2025-10-01T15:28:46.227Z",
  "summary": {
    "totalOrphans": 123,
    "unusedDependencies": 7,
    "unreachableModules": 116,
    "orphanedFiles": 0
  },
  "details": {
    "unusedDependencies": [...],
    "unreachableModules": [...],
    "orphanedFiles": [...],
    "recommendations": [...]
  }
}
```

### HTML Report (`orphan-modules.html`)

Interactive web-based report with:
- Summary metrics
- Color-coded priority levels
- Expandable detail sections
- Copy-paste friendly command suggestions

### Markdown Summary (`orphan-modules-summary.md`)

GitHub-friendly summary suitable for:
- PR comments
- Issue descriptions
- Documentation updates

## Understanding Results

### Unused Dependencies

Dependencies listed in `package.json` but not imported/required anywhere in the code.

**False Positives:**
- Dependencies used in build tools (webpack, etc.)
- Runtime dependencies loaded dynamically
- Dev dependencies used in CI/CD only

**Action:** Review each dependency and remove if truly unused.

### Unreachable Modules

JavaScript files that cannot be reached from application entry points.

**False Positives:**
- Test files (intentionally separate)
- Configuration files
- Scripts and utilities
- Dynamic imports not detected

**Action:** Review each module and either:
- Add proper imports if the module should be used
- Delete if it's truly dead code
- Move to appropriate directory if it's a utility

### Orphaned Files

Files matching known orphan patterns (*.bak, *.old, temp_*, etc.).

**Action:** Safely delete these files after verification.

## Customization

### Adjusting Thresholds

Edit the CI workflow to change error thresholds:

```yaml
env:
  ORPHAN_ERROR_THRESHOLD: 50  # Fail build if more than 50 orphans
```

### Adding Patterns

To detect additional orphaned file patterns, edit `detect-orphan-modules.js`:

```javascript
const orphanPatterns = [
  '**/*.js.bak',
  '**/*.old',
  '**/unused_*',
  '**/deprecated_*',
  '**/temp_*',
  '**/*_backup.*',
  // Add your patterns here
];
```

### Excluding Directories

To exclude additional directories from analysis:

```javascript
const skipDirs = ['node_modules', '.git', 'build', 'dist', 'coverage', '.next'];
```

## Best Practices

1. **Regular Analysis**: Run orphan detection regularly to prevent accumulation
2. **Review Results**: Don't automatically delete everything - review each item
3. **Team Review**: Discuss significant cleanups with the team
4. **Gradual Cleanup**: Remove orphans gradually to avoid breaking changes
5. **Document Exceptions**: Document any intentional "orphans" to avoid confusion

## Troubleshooting

### High False Positive Rate

If the tool reports many false positives:

1. Check if dynamic imports are used extensively
2. Verify entry point detection logic
3. Consider adjusting patterns for your codebase

### Missing Dependencies

If the tool misses actual unused dependencies:

1. Ensure all source directories are being scanned
2. Check if dependencies are used in non-JS files (HTML, etc.)
3. Verify the dependency detection patterns

### Performance Issues

For large codebases:

1. Consider excluding certain directories
2. Run analysis on CI only, not locally
3. Increase timeout values if needed

## Contributing

When adding new features:

1. Update detection algorithms in `detect-orphan-modules.js`
2. Add corresponding tests
3. Update CI integration script if needed
4. Document changes in this README