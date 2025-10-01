#!/bin/bash

# CI Orphan Module Detection Script
# Integrates orphan module detection into the CI workflow

set -e

# Configuration
ORPHAN_THRESHOLD="${ORPHAN_ERROR_THRESHOLD:-10}"
OUTPUT_DIR="./ci-orphan-reports"
ARTIFACT_DIR="/home/runner/work/_temp/orphan-reports"

echo "🔍 Starting CI orphan module detection..."
echo "📊 Error threshold: ${ORPHAN_THRESHOLD}"

# Ensure directories exist
mkdir -p "${OUTPUT_DIR}"
mkdir -p "${ARTIFACT_DIR}"

# Run orphan detection
echo "🚀 Running orphan module analysis..."
ORPHAN_ERROR_THRESHOLD="${ORPHAN_THRESHOLD}" node scripts/detect-orphan-modules.js \
  --output="${OUTPUT_DIR}" \
  --verbose

EXIT_CODE=$?

# Copy reports to artifact directory
if [ -d "${OUTPUT_DIR}" ] && [ "$(ls -A ${OUTPUT_DIR})" ]; then
    echo "📂 Copying reports to artifact directory..."
    cp -r "${OUTPUT_DIR}"/* "${ARTIFACT_DIR}/"
    
    # Create a summary file for easy access
    if [ -f "${OUTPUT_DIR}/orphan-modules-summary.md" ]; then
        echo "📝 Creating CI summary..."
        {
            echo "# Orphan Module Detection - CI Summary"
            echo
            echo "**Build:** ${GITHUB_RUN_NUMBER:-unknown}"
            echo "**Branch:** ${GITHUB_REF_NAME:-unknown}"
            echo "**Commit:** ${GITHUB_SHA:-unknown}"
            echo "**Date:** $(date -u +"%Y-%m-%d %H:%M:%S UTC")"
            echo
            echo "---"
            echo
            cat "${OUTPUT_DIR}/orphan-modules-summary.md"
        } > "${ARTIFACT_DIR}/ci-orphan-summary.md"
    fi
    
    # Create JSON summary for programmatic access
    if [ -f "${OUTPUT_DIR}/orphan-modules.json" ]; then
        echo "📊 Creating CI JSON summary..."
        cat "${OUTPUT_DIR}/orphan-modules.json" | jq '{
            ci: {
                build: env.GITHUB_RUN_NUMBER,
                branch: env.GITHUB_REF_NAME,
                commit: env.GITHUB_SHA,
                timestamp: now | strftime("%Y-%m-%dT%H:%M:%SZ")
            },
            summary: .summary,
            recommendations: .details.recommendations
        }' > "${ARTIFACT_DIR}/ci-orphan-data.json" 2>/dev/null || cp "${OUTPUT_DIR}/orphan-modules.json" "${ARTIFACT_DIR}/ci-orphan-data.json"
    fi
    
    echo "✅ Reports prepared for artifact upload"
else
    echo "⚠️ No reports generated"
fi

# Exit with original exit code
if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ Orphan detection completed successfully"
elif [ $EXIT_CODE -eq 1 ]; then
    echo "⚠️ Orphan detection found issues above threshold"
else
    echo "❌ Orphan detection failed with error code $EXIT_CODE"
fi

exit $EXIT_CODE