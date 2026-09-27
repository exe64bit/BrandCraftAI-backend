import { GoogleGenAI } from '@google/genai';

let genAIClient = null;

export const getGeminiClient = () => {
  const apiKey = process.env.LLM_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({ apiKey });
  }
  return genAIClient;
};

/**
 * Extracts and cleans JSON from a model output string.
 */
export const cleanAndParseJSON = (text) => {
  if (!text || typeof text !== 'string') {
    throw new Error('No text received from AI model');
  }

  let cleaned = text.trim();

  // Strip Markdown code block wrappers
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/i, '').replace(/\s*```$/, '');
  }

  cleaned = cleaned.trim();

  try {
    return JSON.parse(cleaned);
  } catch (initialErr) {
    // Attempt to locate outer-most JSON object or array
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        const potentialJson = cleaned.slice(firstBrace, lastBrace + 1);
        return JSON.parse(potentialJson);
      } catch (e) {
        // Continue to array check
      }
    }

    const firstBracket = cleaned.indexOf('[');
    const lastBracket = cleaned.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
      try {
        const potentialArray = cleaned.slice(firstBracket, lastBracket + 1);
        return JSON.parse(potentialArray);
      } catch (e) {
        // Fail
      }
    }

    throw new Error(`Failed to parse model output as JSON: ${initialErr.message}`);
  }
};

/**
 * Calls Gemini with structured JSON output and automatic retry.
 */
export const callGeminiJSON = async ({ prompt, systemInstruction = '', model = null, retries = 1 }) => {
  const client = getGeminiClient();
  if (!client) {
    throw new Error('LLM_API_KEY is not configured in backend/.env. Please add a valid Gemini API key.');
  }

  // Respect GEMINI_MODEL env var as the primary model, then fallback chain
  const primaryModel = model || process.env.GEMINI_MODEL || 'gemini-2.0-flash';

  const modelsToTry = [
    primaryModel,
    'gemini-3.8-flash',
    'gemini-3.7-flash',
    'gemini-3.6-flash',
    'gemini-3.5-flash',
    'gemini-3.5-flash-lite'
  ];

  let lastError = null;

  for (const candidateModel of [...new Set(modelsToTry)]) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await client.models.generateContent({
          model: candidateModel,
          contents: prompt,
          config: {
            systemInstruction: systemInstruction || 'You are an elite brand strategist, naming expert, and creative director. Always return strict, valid JSON matching the requested schema. Never output conversational preamble or markdown backticks around the JSON unless inside standard brackets.',
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
        });

        const rawText = response.text || (response.candidates?.[0]?.content?.parts?.[0]?.text);
        if (!rawText) {
          throw new Error('Empty response received from Gemini API');
        }

        const parsed = cleanAndParseJSON(rawText);
        return parsed;
      } catch (err) {
        lastError = err;
        console.warn(`[Gemini AI] Attempt ${attempt + 1} with model ${candidateModel} failed: ${err.message}`);
        // If it's a model not found error, break to try the next model
        if (
          err.message?.includes('404') ||
          err.message?.toLowerCase().includes('not found') ||
          err.message?.includes('NOT_FOUND') ||
          err.message?.includes('unsupported model')
        ) {
          break;
        }
        // Small delay before retry
        await new Promise((res) => setTimeout(res, 800));
      }
    }
  }

  throw new Error(`Gemini AI Generation failed: ${lastError?.message || 'Unknown error'}`);
};
