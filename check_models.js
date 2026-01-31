const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    const models = await genAI.getGenerativeModel({ model: "gemini-pro" }).apiKey; // Just to init
    // Actually, let's use the list method if available, or just try a standard one
    // The SDK doesn't always expose listModels directly easily in older docs, 
    // but let's try a direct fetch to the API endpoint to be sure.
    console.log("Checking API...");
    // We will just try to hit the API directly via curl in the next step if this fails.
  } catch (e) {
    console.log(e);
  }
}
// Checking via curl is better.
