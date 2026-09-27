import { callGeminiJSON } from './gemini.js';
import { buildDiscoveryPrompt } from '../prompts/discovery.js';

export const runDiscoveryStage = async ({ originalIdea, userNotes = '', previousResult = null }) => {
  const prompt = buildDiscoveryPrompt({ originalIdea, userNotes, previousResult });
  const systemInstruction = 'You are an elite product and market discovery strategist. Return strictly valid JSON containing deep, non-obvious problem analysis and market dynamics.';

  const result = await callGeminiJSON({ prompt, systemInstruction });

  // Validate and provide sensible defaults
  return {
    problem: result.problem || 'Target users lack a streamlined, unified solution to achieve their core objective.',
    targetAudience: result.targetAudience || 'Early adopters facing friction in current status quo workflows.',
    context: result.context || 'Shifting digital behaviors and emerging workflow expectations.',
    goals: Array.isArray(result.goals) && result.goals.length ? result.goals : ['Accelerate user time-to-value', 'Reduce discovery friction'],
    constraints: Array.isArray(result.constraints) && result.constraints.length ? result.constraints : ['Trust and credential verification', 'Network effects bootstrapping'],
    value: result.value || 'High-fidelity alignment and frictionless collaboration.',
    assumptions: Array.isArray(result.assumptions) && result.assumptions.length ? result.assumptions : ['Users actively seek new workflows over legacy methods'],
    openQuestions: Array.isArray(result.openQuestions) && result.openQuestions.length ? result.openQuestions : ['What is the primary organic discovery channel?'],
    userNotes: userNotes || '',
  };
};
