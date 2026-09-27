import { callGeminiJSON } from './gemini.js';
import { buildConsistencyPrompt } from '../prompts/consistency.js';

export const runConsistencyStage = async ({
  selectedName,
  originalIdea,
  positioning,
  personality,
  visualDirection,
  launchKit = null,
}) => {
  const prompt = buildConsistencyPrompt({
    selectedName,
    originalIdea,
    positioning,
    personality,
    visualDirection,
    launchKit,
  });

  const systemInstruction = 'You are a meticulous Brand Governance Auditor. Calculate an AI coherence estimate score (0-100) and highlight structural alignment or friction points.';

  const result = await callGeminiJSON({ prompt, systemInstruction });

  let score = Number(result.score);
  if (isNaN(score) || score < 1 || score > 100) {
    score = 88;
  }

  return {
    score,
    scoreExplanation: result.scoreExplanation || 'AI-generated internal coherence estimate based on semantic and aesthetic harmony between positioning, voice, and visual assets.',
    issues: Array.isArray(result.issues) && result.issues.length
      ? result.issues
      : [
          'High energy in visual palette could overshadow serious academic utility if not balanced with clean negative space.',
          'Ensure the brand voice avoids casual slang that could diminish credibility with university advisors.',
        ],
    recommendations: Array.isArray(result.recommendations) && result.recommendations.length
      ? result.recommendations
      : [
          'Anchor all landing page copy around tangible project outcomes and verified skills.',
          'Standardize the secondary color as the primary indicator for completed team milestones.',
          'Introduce structured team agreements as a hallmark branded feature.',
        ],
  };
};
