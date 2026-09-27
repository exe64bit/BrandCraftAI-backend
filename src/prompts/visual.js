export const buildVisualPrompt = ({
  originalIdea,
  discovery,
  positioning,
  personality,
  selectedName,
  critique,
  previousResult = null,
}) => {
  const brandName = selectedName || 'Brand';

  let prompt = `
You are a visionary Design Director and Head of Brand Identity at a top design studio (like Pentagram or Collins).
Develop an evocative, cohesive Visual Direction for "${brandName}" that addresses past critique and elevates the brand personality.

Context:
- Brand Name: "${brandName}"
- Product Idea: ${originalIdea}
- Target Audience: ${discovery?.targetAudience || 'N/A'}
- Category: ${positioning?.category || 'N/A'}
- Differentiator: ${positioning?.differentiator || 'N/A'}
- Personality: ${(personality?.traits || []).map((t) => (typeof t === 'string' ? t : t.trait)).join(', ')}
- Critique Considerations: ${(critique?.alternatives || []).slice(0, 2).join('; ')}
`;

  if (previousResult) {
    prompt += `
Prior Visual Direction:
${JSON.stringify(previousResult, null, 2)}
Please provide an alternative, fresh aesthetic direction with different harmonic color choices and visual metaphors.
`;
  }

  prompt += `
Return a JSON object strictly matching this schema:
{
  "colors": {
    "primary": "Hex color code (#xxxxxx) that defines the brand's core signature tone",
    "secondary": "Complementary hex color code (#xxxxxx)",
    "accent": "Punchy contrasting accent hex code (#xxxxxx) for CTAs and highlights",
    "background": "Soft, refined background hex code (usually light or dark tint)",
    "text": "High-contrast legible text hex code",
    "paletteRationale": "Explanation of the color theory and emotional resonance of this palette"
  },
  "typography": {
    "headingFont": "Recommended Google/Web font for headings (e.g. 'Space Grotesk', 'Syne', 'Plus Jakarta Sans', 'Outfit')",
    "bodyFont": "Recommended Google/Web font for UI & body (e.g. 'Inter', 'Geist', 'DM Sans')",
    "styleGuide": "Typographic hierarchy, weight pairings, and micro-copy styling guidance"
  },
  "mood": "Rich 2-3 sentence description of the brand's atmosphere, energy, and tactile visual world",
  "shapes": [
    "3 to 4 defining geometry motifs (e.g., 'Asymmetric soft rounds', 'Brutalist gridlines', 'Organic interlocking waves')"
  ],
  "symbols": [
    "3 symbolic metaphors to explore in brand iconography and visual assets"
  ],
  "imagery": {
    "style": "Overall imagery style (e.g. 'Authentic candid documentary with crisp digital accents')",
    "photography": "Subject matter, model demographics, candidness, and framing directions",
    "composition": "Grid rules, negative space ratio, and focal point guidelines",
    "lighting": "Lighting mood (e.g. 'Golden hour rim lighting with high ambient soft fill')"
  },
  "logoDirection": "Detailed concept prompt for the logo mark: icon archetype, wordmark treatment, and negative space interplay",
  "avoid": [
    "3 to 4 visual cliches and aesthetics to strictly avoid in visual execution"
  ]
}
Make sure all color codes are valid 6-character hex strings starting with '#'.
`;

  return prompt;
};
