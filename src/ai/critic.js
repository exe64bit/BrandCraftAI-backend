import { callGeminiJSON } from './gemini.js';
import { buildCritiquePrompt } from '../prompts/critic.js';

export const runCritiqueStage = async ({
  originalIdea,
  discovery,
  positioning,
  personality,
  selectedName,
  namingOptions = [],
}) => {
  const prompt = buildCritiquePrompt({
    originalIdea,
    discovery,
    positioning,
    personality,
    selectedName,
    namingOptions,
  });

  const systemInstruction = 'You are a critical, incisive brand strategist. Challenge the brand identity proactively by finding clichés, blind spots, contradictory assumptions, and naming friction.';

  const result = await callGeminiJSON({ prompt, systemInstruction });

  return {
    genericPatterns: Array.isArray(result.genericPatterns) && result.genericPatterns.length
      ? result.genericPatterns
      : ['Overusing buzzwords like "seamless" and "frictionless" without operational proof', 'Relying on standard peer-to-peer directory dynamics'],
    weakAssumptions: Array.isArray(result.weakAssumptions) && result.weakAssumptions.length
      ? result.weakAssumptions
      : ['Assuming users have equal motivation to contribute rather than free-ride', 'Assuming universities will permit third-party grading or team formation'],
    contradictions: Array.isArray(result.contradictions) && result.contradictions.length
      ? result.contradictions
      : ['Tension between wanting a casual social vibe and demanding serious project commitment'],
    audienceMismatch: Array.isArray(result.audienceMismatch) && result.audienceMismatch.length
      ? result.audienceMismatch
      : ['Introverted students may be overwhelmed by heavy social network mechanics'],
    namingConcerns: Array.isArray(result.namingConcerns) && result.namingConcerns.length
      ? result.namingConcerns
      : [`The name '${selectedName || 'Current'}' could feel too generic or close to existing campus utilities without strong trademark distinction.`],
    alternatives: Array.isArray(result.alternatives) && result.alternatives.length
      ? result.alternatives
      : [
          'Emphasize portfolio proof and verified skill showcases over simple social chats.',
          'Introduce milestone-driven contract templates to curb ghosting.',
          'Position as a student portfolio launcher rather than just a quick matchmaker.',
        ],
  };
};
