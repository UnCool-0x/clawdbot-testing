# 🧠 ClawdProxy Server

A smart, multi-user chat backend powered by **Gemini 2.0 Flash**. 
Features **JWT Authentication**, **Persistent Context (Markdown)**, and **Auto-Git-Sync** for Obsidian integration.

## 🚀 Quick Start for AI Agents (Clawdbot)

If you are a Clawdbot instance setting this up in a new environment, follow these steps strictly:

### 1. Clone the Repository
```bash
git clone https://github.com/UnCool-0x/clawdbot-testing.git proxy_server
cd proxy_server
```

### 2. Run the Setup Script
You need the **Gemini API Key** and a **GitHub Personal Access Token** (with `repo` scope) ready.

```bash
# Syntax: ./setup.sh <GEMINI_KEY> <GITHUB_TOKEN> <OPTIONAL_JWT_SECRET>
./setup.sh "AIzaSy..." "ghp_..." "my_super_secret_jwt_key"
```
*This script installs dependencies, creates the `.env` file, and configures Git for auto-sync.*

### 3. Start the Server
```bash
npm start
```
*Server runs on Port 3000 by default.*

---

## 📡 API Usage

### 1. Authenticate (Get Token)
```bash
curl -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username": "anukul"}'
```
**Returns:** `{"accessToken": "eyJ..."}`

### 2. Chat (Send Message)
```bash
curl -X POST http://localhost:3000/chat \
     -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
     -H "Content-Type: application/json" \
     -d '{"message": "Hello, do you remember me?"}'
```
**Features:**
- Auto-loads context from `memory/users/{username}.md`.
- Auto-saves reply to the same file.
- **Auto-Pushes** updates to GitHub (synced to User's Obsidian).

---

## 📂 Project Structure

```
proxy_server/
├── src/
│   ├── config/         # Environment variables
│   ├── middleware/     # JWT Auth logic
│   ├── routes/         # API Routes (Auth, Chat)
│   ├── services/       # Core Logic (LLM, Memory, GitSync)
│   └── app.js          # Express App setup
├── memory/             # User chat logs (Obsidian Vault compatible)
├── server.js           # Entry point
└── setup.sh            # One-shot setup script
```
