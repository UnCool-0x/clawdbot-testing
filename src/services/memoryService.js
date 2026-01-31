const fs = require('fs');
const path = require('path');
const config = require('../config/env');
const { syncToRemote } = require('./syncService');

// Ensure directory exists
if (!fs.existsSync(config.MEMORY_DIR)) {
    fs.mkdirSync(config.MEMORY_DIR, { recursive: true });
}

const getContext = (userId) => {
    const filePath = path.join(config.MEMORY_DIR, `${userId}.md`);
    if (!fs.existsSync(filePath)) {
        const initContent = `# Memory for User: ${userId}\nCreated: ${new Date().toISOString()}\n\n---\n`;
        fs.writeFileSync(filePath, initContent);
        return initContent;
    }
    return fs.readFileSync(filePath, 'utf8');
};

const appendInteraction = (userId, userMsg, assistantMsg) => {
    const filePath = path.join(config.MEMORY_DIR, `${userId}.md`);
    const timestamp = new Date().toISOString();
    
    const entry = `\n[${timestamp}] **User**: ${userMsg}\n[${timestamp}] **Assistant**: ${assistantMsg}\n`;
    
    fs.appendFileSync(filePath, entry);
    
    // Trigger Auto-Sync
    syncToRemote();
};

module.exports = { getContext, appendInteraction };
