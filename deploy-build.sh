#!/usr/bin/env zsh
set -e
export PATH="/Users/aditya/.gemini/antigravity/scratch/tools/node-v22.14.0-darwin-arm64/bin:$PATH"
cd "$(dirname "$0")"

echo "Building Aurelion Production Bundle..."
npm run build

echo "Starting Production Preview Server on http://localhost:4173 ..."
npm run preview -- --port 4173 --host
