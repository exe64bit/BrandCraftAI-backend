export const buildConsistencyPrompt = ({
  selectedName,
  originalIdea,
  positioning,
  personality,
  visualDirection,
  launchKit = null,
}) => {
  const brandName = selectedName || 'Brand';

  const prompt = `
You are an expert Brand Governance and System Integrity Auditor.
Audit the internal coherence, alignment, and harmony across the newly constructed brand assets for "${brandName}".

Brand Identity Components:
- Brand Name: "${brandName}"
- Core Idea: ${originalIdea}
- Positioning Category: ${positioning?.category || 'N/A'}
- Value Proposition: ${positioning?.valueProposition || 'N/A'}
- Positioning Statement: ${positioning?.positioningStatement || 'N/A'}
- Personality Traits: ${(personality?.traits || []).map((t) => (typeof t === 'string' ? t : t.trait)).join(', ')}
- Personality Principles: ${(personality?.principles || []).join('; ')}
- Visual Palette: Primary ${visualDirection?.colors?.primary}, Secondary ${visualDirection?.colors?.secondary}, Accent ${visualDirection?.colors?.accent}
- Visual Mood & Direction: ${visualDirection?.mood || 'N/A'}
- Logo Direction: ${visualDirection?.logoDirection || 'N/A'}
${launchKit ? `- Launch Headline: "${launchKit.headline}"\n- One-Line Pitch: "${launchKit.oneLinePitch}"` : ''}

Evaluate how seamlessly these elements work together. Does the visual aesthetic feel right for the personality? Does the name match the category? Are there conflicting tone signals?

Return a JSON object strictly matching this schema:
{
  "score": 88,
  "scoreExplanation": "AI-generated internal coherence estimate calculating alignment between strategic positioning, personality tone, and visual direction (scale 0-100).",
  "issues": [
    "2 to 3 specific friction points where the elements diverge or send mixed signals"
  ],
  "recommendations": [
    "3 concrete harmonizing adjustments to elevate holistic brand cohesion"
  ]
}
Note: 'score' must be an integer between 65 and 98 reflecting realistic critical evaluation.
`;

  return prompt;
};
