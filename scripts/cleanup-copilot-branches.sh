#!/bin/bash

# GitHub Branch Cleanup Script for copilot/fix-* branches
# This script provides the commands needed to delete all copilot/fix-* branches
# Requires GitHub CLI (gh) or curl with personal access token

set -e

REPO="GooseyPrime/yoohooguru"

# List of all copilot/fix-* branches to delete
BRANCHES=(
    "copilot/fix-0c1aa775-f2d4-40c2-987a-3f665724b394"
    "copilot/fix-8f68c49c-e0d5-4fd2-a78c-fa49513ca79b"
    "copilot/fix-9b11e4d9-a51f-43a0-ae19-5838622907b1"
    "copilot/fix-9fc5acd6-bcfc-4bc0-a001-a951b0d33a81"
    "copilot/fix-14"
    "copilot/fix-16"
    "copilot/fix-18"
    "copilot/fix-20"
    "copilot/fix-22"
    "copilot/fix-24"
    "copilot/fix-26"
    "copilot/fix-28"
    "copilot/fix-29ed6ec9-d9f2-49ea-8dd7-78fe620054eb"
    "copilot/fix-32"
    "copilot/fix-34"
    "copilot/fix-36"
    "copilot/fix-44"
    "copilot/fix-46"
    "copilot/fix-48"
    "copilot/fix-50"
    "copilot/fix-52"
    "copilot/fix-55"
    "copilot/fix-57"
    "copilot/fix-59"
    "copilot/fix-61"
    "copilot/fix-63"
    "copilot/fix-66"
    "copilot/fix-68"
    "copilot/fix-70"
    "copilot/fix-71d9e17c-52b1-4da8-b43d-0af4f083d9a2"
    "copilot/fix-72"
    "copilot/fix-74"
    "copilot/fix-77-2"
    "copilot/fix-77"
    "copilot/fix-81"
    "copilot/fix-83"
    "copilot/fix-85"
    "copilot/fix-87ef0685-e742-4d9e-b34e-60d8c463849d"
    "copilot/fix-88"
    "copilot/fix-90"
    "copilot/fix-92"
    "copilot/fix-102"
    "copilot/fix-104"
    "copilot/fix-106"
    "copilot/fix-108"
    "copilot/fix-110"
    "copilot/fix-114"
    "copilot/fix-116"
    "copilot/fix-118"
    "copilot/fix-120"
    "copilot/fix-122"
    "copilot/fix-125"
    "copilot/fix-127"
    "copilot/fix-129"
    "copilot/fix-133"
    "copilot/fix-135"
    "copilot/fix-137"
    "copilot/fix-139"
    "copilot/fix-143"
    "copilot/fix-145"
    "copilot/fix-147"
    "copilot/fix-149"
    "copilot/fix-151"
    "copilot/fix-153"
    "copilot/fix-155"
    "copilot/fix-157"
    "copilot/fix-159"
    "copilot/fix-161"
    "copilot/fix-163"
    "copilot/fix-165"
    "copilot/fix-169"
    "copilot/fix-26071a05-a594-4dcc-a88a-792689298b91"
    "copilot/fix-18443361-67a9-4b4b-9994-44f997dea6a8"
    "copilot/fix-a2911bfb-e86d-4430-9146-388cff0fa215"
    "copilot/fix-a3502cd0-17bc-4611-9d93-a0434c712fb7"
    "copilot/fix-c5b581b4-ba16-4eca-9ea2-78949a7e674c"
    "copilot/fix-c6c1a26e-e0ec-4fc7-afd1-2992bccce0ee"
    "copilot/fix-c7bbe2db-8af6-4c9c-a29d-808ea2fd34f3"
    "copilot/fix-cd3dec24-e625-4da4-aa1d-490a6e637470"
    "copilot/fix-console-errors-and-warnings"
    "copilot/fix-d01e41cf-d407-4108-8363-5c4e123dccfa"
    "copilot/fix-e18f4428-6313-4985-a299-8afd277aabb8"
    "copilot/fix-e23e1a24-d130-4a73-a94f-b450d54de03b"
    "copilot/fix-eb304878-97eb-45b4-b022-2513849362b5"
    "copilot/fix-f43bdeda-837c-4a60-87af-56f1de9ff2c7"
    "copilot/fix-fb3731ed-0c67-435b-bc75-cd17d9ea0057"
    "copilot/fix-ff9c51b2-d253-4c56-bcbd-e2a2f644c76f"
    "copilot/optimize-webpack-docker-builds"
)

echo "🔥 GitHub Branch Cleanup Script"
echo "Repository: $REPO"
echo "Total branches to delete: ${#BRANCHES[@]}"
echo ""

# Function to delete branch using GitHub CLI or API
delete_with_auth() {
    echo "Using authenticated methods to delete branches..."
    
    # Check if we have COPILOT_PAT token
    if [[ -n "${COPILOT_PAT}" ]]; then
        echo "Using COPILOT_PAT token for authentication"
        
        # Test repository rules first
        if ! test_repository_rules; then
            echo "❌ Repository rules are blocking deletion. Please resolve rules first."
            echo "See execution plan for details: BRANCH_CLEANUP_EXECUTION_PLAN.md"
            return 1
        fi
        
        echo "⚠️  This will permanently delete all copilot/fix-* branches!"
        read -p "Are you sure you want to proceed? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "❌ Operation cancelled."
            return 1
        fi
        
        for branch in "${BRANCHES[@]}"; do
            echo "🗑️  Deleting $branch..."
            response=$(curl -s -w "%{http_code}" -X DELETE \
                         -H "Authorization: token ${COPILOT_PAT}" \
                         -H "Accept: application/vnd.github.v3+json" \
                         "https://api.github.com/repos/$REPO/git/refs/heads/$branch")
            
            http_code="${response: -3}"
            if [[ "$http_code" == "204" ]]; then
                echo "✅ Deleted $branch"
            else
                echo "❌ Failed to delete $branch (HTTP: $http_code)"
                echo "${response%???}" | jq -r '.message // "Unknown error"' 2>/dev/null || echo "${response%???}"
            fi
        done
        
    elif command -v gh &> /dev/null; then
        echo "Using GitHub CLI for authentication"
        delete_with_gh
    else
        echo "❌ No authentication method available."
        echo "Either set COPILOT_PAT environment variable or install GitHub CLI"
        return 1
    fi
    
    echo ""
    echo "✨ Cleanup completed!"
}

# Function to generate curl commands for manual execution
generate_curl_commands() {
    echo "# Manual curl commands to delete branches"
    echo "# Replace YOUR_TOKEN with your GitHub Personal Access Token"
    echo ""
    
    for branch in "${BRANCHES[@]}"; do
        echo "curl -X DELETE \\"
        echo "  -H \"Authorization: token YOUR_TOKEN\" \\"
        echo "  -H \"Accept: application/vnd.github.v3+json\" \\"
        echo "  \"https://api.github.com/repos/$REPO/git/refs/heads/$branch\""
        echo ""
    done
}

# Function to generate git delete commands
generate_git_commands() {
    echo "# Git commands to delete branches"
    echo "# Requires authenticated git session"
    echo ""
    
    echo "# Option 1: Delete branches one by one"
    for branch in "${BRANCHES[@]}"; do
        echo "git push origin :$branch"
    done
    
    echo ""
    echo "# Option 2: Delete all branches in a single command"
    echo "git push origin --delete \\"
    for branch in "${BRANCHES[@]}"; do
        if [[ "$branch" == "${BRANCHES[-1]}" ]]; then
            echo "  $branch"
        else
            echo "  $branch \\"
        fi
    done
}

# Function to test repository rules
test_repository_rules() {
    echo "🔍 Testing repository rules..."
    
    if [[ -z "${COPILOT_PAT}" ]]; then
        echo "❌ COPILOT_PAT environment variable not found"
        echo "Cannot test repository rules without authentication token"
        return 1
    fi
    
    echo "Checking repository rulesets..."
    rulesets=$(curl -s -H "Authorization: token ${COPILOT_PAT}" \
                  -H "Accept: application/vnd.github.v3+json" \
                  "https://api.github.com/repos/$REPO/rulesets")
    
    if echo "$rulesets" | jq -e '.[0]' &>/dev/null; then
        echo "Found active rulesets:"
        echo "$rulesets" | jq -r '.[] | "- \(.name) (ID: \(.id)) - \(.enforcement)"'
        
        # Check each ruleset for deletion rules
        local has_deletion_rules=false
        for ruleset_id in $(echo "$rulesets" | jq -r '.[] | .id'); do
            ruleset_detail=$(curl -s -H "Authorization: token ${COPILOT_PAT}" \
                               -H "Accept: application/vnd.github.v3+json" \
                               "https://api.github.com/repos/$REPO/rulesets/$ruleset_id")
            
            if echo "$ruleset_detail" | jq -e '.rules[]? | select(.type == "deletion")' &>/dev/null; then
                ruleset_name=$(echo "$ruleset_detail" | jq -r '.name')
                echo "⚠️  Ruleset '$ruleset_name' contains deletion restrictions!"
                has_deletion_rules=true
            fi
        done
        
        if [[ "$has_deletion_rules" == "true" ]]; then
            echo ""
            echo "❌ Repository rules are blocking branch deletion!"
            echo "Manage rulesets at: https://github.com/$REPO/rules"
            return 1
        else
            echo "✅ No deletion-blocking rules found in rulesets"
            return 0
        fi
    else
        echo "✅ No active repository rulesets found"
        return 0
    fi
}

# Function to verify cleanup
verify_cleanup() {
    echo "🔍 Verifying cleanup..."
    if [[ -n "${COPILOT_PAT}" ]]; then
        echo "Checking remaining copilot/fix-* branches via API..."
        response=$(curl -s -H "Authorization: token ${COPILOT_PAT}" \
                      -H "Accept: application/vnd.github.v3+json" \
                      "https://api.github.com/repos/$REPO/branches?per_page=100")
        
        copilot_branches=$(echo "$response" | jq -r '.[] | select(.name | startswith("copilot/fix")) | .name' 2>/dev/null)
        if [[ -z "$copilot_branches" ]]; then
            echo "✅ No copilot/fix-* branches remaining"
        else
            echo "⚠️  Remaining copilot/fix-* branches:"
            echo "$copilot_branches"
        fi
    elif command -v gh &> /dev/null; then
        echo "Checking remaining copilot/fix-* branches:"
        gh api "/repos/$REPO/branches" --paginate | jq -r '.[] | select(.name | startswith("copilot/fix")) | .name' || echo "No copilot/fix-* branches remaining ✅"
    else
        echo "GitHub CLI not available. Please verify manually at:"
        echo "https://github.com/$REPO/branches"
    fi
}

# Main script logic
case "${1:-help}" in
    "delete")
        delete_with_auth
        ;;
    "test-rules")
        test_repository_rules
        ;;
    "generate")
        generate_curl_commands > copilot-branch-cleanup-commands.txt
        echo "📝 Curl commands generated in: copilot-branch-cleanup-commands.txt"
        ;;
    "git")
        generate_git_commands > copilot-branch-git-commands.txt
        echo "📝 Git commands generated in: copilot-branch-git-commands.txt"
        ;;
    "verify")
        verify_cleanup
        ;;
    "list")
        echo "📋 Branches scheduled for deletion:"
        printf '%s\n' "${BRANCHES[@]}"
        ;;
    *)
        echo "Usage: $0 {delete|generate|git|verify|list|test-rules}"
        echo ""
        echo "Commands:"
        echo "  delete     - Delete all copilot/fix-* branches using available authentication"
        echo "  generate   - Generate curl commands for manual execution" 
        echo "  git        - Generate git commands for authenticated deletion"
        echo "  verify     - Check if cleanup was successful"
        echo "  list       - List all branches scheduled for deletion"
        echo "  test-rules - Test repository rules that might block deletion"
        echo ""
        echo "Requirements:"
        echo "  - COPILOT_PAT environment variable (recommended) or GitHub CLI (gh)"
        echo "  - Repository admin permissions"
        echo "  - Resolved repository rules (use 'test-rules' to check)"
        ;;
esac