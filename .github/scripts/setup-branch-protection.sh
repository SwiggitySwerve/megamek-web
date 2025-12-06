#!/bin/bash
# Script to set up branch protection for main branch
# Requires GitHub CLI (gh) to be installed and authenticated
# Run: bash .github/scripts/setup-branch-protection.sh

set -e

REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
BRANCH="main"

echo "Setting up branch protection for $REPO:$BRANCH..."

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "   Install from: https://cli.github.com/"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub CLI."
    echo "   Run: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI is installed and authenticated"

# Set branch protection rules
echo "📝 Configuring branch protection rules..."

gh api repos/:owner/:repo/branches/$BRANCH/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["Lint and Test","Build Test / win","Build Test / mac","Build Test / linux"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true,"require_code_owner_reviews":false,"require_last_push_approval":false}' \
  --field restrictions=null \
  --field allow_force_pushes=false \
  --field allow_deletions=false \
  --field block_creations=false \
  --field required_linear_history=false \
  --field allow_fork_syncing=false \
  --field lock_branch=false \
  --field allow_lock_branch=false \
  --field required_conversation_resolution=true

echo ""
echo "✅ Branch protection configured successfully!"
echo ""
echo "Branch protection rules:"
echo "  - ✅ Require pull request reviews (1 approval)"
echo "  - ✅ Require status checks to pass:"
echo "      - Lint and Test"
echo "      - Build Test / win"
echo "      - Build Test / mac"
echo "      - Build Test / linux"
echo "  - ✅ Require conversation resolution"
echo "  - ✅ Enforce for administrators"
echo "  - ❌ Block force pushes"
echo "  - ❌ Block deletions"
echo ""
echo "Direct commits to main are now blocked. All changes must go through PRs."
