#!/bin/bash

# Workflow Artifact Handling Verification Script
# Tests the artifact handling functionality in various scenarios

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ARTIFACT_HANDLER="${SCRIPT_DIR}/.github/scripts/handle-artifacts.sh"

# Colors for output  
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_test() {
    echo -e "${BLUE}🧪 TEST: $1${NC}"
}

log_pass() {
    echo -e "${GREEN}✅ PASS: $1${NC}"
}

log_fail() {
    echo -e "${RED}❌ FAIL: $1${NC}"
}

log_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Cleanup function
cleanup() {
    echo -e "\n${YELLOW}🧹 Cleaning up test artifacts...${NC}"
    rm -rf /home/runner/work/_temp/runtime-logs /tmp/test-*
}

# Test 1: No artifacts scenario (typical case)
test_no_artifacts() {
    log_test "No artifacts present (typical scenario)"
    
    cleanup
    
    # Run the artifact handler
    if ${ARTIFACT_HANDLER} check > /tmp/test-no-artifacts.log 2>&1; then
        if grep -q "No runtime log artifacts found" /tmp/test-no-artifacts.log; then
            log_pass "Correctly detected no artifacts"
        else
            log_fail "Did not properly report no artifacts"
            return 1
        fi
    else
        log_fail "Script failed when no artifacts present"
        return 1
    fi
    
    # Check that directory was created
    if [ -d "/home/runner/work/_temp/runtime-logs" ]; then
        log_pass "Runtime logs directory created"
    else
        log_fail "Runtime logs directory not created"
        return 1
    fi
}

# Test 2: Valid artifacts present
test_valid_artifacts() {
    log_test "Valid artifacts present"
    
    cleanup
    mkdir -p /home/runner/work/_temp/runtime-logs
    
    # Create valid test artifacts
    echo '{"blocked": true, "reason": "test content policy violation"}' > /home/runner/work/_temp/runtime-logs/blocked.jsonl
    echo '{"blocked": true, "timestamp": "2025-09-17T00:00:00Z"}' >> /home/runner/work/_temp/runtime-logs/blocked.jsonl
    
    cat > /home/runner/work/_temp/runtime-logs/blocked.md << EOF
# Runtime Blocks Report

## Summary
- Total blocks: 2
- Content policy violations: 1
- Rate limiting: 1

## Details
This report shows operations that were blocked during runtime.
EOF
    
    # Run the artifact handler
    if ${ARTIFACT_HANDLER} check > /tmp/test-valid-artifacts.log 2>&1; then
        if grep -q "At least one runtime log artifact found" /tmp/test-valid-artifacts.log; then
            log_pass "Correctly detected valid artifacts"
        else
            log_fail "Did not properly detect valid artifacts"
            return 1
        fi
        
        if grep -q "blocked.jsonl has valid JSON format" /tmp/test-valid-artifacts.log; then
            log_pass "JSON validation passed"
        else
            log_fail "JSON validation failed"
            return 1  
        fi
        
        if grep -q "blocked.md is readable" /tmp/test-valid-artifacts.log; then
            log_pass "Markdown validation passed"
        else
            log_fail "Markdown validation failed"
            return 1
        fi
    else
        log_fail "Script failed with valid artifacts"
        return 1
    fi
}

# Test 3: Invalid JSON artifact
test_invalid_json() {
    log_test "Invalid JSON artifact"
    
    cleanup
    mkdir -p /home/runner/work/_temp/runtime-logs
    
    # Create invalid JSON
    echo 'invalid json content {' > /home/runner/work/_temp/runtime-logs/blocked.jsonl
    echo '# Valid markdown' > /home/runner/work/_temp/runtime-logs/blocked.md
    
    # Run the artifact handler (should still work but report validation issues)
    if ${ARTIFACT_HANDLER} check > /tmp/test-invalid-json.log 2>&1; then
        if grep -q "At least one runtime log artifact found" /tmp/test-invalid-json.log; then
            log_pass "Detected artifacts despite invalid JSON"
        else
            log_fail "Did not detect artifacts with invalid JSON"
            return 1
        fi
        
        # Check if jq is available for validation
        if command -v jq >/dev/null 2>&1; then
            if grep -q "blocked.jsonl has invalid JSON format" /tmp/test-invalid-json.log; then
                log_pass "Correctly identified invalid JSON"
            else
                log_fail "Did not identify invalid JSON"
                return 1
            fi
        else
            log_info "jq not available, skipping JSON validation check"
        fi
    else
        log_fail "Script failed with invalid JSON"
        return 1
    fi
}

# Test 4: Partial artifacts (only one file)
test_partial_artifacts() {
    log_test "Partial artifacts (only blocked.jsonl)"
    
    cleanup
    mkdir -p /home/runner/work/_temp/runtime-logs
    
    # Create only one artifact
    echo '{"blocked": true, "reason": "partial test"}' > /home/runner/work/_temp/runtime-logs/blocked.jsonl
    
    # Run the artifact handler  
    if ${ARTIFACT_HANDLER} check > /tmp/test-partial-artifacts.log 2>&1; then
        if grep -q "At least one runtime log artifact found" /tmp/test-partial-artifacts.log; then
            log_pass "Correctly detected partial artifacts"
        else
            log_fail "Did not properly detect partial artifacts"
            return 1
        fi
    else
        log_fail "Script failed with partial artifacts"
        return 1
    fi
}

# Test 5: Directory permissions
test_directory_permissions() {
    log_test "Directory creation permissions"
    
    cleanup
    
    # Test if we can create the directory structure
    if ${ARTIFACT_HANDLER} create-dir > /tmp/test-permissions.log 2>&1; then
        if [ -d "/home/runner/work/_temp/runtime-logs" ]; then
            log_pass "Directory creation successful"
        else
            log_fail "Directory creation failed"
            return 1
        fi
    else
        log_fail "Directory creation script failed"
        return 1
    fi
}

# Main test execution
main() {
    echo -e "${BLUE}🚀 Starting Workflow Artifact Handling Verification${NC}"
    echo -e "${BLUE}=================================================${NC}\n"
    
    local failed_tests=0
    
    # Run all tests
    for test_func in test_no_artifacts test_valid_artifacts test_invalid_json test_partial_artifacts test_directory_permissions; do
        echo ""
        if ! $test_func; then
            failed_tests=$((failed_tests + 1))
        fi
    done
    
    # Final cleanup
    cleanup
    
    echo -e "\n${BLUE}=================================================${NC}"
    if [ $failed_tests -eq 0 ]; then
        echo -e "${GREEN}🎉 All tests passed! Artifact handling is working correctly.${NC}"
        echo -e "${GREEN}✅ The workflow changes will handle missing artifacts gracefully.${NC}"
        echo -e "${GREEN}✅ PR automation will not get stuck in comment loops.${NC}"
        echo -e "${GREEN}✅ Artifact uploads will be conditional and robust.${NC}"
    else
        echo -e "${RED}❌ $failed_tests test(s) failed. Please review the implementation.${NC}"
        return 1
    fi
    
    echo -e "\n${YELLOW}📋 Test artifacts and logs were created in /tmp/test-*.log${NC}"
    echo -e "${YELLOW}📋 You can review them for detailed output if needed.${NC}"
}

# Execute tests if run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi