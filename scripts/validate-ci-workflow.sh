#!/bin/bash

# validate-ci-workflow.sh
# Validates that CI workflows use correct test commands
# Prevents usage of non-existent commands like 'backend-check'

set -e

echo "🔍 Validating CI workflow configuration..."
echo "=========================================="

ERRORS=0

# Check for invalid commands in workflow files
echo ""
echo "Checking for invalid commands in workflow files..."

WORKFLOW_DIR=".github/workflows"
INVALID_COMMANDS=("backend-check" "job:" "backend:check")

for workflow_file in "$WORKFLOW_DIR"/*.yml "$WORKFLOW_DIR"/*.yaml; do
    if [ -f "$workflow_file" ]; then
        echo "  📄 Checking: $(basename "$workflow_file")"
        
        for invalid_cmd in "${INVALID_COMMANDS[@]}"; do
            # Skip if it's in a comment
            if grep -v "^[[:space:]]*#" "$workflow_file" | grep -q "$invalid_cmd"; then
                # Special handling for "job:" - it's valid as a YAML key at top level
                if [ "$invalid_cmd" == "job:" ]; then
                    # Check if it's not at the beginning of a line (which would make it a job definition)
                    if grep -v "^[[:space:]]*#" "$workflow_file" | grep -E "^\s+$invalid_cmd" >/dev/null; then
                        echo "    ⚠️  WARNING: Found potentially invalid command: $invalid_cmd"
                        echo "       File: $workflow_file"
                        ERRORS=$((ERRORS + 1))
                    fi
                elif [ "$invalid_cmd" != "job:" ]; then
                    echo "    ❌ ERROR: Found invalid command: $invalid_cmd"
                    echo "       File: $workflow_file"
                    grep -n "$invalid_cmd" "$workflow_file" | head -3
                    ERRORS=$((ERRORS + 1))
                fi
            fi
        done
    fi
done

# Verify backend test command is correct
echo ""
echo "Verifying backend test configuration..."

if grep -q "npm test" .github/workflows/ci.yml; then
    echo "  ✅ Backend tests use correct command: npm test"
else
    echo "  ❌ ERROR: Backend tests not using 'npm test' command"
    ERRORS=$((ERRORS + 1))
fi

# Verify working directory is set correctly
if grep -A 3 "Run backend tests" .github/workflows/ci.yml | grep -q "cd backend"; then
    echo "  ✅ Backend tests run in correct directory"
else
    echo "  ❌ ERROR: Backend tests not running in backend directory"
    ERRORS=$((ERRORS + 1))
fi

# Verify firebase-tools installation
if grep -A 5 "Run backend tests" .github/workflows/ci.yml | grep -q "firebase-tools"; then
    echo "  ✅ Firebase tools installation configured"
else
    echo "  ⚠️  WARNING: Firebase tools may not be installed in CI"
fi

# Check backend package.json for test script
echo ""
echo "Verifying backend/package.json test scripts..."

if [ -f "backend/package.json" ]; then
    if grep -q '"test":' backend/package.json; then
        echo "  ✅ Test script defined in backend/package.json"
        
        # Show the test command for reference
        TEST_CMD=$(grep '"test":' backend/package.json | head -1)
        echo "     Command: $TEST_CMD"
    else
        echo "  ❌ ERROR: No test script in backend/package.json"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo "  ❌ ERROR: backend/package.json not found"
    ERRORS=$((ERRORS + 1))
fi

# Summary
echo ""
echo "=========================================="
if [ $ERRORS -eq 0 ]; then
    echo "✅ CI workflow validation PASSED"
    echo ""
    echo "Summary:"
    echo "  • All workflow files use valid commands"
    echo "  • Backend tests correctly configured"
    echo "  • No invalid command references found"
    exit 0
else
    echo "❌ CI workflow validation FAILED with $ERRORS error(s)"
    echo ""
    echo "Common issues:"
    echo "  • Using 'backend-check' instead of 'npm test'"
    echo "  • Missing 'npm install -g firebase-tools' step"
    echo "  • Incorrect working directory for backend tests"
    echo ""
    echo "Fix: Use 'npm test' command as defined in backend/package.json"
    echo "See: docs/CI_BACKEND_TESTING.md for details"
    exit 1
fi
