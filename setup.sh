#!/bin/bash

# ClawdProxy Setup Script
# Usage: ./setup.sh <GEMINI_API_KEY> <GITHUB_TOKEN> [JWT_SECRET]

GEMINI_KEY=$1
GITHUB_TOKEN=$2
JWT_SECRET=${3:-"replace_this_with_a_random_secret"}

if [ -z "$GEMINI_KEY" ] || [ -z "$GITHUB_TOKEN" ]; then
    echo "Usage: ./setup.sh <GEMINI_API_KEY> <GITHUB_TOKEN> [JWT_SECRET]"
    exit 1
fi

echo "🚀 Setting up ClawdProxy..."

# 1. Install Dependencies
echo "📦 Installing Node dependencies..."
npm install

# 2. Setup Environment
echo "wm Configuring environment..."
cat > .env <<EOL
PORT=3000
GEMINI_API_KEY=$GEMINI_KEY
JWT_SECRET=$JWT_SECRET
MODEL_NAME=gemini-2.0-flash
MEMORY_DIR=$(pwd)/memory/users
EOL

# 3. Setup Git Config (for Sync)
echo "🔗 Configuring Git for Sync..."
git config user.name "ClawdBot Proxy"
git config user.email "bot@clawd.local"
# Set remote with token for auto-push
git remote set-url origin https://UnCool-0x:$GITHUB_TOKEN@github.com/UnCool-0x/clawdbot-testing.git

echo "✅ Setup Complete!"
echo "▶️  Run 'npm start' to launch the server."
