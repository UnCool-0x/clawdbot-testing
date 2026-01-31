require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "replace_this_with_a_random_secret"; // Fallback if env missing
const MEMORY_DIR = path.join(__dirname, 'memory', 'users');

// Ensure memory directory exists
if (!fs.existsSync(MEMORY_DIR)) {
    fs.mkdirSync(MEMORY_DIR, { recursive: true });
}

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

app.use(cors());
app.use(bodyParser.json());

// --- Middleware: JWT Authentication ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) return res.status(401).json({ error: "Access Denied: No Token Provided" });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid Token" });
        req.user = user; // User info from token
        next();
    });
};

// --- Helper: Memory Management ---
const getContext = (userId) => {
    const filePath = path.join(MEMORY_DIR, `${userId}.md`);
    if (!fs.existsSync(filePath)) {
        // Initialize new user file with a header
        const initContent = `# Memory for User: ${userId}\nCreated: ${new Date().toISOString()}\n\n---\n`;
        fs.writeFileSync(filePath, initContent);
        return initContent;
    }
    return fs.readFileSync(filePath, 'utf8');
};

const updateMemory = (userId, role, content) => {
    const filePath = path.join(MEMORY_DIR, `${userId}.md`);
    const timestamp = new Date().toISOString();
    const entry = `\n[${timestamp}] **${role}**: ${content}\n`;
    fs.appendFileSync(filePath, entry);
};

// --- Routes ---

// Health Check
app.get('/status', (req, res) => {
    res.json({ status: "running", port: PORT });
});

// Main Chat Endpoint (Protected)
app.post('/chat', authenticateToken, async (req, res) => {
    try {
        // We expect userId to be in the body, or we can use the one from JWT (req.user.id)
        // For flexibility, let's prefer body, fallback to JWT.
        const userId = req.body.userId || req.user.id || req.user.username; 
        const userMessage = req.body.message;

        if (!userId || !userMessage) {
            return res.status(400).json({ error: "Missing userId or message" });
        }

        console.log(`[${userId}] Inbound: ${userMessage.substring(0, 50)}...`);

        // 1. Read Context
        const memoryContent = getContext(userId);

        // 2. Build Smart Prompt
        // We give the AI the memory file as "Context" and instructions to behave properly.
        const systemPrompt = `
You are a smart, helpful AI assistant interacting with a user. 
Your goal is to be concise, helpful, and retain context from previous conversations.

SYSTEM CONTEXT:
- You are running on a custom backend.
- You have access to the user's history below.

USER HISTORY (MEMORY.md):
${memoryContent.slice(-10000)} // Limit to last ~10k chars to fit context window if file gets huge

CURRENT INTERACTION:
User: ${userMessage}
Assistant:`;

        // 3. Call AI
        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const botReply = response.text();

        // 4. Save to Memory (Update the MD file)
        updateMemory(userId, "User", userMessage);
        updateMemory(userId, "Assistant", botReply);

        console.log(`[${userId}] Outbound: ${botReply.substring(0, 50)}...`);

        res.json({ 
            reply: botReply,
            userId: userId
        });

    } catch (error) {
        console.error("Handler Error:", error);
        res.status(500).json({ error: "Internal Error", details: error.message });
    }
});

// Helper route to generate a test token (REMOVE IN PROD)
app.post('/auth/login', (req, res) => {
    // In a real app, you'd check username/password here.
    const username = req.body.username || "guest";
    const user = { name: username, id: username };
    
    const accessToken = jwt.sign(user, JWT_SECRET);
    res.json({ accessToken: accessToken });
});

app.listen(PORT, () => {
    console.log(`ClawdProxy v2 running on port ${PORT}`);
});
