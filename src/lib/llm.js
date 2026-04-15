export const generateFormula = async (problem, headers) => {
  // 1. Check for Mock Mode environment
  // We enable mock mode if the environment is strictly local and no proxy is available,
  // or if explicitly requested. For now, we attempt the proxy first.
  
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ problem, headers }),
    });

    if (!response.ok) {
      // If the proxy fails (e.g., during local 'npm run dev' without Vercel CLI),
      // we fallback to mock mode to keep the dev experience smooth.
      if (response.status === 404 || response.status === 500) {
        console.warn("API Proxy not found or failed. Falling back to Mock Mode.");
        return getMockResponse(problem);
      }
      throw new Error(`Server error: ${response.statusText}`);
    }

    return await response.json();
    
  } catch (error) {
    console.error("Logic Engine Error:", error);
    
    // Final safety fallback to mock mode
    console.warn("Falling back to Mock Mode due to connection error.");
    return getMockResponse(problem);
  }
};

// --- Mock Logic (Keeping exactly as before for resiliency) ---
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
