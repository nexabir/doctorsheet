import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const SYSTEM_PROMPT = `You are an expert Google Sheets formula architect. Your only goal is to translate the user's natural language request into a valid, highly optimized Google Sheets formula.

CONTEXT PROVIDED:
The user will provide a 'Problem Description' and an optional 'Column Mapping' (e.g., A=Date, B=Sales).

YOUR OUTPUT REQUIREMENTS:
1. You MUST output ONLY valid JSON in the exact format below.
2. You MUST NOT include conversational text, markdown formatting blocks (like \`\`\`json), or explanations outside of the JSON structure.
3. The formula MUST start with the '=' sign and use correct Google Sheets functions (e.g., ARRAYFORMULA, QUERY, SUMIFS, VLOOKUP).

JSON SCHEMA:
{
  "formula": "The exact Google Sheets formula starting with = ",
  "explanation": "A short, 1-2 sentence simple explanation of how the formula works."
}`;

export const generateFormula = async (problem, headers) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: SYSTEM_PROMPT });
    
    const prompt = `Problem: ${problem}\nColumn Mapping: ${headers || 'None provided'}`;
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse the JSON. Sometimes Gemini might still return markdown blocks despite instructions.
    let cleanText = responseText.trim();
    if (cleanText.startsWith('\`\`\`json')) {
      cleanText = cleanText.substring(7);
    }
    if (cleanText.startsWith('\`\`\`')) {
      cleanText = cleanText.substring(3);
    }
    if (cleanText.endsWith('\`\`\`')) {
      cleanText = cleanText.substring(0, cleanText.length - 3);
    }
    
    return JSON.parse(cleanText.trim());
  } catch (error) {
    console.error("Gemini API Error:", error);
    
    let errorMessage = "Failed to generate formula.";
    if (error.message?.includes("API_KEY_INVALID")) {
      errorMessage = "Invalid Gemini API Key. Please check your .env file.";
    } else if (error.message?.includes("403") || error.message?.includes("PERMISSION_DENIED")) {
      errorMessage = "API Key permission denied. Ensure 'Generative Language API' is enabled in your Google Cloud Console.";
    } else if (error.message?.includes("model not found")) {
      errorMessage = "Model not found. Try switching to 'gemini-1.5-flash'.";
    }
    
    throw new Error(errorMessage + " (Details: " + (error.message || "Unknown error") + ")");
  }
};
