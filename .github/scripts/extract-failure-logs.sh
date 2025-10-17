#!/bin/bash

# GitHub Actions Failure Log Extractor
# Extracts relevant error information from failed CI steps and formats for PR comments

set -e

# Configuration
MAX_ERROR_LINES=100
ERROR_CONTEXT_LINES=5

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}" >&2
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}" >&2
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}" >&2
}

log_error() {
    echo -e "${RED}❌ $1${NC}" >&2
}

# Function to extract errors from GitHub Actions log format
extract_errors_from_step() {
    local step_name="$1"
    local log_file="$2"
    local output_file="/tmp/step-errors.txt"
    
    log_info "Extracting errors from step: ${step_name}"
    
    > "$output_file"
    
    # Pattern 1: Jest/test failures with file paths and error messages
    if grep -q "FAIL \|Tests:.*failed" "$log_file" 2>/dev/null; then
        grep -E "FAIL |● |Expected:|Received:|at Object|at Test|Error:|Test Suites:.*failed|Tests:.*failed" "$log_file" 2>/dev/null | head -n "${MAX_ERROR_LINES}" >> "$output_file"
    fi
    
    # Pattern 2: ESLint errors
    if grep -q "error  " "$log_file" 2>/dev/null; then
        grep -B 1 -A 2 "error  " "$log_file" 2>/dev/null | head -n "${MAX_ERROR_LINES}" >> "$output_file"
    fi
    
    # Pattern 3: npm/build errors
    if grep -q "npm ERR!\|npm error\|ERROR in" "$log_file" 2>/dev/null; then
        grep -A "${ERROR_CONTEXT_LINES}" "npm ERR!\|npm error\|ERROR in" "$log_file" 2>/dev/null | head -n "${MAX_ERROR_LINES}" >> "$output_file"
    fi
    
    # Pattern 4: Process exit codes with context
    if grep -q "Process completed with exit code [^0]" "$log_file" 2>/dev/null; then
        grep -B 10 "Process completed with exit code [^0]" "$log_file" 2>/dev/null | head -n 20 >> "$output_file"
    fi
    
    # Clean up ANSI color codes and timestamps
    if [[ -s "$output_file" ]]; then
        sed -i 's/\x1b\[[0-9;]*m//g' "$output_file"
        sed -i 's/^[0-9-]*T[0-9:\.]*Z //' "$output_file"
        cat "$output_file"
    else
        echo ""
    fi
}

# Function to get failed step names from workflow
get_failed_steps() {
    # This would typically come from GitHub Actions context
    # For now, we'll check for known steps that commonly fail
    echo "Lint backend code|Run frontend tests|Run backend tests|Build frontend"
}

# Function to extract recent errors from a log file
extract_recent_errors() {
    local log_file="${1:-/tmp/job-logs.txt}"
    local output_file="/tmp/extracted-errors.txt"
    
    if [[ ! -f "$log_file" ]]; then
        log_warning "Log file not found: ${log_file}"
        echo "Log file not available for analysis."
        return 1
    fi
    
    log_info "Analyzing log file: ${log_file}"
    
    # Clear output file
    > "$output_file"
    
    local found_errors=false
    local step_patterns=("Lint backend code" "Run frontend tests" "Run backend tests" "Build frontend")
    
    for step in "${step_patterns[@]}"; do
        if grep -q "##\[group\]Run.*${step}" "$log_file" 2>/dev/null || grep -q "${step}" "$log_file" 2>/dev/null; then
            local step_errors=$(extract_errors_from_step "$step" "$log_file")
            if [[ -n "$step_errors" && "$step_errors" != "" ]]; then
                found_errors=true
                echo "" >> "$output_file"
                echo "### Step: ${step}" >> "$output_file"
                echo "" >> "$output_file"
                echo "<details><summary>View Error Details</summary>" >> "$output_file"
                echo "" >> "$output_file"
                echo '```' >> "$output_file"
                echo "$step_errors" >> "$output_file"
                echo '```' >> "$output_file"
                echo "" >> "$output_file"
                echo "</details>" >> "$output_file"
                echo "" >> "$output_file"
            fi
        fi
    done
    
    if [[ "$found_errors" == false ]]; then
        # If no specific errors found, extract last 100 lines of logs for better context
        log_warning "No specific error patterns found, extracting last portion of logs"
        > "$output_file"
        echo "" >> "$output_file"
        echo "### Recent Log Output" >> "$output_file"
        echo "" >> "$output_file"
        echo "<details><summary>View Last 100 Lines</summary>" >> "$output_file"
        echo "" >> "$output_file"
        echo '```' >> "$output_file"
        tail -100 "$log_file" | sed 's/\x1b\[[0-9;]*m//g' | sed 's/^[0-9-]*T[0-9:\.]*Z //' >> "$output_file"
        echo '```' >> "$output_file"
        echo "" >> "$output_file"
        echo "</details>" >> "$output_file"
        echo "" >> "$output_file"
    fi
    
    cat "$output_file"
}

# Function to format error summary for GitHub PR comment
format_pr_comment() {
    local workflow_url="$1"
    local run_number="$2"
    local sha="$3"
    local branch="$4"
    local actor="$5"
    local errors="$6"
    
    cat <<EOF
@copilot

## ❌ CI Workflow Failed

**Workflow Run:** [#${run_number}](${workflow_url})
**Commit:** \`${sha}\`
**Branch:** \`${branch}\`
**Triggered by:** @${actor}

### 📋 Failure Details

${errors}

### 🔍 Common Issues to Check

- **Linting errors**: Check code style and formatting issues
- **Test failures**: Review test assertions and expected vs actual values
- **Build errors**: Check for dependency issues or compilation errors
- **Missing environment variables**: Verify all required env vars are set

### 🔗 Quick Links

- [View full workflow logs](${workflow_url})
- [Commit details](https://github.com/\${GITHUB_REPOSITORY}/commit/${sha})

### ✅ Next Steps

1. Review the error details above
2. Fix the identified issues in your local environment
3. Test locally to ensure fixes work
4. Push the corrected code

Please review the failure and make necessary corrections.
EOF
}

# Main execution
main() {
    local command="${1:-extract}"
    local log_file="${2:-/tmp/job-logs.txt}"
    
    case "$command" in
        "extract")
            extract_recent_errors "$log_file"
            ;;
        "format")
            local workflow_url="${GITHUB_SERVER_URL:-https://github.com}/${GITHUB_REPOSITORY:-owner/repo}/actions/runs/${GITHUB_RUN_ID:-0}"
            local run_number="${GITHUB_RUN_NUMBER:-0}"
            local sha="${GITHUB_SHA:-unknown}"
            local branch="${GITHUB_HEAD_REF:-unknown}"
            local actor="${GITHUB_ACTOR:-unknown}"
            local errors=$(extract_recent_errors "$log_file")
            
            format_pr_comment "$workflow_url" "$run_number" "$sha" "$branch" "$actor" "$errors"
            ;;
        *)
            log_error "Unknown command: $command"
            echo "Usage: $0 [extract|format] [log_file]"
            exit 1
            ;;
    esac
}

# Execute main function if script is run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
