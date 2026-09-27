export const buildDiscoveryPrompt = ({ originalIdea, userNotes = '', previousResult = null }) => {
  let prompt = `
You are a world-class startup advisor, brand strategist, and market discovery researcher.
Analyze the following business or product idea and break it down into deep foundational discovery elements.

Original Product/Business Idea:
"""
${originalIdea}
"""
`;

  if (userNotes) {
    prompt += `
Additional User Context/Answers:
"""
${userNotes}
"""
`;
  }

  if (previousResult) {
    prompt += `
Prior Discovery Attempt:
${JSON.stringify(previousResult, null, 2)}
Please provide a FRESH, deeper, and meaningfully different angle/refinement from the prior attempt.
`;
  }

  prompt += `
Return a JSON object strictly matching this schema:
{
  "problem": "Clear, acute statement of the core problem and friction points being solved",
  "targetAudience": "Detailed description of primary customer archetype, their pains, motivations, and behaviors",
  "context": "Market landscape context and why now is the right time for this solution",
  "goals": ["3 to 4 concrete business or user transformation goals"],
  "constraints": ["2 to 3 key market, technical, or psychological constraints"],
  "value": "The fundamental unfair advantage or core value delivered to users",
  "assumptions": ["3 key unproven hypotheses that need validation"],
  "openQuestions": ["3 critical strategic questions the founder must answer"]
}
`;

  return prompt;
};
