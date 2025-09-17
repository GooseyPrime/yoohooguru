#!/bin/bash

# GitHub Actions Artifact Handler Script
# Provides safe, conditional artifact upload functionality
# Prevents workflow failures when expected artifacts are missing

set -e

# Configuration
TEMP_DIR="/home/runner/work/_temp"
RUNTIME_LOGS_DIR="${TEMP_DIR}/runtime-logs"
BLOCKED_JSONL_PATH="${RUNTIME_LOGS_DIR}/blocked.jsonl"
BLOCKED_MD_PATH="${RUNTIME_LOGS_DIR}/blocked.md"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to create runtime logs directory
create_runtime_logs_dir() {
    log_info "Creating runtime logs directory..."
    mkdir -p "${RUNTIME_LOGS_DIR}"
    
    if [ -d "${RUNTIME_LOGS_DIR}" ]; then
        log_success "Runtime logs directory created: ${RUNTIME_LOGS_DIR}"
        return 0
    else
        log_error "Failed to create runtime logs directory"
        return 1
    fi
}

# Function to check for artifact files
check_artifacts() {
    log_info "Checking for runtime log artifacts..."
    
    local jsonl_exists=false
    local md_exists=false
    local has_artifacts=false
    
    # Check for blocked.jsonl
    if [ -f "${BLOCKED_JSONL_PATH}" ]; then
        jsonl_exists=true
        log_success "Found blocked.jsonl artifact ($(wc -l < "${BLOCKED_JSONL_PATH}" | tr -d ' ') lines)"
    else
        log_warning "blocked.jsonl artifact not found"
    fi
    
    # Check for blocked.md
    if [ -f "${BLOCKED_MD_PATH}" ]; then
        md_exists=true
        local size=$(du -h "${BLOCKED_MD_PATH}" | cut -f1)
        log_success "Found blocked.md artifact (${size})"
    else
        log_warning "blocked.md artifact not found"
    fi
    
    # Determine if we have any artifacts
    if [ "$jsonl_exists" = true ] || [ "$md_exists" = true ]; then
        has_artifacts=true
        log_success "At least one runtime log artifact found"
    else
        log_info "No runtime log artifacts found - this is normal for most builds"
    fi
    
    # Set GitHub Actions output variables if running in CI
    if [ -n "${GITHUB_OUTPUT}" ]; then
        echo "jsonl-exists=${jsonl_exists}" >> "${GITHUB_OUTPUT}"
        echo "md-exists=${md_exists}" >> "${GITHUB_OUTPUT}"
        echo "has-artifacts=${has_artifacts}" >> "${GITHUB_OUTPUT}"
        log_info "GitHub Actions output variables set"
    fi
    
    # Return status
    if [ "$has_artifacts" = true ]; then
        return 0
    else
        return 1
    fi
}

# Function to validate artifact files
validate_artifacts() {
    log_info "Validating artifact files..."
    
    local validation_passed=true
    
    if [ -f "${BLOCKED_JSONL_PATH}" ]; then
        # Validate JSON lines format
        if command -v jq >/dev/null 2>&1; then
            if cat "${BLOCKED_JSONL_PATH}" | jq -s . > /dev/null 2>&1; then
                log_success "blocked.jsonl has valid JSON format"
            else
                log_error "blocked.jsonl has invalid JSON format"
                validation_passed=false
            fi
        else
            log_warning "jq not available, skipping JSON validation"
        fi
    fi
    
    if [ -f "${BLOCKED_MD_PATH}" ]; then
        # Basic markdown validation (check if file is readable)
        if [ -r "${BLOCKED_MD_PATH}" ]; then
            log_success "blocked.md is readable"
        else
            log_error "blocked.md is not readable"
            validation_passed=false
        fi
    fi
    
    return $([ "$validation_passed" = true ] && echo 0 || echo 1)
}

# Function to generate artifact summary
generate_summary() {
    local jsonl_exists=${1:-false}
    local md_exists=${2:-false}
    
    log_info "Artifact Upload Summary:"
    echo "  - blocked.jsonl exists: ${jsonl_exists}"
    echo "  - blocked.md exists: ${md_exists}"
    
    if [ "$jsonl_exists" = false ] && [ "$md_exists" = false ]; then
        echo "  ✨ No runtime log artifacts to upload - build completed successfully without blocked operations"
        echo "  📝 This typically indicates:"
        echo "    • No content policy violations detected"
        echo "    • No rate limiting or API blocks encountered"
        echo "    • Clean build with no operational issues"
    else
        echo "  📦 Runtime log artifacts will be uploaded for analysis"
        if [ "$jsonl_exists" = true ]; then
            echo "    • blocked.jsonl: Contains structured log data"
        fi
        if [ "$md_exists" = true ]; then
            echo "    • blocked.md: Contains human-readable report"
        fi
    fi
}

# Function to set workflow outputs for PR automation
set_pr_automation_outputs() {
    local has_artifacts=${1:-false}
    
    if [ -n "${GITHUB_OUTPUT}" ]; then
        # Set output to indicate this is an artifact-only issue
        if [ "$has_artifacts" = false ]; then
            echo "artifact-errors-only=true" >> "${GITHUB_OUTPUT}"
            echo "workflow-should-continue=true" >> "${GITHUB_OUTPUT}"
            log_info "Set PR automation flags: artifact-errors-only=true, workflow-should-continue=true"
        else
            echo "artifact-errors-only=false" >> "${GITHUB_OUTPUT}"
            echo "workflow-should-continue=true" >> "${GITHUB_OUTPUT}"
            log_info "Set PR automation flags: artifact-errors-only=false, workflow-should-continue=true"
        fi
    fi
}

# Main execution logic
main() {
    local command=${1:-"check"}
    
    case "$command" in
        "create-dir")
            create_runtime_logs_dir
            ;;
        "check")
            create_runtime_logs_dir
            if check_artifacts; then
                validate_artifacts
                generate_summary true true
                set_pr_automation_outputs true
            else
                generate_summary false false
                set_pr_automation_outputs false
            fi
            ;;
        "validate")
            validate_artifacts
            ;;
        "summary")
            local jsonl_exists=false
            local md_exists=false
            [ -f "${BLOCKED_JSONL_PATH}" ] && jsonl_exists=true
            [ -f "${BLOCKED_MD_PATH}" ] && md_exists=true
            generate_summary "$jsonl_exists" "$md_exists"
            ;;
        *)
            log_error "Unknown command: $command"
            echo "Usage: $0 [create-dir|check|validate|summary]"
            exit 1
            ;;
    esac
}

# Execute main function if script is run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi