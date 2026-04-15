import Groq from "groq-sdk";

export default async function handler(req, res) {
  // 1. Basic security: Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { problem, headers } = req.body;

  // 2. Validate input
  if (!problem) {
    return res.status(400).json({ error: 'Problem description is required' });
  }

  // 3. Initialize Groq with the server-side API key
  // Note: On Vercel, we access this via process.env
  const apiKey = process.env.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY;
  
  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  const groq = new Groq({ apiKey });

  const SYSTEM_PROMPT = `You are a Senior Google Sheets Engineer. Your task is to convert natural language into a valid Google Sheets formula.

OUTPUT FORMAT:
Return ONLY a JSON object with this exact structure:
{
  "formula": "The formula starting with =",
  "explanation": "A concise explanation of the logic."
}

RULES:
- No conversational text.
- No markdown code blocks.
- Use ARRAYFORMULA where appropriate for efficiency.
- Ensure all column references match the provided Context Mapping.`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { 
          role: "user", 
          content: `Problem: ${problem}\nContext Mapping: ${headers || 'None'}` 
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    const content = chatCompletion.choices[0]?.message?.content;
    if (!content) throw new Error("No response from Groq");

    // Return the JSON response to the client
    return res.status(200).json(JSON.parse(content));
    
  } catch (error) {
    console.error("Server-side Groq Error:", error);
    return res.status(500).json({ 
      error: 'Logic Engine Error', 
      details: error.message 
    });
  }
}
