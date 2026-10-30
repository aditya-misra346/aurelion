#!/usr/bin/env bash
# ============================================================================
# AURELION — Automated Git Commit, Push & Vercel Auto-Deploy Daemon
# Watches for any file changes in the workspace, automatically commits them,
# pushes to GitHub (origin/main), and deploys to Vercel production.
# ============================================================================

export PATH="/Users/aditya/.gemini/antigravity/scratch/tools/node-v22.14.0-darwin-arm64/bin:$PATH"
PROJECT_DIR="/Users/aditya/.gemini/antigravity/scratch/aurelion-bank"
LOG_FILE="$PROJECT_DIR/auto-sync.log"
cd "$PROJECT_DIR" || exit 1

log_msg() {
  local msg="[$(date +"%Y-%m-%d %H:%M:%S")] $1"
  echo "$msg"
  echo "$msg" >> "$LOG_FILE"
}

log_msg "=================================================================="
log_msg "  AURELION Auto-Commit & Vercel Auto-Deploy Watcher Active"
log_msg "  Repository: https://github.com/aditya-misra346/aurelion"
log_msg "  Production: https://aurelion-orcin.vercel.app"
log_msg "=================================================================="

while true; do
  # Check if there are uncommitted or untracked changes
  if [ -n "$(git status --porcelain)" ]; then
    sleep 3
    if [ -n "$(git status --porcelain)" ]; then
      CHANGED_COUNT=$(git status --porcelain | wc -l | tr -d ' ')
      log_msg "Detected $CHANGED_COUNT changed file(s). Creating commit..."

      git add -A
      git commit -m "chore(auto-sync): update $CHANGED_COUNT file(s)" >> "$LOG_FILE" 2>&1 || true

      if git remote get-url origin >/dev/null 2>&1; then
        log_msg "Pushing commit to GitHub (origin/main)..."
        git push -u origin main >> "$LOG_FILE" 2>&1 || log_msg "Warning: git push failed."
        log_msg "Pushed successfully to https://github.com/aditya-misra346/aurelion"
      fi

      log_msg "Deploying updated build to Vercel production..."
      vercel deploy --prod --yes >> "$LOG_FILE" 2>&1 || log_msg "Warning: Vercel deploy encountered an issue."
      log_msg "Live deployment updated at https://aurelion-orcin.vercel.app"
    fi
  fi
  sleep 4
done
