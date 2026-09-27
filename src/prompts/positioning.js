export const buildPositioningPrompt = ({ originalIdea, discovery, previousResult = null }) => {
  let prompt = `
You are a premier positioning and category design consultant (like April Dunford or Marty Cagan).
Based on the validated Discovery insights below, craft an irresistible strategic positioning foundation.

Original Idea:
"""
${originalIdea}
"""

Discovery Foundation:
- Problem: ${discovery?.problem || 'N/A'}
- Target Audience: ${discovery?.targetAudience || 'N/A'}
- Context: ${discovery?.context || 'N/A'}
- Goals: ${(discovery?.goals || []).join('; ')}
- Core Value: ${discovery?.value || 'N/A'}
`;

  if (previousResult) {
    prompt += `
Prior Positioning Attempt:
${JSON.stringify(previousResult, null, 2)}
Provide an alternative, sharper positioning strategy with a distinctly fresh strategic posture.
`;
  }

  prompt += `
Return a JSON object strictly matching this schema:
{
  "category": "Precise market category or new category creation definition (e.g., 'Collaborative Project Matchmaking Platform for Higher Education')",
  "differentiator": "The distinct, defensible attribute that makes this impossible to confuse with existing alternatives",
  "valueProposition": "High-impact, concise value proposition highlighting user gain",
  "competitiveAngle": "How this solution positions against direct competitors and default behaviors (status quo)",
  "positioningStatement": "For [target audience] who [problem/need], [product] is a [category] that [key benefit]. Unlike [alternatives], our product [primary differentiator]."
}
`;

  return prompt;
};
