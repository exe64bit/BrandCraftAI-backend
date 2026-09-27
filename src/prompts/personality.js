export const buildPersonalityPrompt = ({ originalIdea, discovery, positioning, previousResult = null }) => {
  let prompt = `
You are an executive brand identity strategist specializing in brand archetypes, tone of voice, and behavioral identity.
Define a compelling, highly coherent Brand Personality based on the Discovery and Positioning below.

Original Idea: ${originalIdea}
Target Audience: ${discovery?.targetAudience || 'N/A'}
Positioning Category: ${positioning?.category || 'N/A'}
Differentiator: ${positioning?.differentiator || 'N/A'}
Value Proposition: ${positioning?.valueProposition || 'N/A'}
`;

  if (previousResult) {
    prompt += `
Prior Personality Attempt:
${JSON.stringify(previousResult, null, 2)}
Please provide a distinct, fresh personality profile (e.g. leaning towards a different archetype like Explorer vs. Sage vs. Creator).
`;
  }

  prompt += `
Return a JSON object strictly matching this schema:
{
  "traits": [
    {
      "trait": "Specific character trait (e.g. 'Catalytic', 'Pragmatic', 'Empathetic', 'Unyielding')",
      "reason": "Direct justification explaining why this trait resonates with the target audience and advances positioning"
    }
  ],
  "avoidTraits": [
    "3 to 4 anti-traits the brand must NEVER embody (e.g., 'Bureaucratic', 'Condescending', 'Overly Corporate')"
  ],
  "principles": [
    "3 core behavioral and voice principles guiding communication and user experience"
  ]
}
Note: Provide 3 to 5 strong, non-generic traits. Every trait MUST have an audience-tied reason.
`;

  return prompt;
};
