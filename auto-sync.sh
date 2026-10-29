#!/usr/bin/env bash
# ============================================================================
# AURELION — Automated Git Commit, Push & Vercel Auto-Deploy Daemon
# Watches for any file changes in the workspace, automatically commits them,
# pushes to GitHub (origin/main), and deploys to Vercel production.
# ============================================================================

export PATH="/Users/aditya/.gemini/antigravity/scratch/tools/node-v22.14.0-darwin-arm64/bin:$PATH"
PROJECT_DIR="/Users/aditya/.gemini/antigravity/scratch/aurelion-bank"
cd "$PROJECT_DIR" || exit 1

echo "=================================================================="
echo "  AURELION Auto-Commit & Vercel Auto-Deploy Watcher Active"
echo "  Project: $PROJECT_DIR"
echo "=================================================================="

while true; do
  # Check if there are any uncommitted or untracked changes
  if [ -n "$(git status --porcelain)" ]; then
    # Wait 3 seconds for burst file saves to settle
    sleep 3
    if [ -n "$(git status --porcelain)" ]; then
      TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
      CHANGED_FILES=$(git status --porcelain | wc -l | tr -d ' ')
      echo "[$TIMESTAMP] Detected $CHANGED_FILES changed file(s). Committing..."

      git add -A
      git commit -m "chore(auto-sync): update $CHANGED_FILES file(s) at $TIMESTAMP" || true

      # If a remote 'origin' is configured, push to GitHub automatically
      if git remote get-url origin >/dev/null 2>&1; then
        echo "[$TIMESTAMP] Pushing to GitHub (origin/main)..."
        git push -u origin main || echo "[$TIMESTAMP] Warning: git push failed (check GitHub auth)."
      fi

      # Trigger direct Vercel production deployment to guarantee instant live update
      echo "[$TIMESTAMP] Triggering Vercel production deployment..."
      vercel deploy --prod --yes || echo "[$TIMESTAMP] Warning: Vercel deploy encountered an issue."
      echo "[$TIMESTAMP] Auto-sync & deployment complete!"
    fi
  fi
  sleep 5
done
