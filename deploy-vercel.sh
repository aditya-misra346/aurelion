#!/usr/bin/env bash
set -e

export PATH="/Users/aditya/.gemini/antigravity/scratch/tools/node-v22.14.0-darwin-arm64/bin:$PATH"
cd "$(dirname "$0")"

echo "==================================================="
echo "  AURELION — VERCEL PRODUCTION DEPLOYMENT"
echo "  Made by Aditya Misra"
echo "==================================================="

echo "[1/2] Building production bundle..."
npm run build

echo "[2/2] Deploying to Vercel..."
vercel --prod --yes
