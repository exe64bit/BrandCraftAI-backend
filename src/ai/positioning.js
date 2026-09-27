import { callGeminiJSON } from './gemini.js';
import { buildPositioningPrompt } from '../prompts/positioning.js';

export const runPositioningStage = async ({ originalIdea, discovery, previousResult = null }) => {
  const prompt = buildPositioningPrompt({ originalIdea, discovery, previousResult });
  const systemInstruction = 'You are a master positioning strategist. Generate precise market categorization, sharp differentiators, and a crisp positioning statement.';

  const result = await callGeminiJSON({ prompt, systemInstruction });

  return {
    category: result.category || 'Specialized Workflow Platform',
    differentiator: result.differentiator || 'Proprietary matching algorithms and verified peer reputation',
    valueProposition: result.valueProposition || 'Connect seamlessly with high-caliber counterparts in seconds.',
    competitiveAngle: result.competitiveAngle || 'Shifts focus from generic directory listings to high-context collaborative fit.',
    positioningStatement: result.positioningStatement || `For modern builders, this platform transforms fragmented discovery into reliable synergy.`,
  };
};
