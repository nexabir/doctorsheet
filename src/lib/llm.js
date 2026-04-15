import Groq from "groq-sdk";

const apiKey = import.meta.env.VITE_GROQ_API_KEY;

// Initialize Groq client
// Note: dangerouslyAllowBrowser is required for client-side API calls
const groq = new Groq({ 
  apiKey: apiKey,
  dangerouslyAllowBrowser: true 
});

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

const MOCK_FORMULAS = [
  {
    keywords: ['sum', 'total', 'add'],
    formula: "=SUMIFS(C:C, A:A, \">\"&E1, B:B, \"Sales\")",
    explanation: "Calculates the total sum in column C where dates in A are after E1 and category in B is 'Sales'."
  },
  {
    keywords: ['find', 'lookup', 'search'],
    formula: "=VLOOKUP(E2, A:C, 3, FALSE)",
    explanation: "Searches for the value in E2 within range A:C and returns the corresponding value from the 3rd column."
  }
];

const getMockResponse = (problem) => {
  const lowerProblem = problem.toLowerCase();
  const match = MOCK_FORMULAS.find(f => f.keywords.some(k => lowerProblem.includes(k)));
  return match || {
    formula: "=INDEX(A:A, MATCH(MAX(B:B), B:B, 0))",
    explanation: "Logic: Finds the value in column A corresponding to the maximum value in column B."
  };
};

export const generateFormula = async (problem, headers) => {
  // Check if API key is missing
  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    console.warn("Using Mock Mode: API key missing.");
    return new Promise((resolve) => {
      setTimeout(() => resolve(getMockResponse(problem)), 1000);
    });
  }

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

    return JSON.parse(content);
  } catch (error) {
    console.error("Groq API Error:", error);
    
    // Fallback to mock on rate limit or other errors to preserve UX
    if (error.status === 429) {
      console.warn("Rate limit reached. Falling back to Mock Mode.");
      return getMockResponse(problem);
    }
    
    throw new Error("Logic Engine could not process this request. " + (error.message || ""));
  }
};
