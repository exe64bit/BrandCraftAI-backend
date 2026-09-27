import { callGeminiJSON } from './gemini.js';
import { buildPersonalityPrompt } from '../prompts/personality.js';

export const runPersonalityStage = async ({ originalIdea, discovery, positioning, previousResult = null }) => {
  const prompt = buildPersonalityPrompt({ originalIdea, discovery, positioning, previousResult });
  const systemInstruction = 'You are a brand archetype and personality architect. Return 3-5 justified traits, anti-traits to avoid, and foundational principles.';

  const result = await callGeminiJSON({ prompt, systemInstruction });

  // Format traits to { trait, reason }
  let traits = [];
  if (Array.isArray(result.traits)) {
    traits = result.traits.map((t) => {
      if (typeof t === 'string') {
        return { trait: t, reason: 'Essential for building user trust and rapid adoption.' };
      }
      return {
        trait: t.trait || 'Dynamic',
        reason: t.reason || 'Directly addresses audience need for momentum and confidence.',
      };
    });
  }

  if (traits.length === 0) {
    traits = [
      { trait: 'Catalytic', reason: 'Sparks immediate peer momentum and breaks initial hesitation.' },
      { trait: 'Empathetic', reason: 'Understands the stress of finding trusted project partners.' },
      { trait: 'Sharp', reason: 'Eliminates wasted effort with precise, high-signal matchmaking.' },
    ];
  }

  return {
    traits,
    avoidTraits: Array.isArray(result.avoidTraits) && result.avoidTraits.length ? result.avoidTraits : ['Bureaucratic', 'Distant', 'Transactional'],
    principles: Array.isArray(result.principles) && result.principles.length ? result.principles : ['Clarity over cleverness', 'Foster genuine momentum', 'Respect the user’s craft'],
  };
};
