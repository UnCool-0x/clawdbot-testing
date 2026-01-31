const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require('../config/env');

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: config.MODEL_NAME });

const generateResponse = async (context, userMessage) => {
    try {
        // Construct a prompt that enforces context usage
        const systemPrompt = `
You are a smart, helpful AI assistant.
Your goal is to be concise and highly contextual.

HISTORY (Read this carefully):
${context}

USER'S NEW MESSAGE:
${userMessage}

INSTRUCTIONS:
- Reply directly to the user.
- Use the history to maintain continuity.
- Do not repeat the timestamp prefixes in your output.
`;
        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("LLM Error:", error);
        throw new Error("Failed to generate response from AI");
    }
};

module.exports = { generateResponse };
