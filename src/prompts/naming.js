export const buildNamingPrompt = ({ originalIdea, discovery, positioning, personality, existingNames = [], isRegenerate = false }) => {
  let prompt = `
You are a master brand naming specialist who has named iconic global products.
Generate 5 thoughtful, memorable brand name options tailored to the following brand context.

Original Idea: ${originalIdea}
Category: ${positioning?.category || 'N/A'}
Positioning Statement: ${positioning?.positioningStatement || 'N/A'}
Target Audience: ${discovery?.targetAudience || 'N/A'}
Personality Traits: ${(personality?.traits || []).map((t) => (typeof t === 'string' ? t : t.trait)).join(', ')}
`;

  if (existingNames && existingNames.length > 0) {
    prompt += `
Existing / Previous Names:
${existingNames.map((n) => (typeof n === 'string' ? n : n.name)).join(', ')}
${isRegenerate ? 'IMPORTANT: Do NOT repeat any previous names. Generate completely fresh, inventive names from untapped semantic directions!' : ''}
`;
  }

  prompt += `
Territories to cover across options:
- descriptive (clear, literal, functional)
- metaphorical (evocative, storytelling, conceptual)
- abstract (invented, coinage, distinctive sound)
- action-oriented (verb-driven, momentum, catalytic)
- community-oriented (belonging, collective, camaraderie)

Return a JSON object strictly matching this schema:
{
  "options": [
    {
      "name": "Single or compound brand name (e.g., 'SynergyDesk', 'Kith & Kin', 'Squadra')",
      "rationale": "Etymology, linguistic sound symbolism, and psychological resonance",
      "positioning": "How this specific name reinforces our category and competitive differentiator",
      "territory": "descriptive" | "metaphorical" | "abstract" | "action-oriented" | "community-oriented"
    }
  ]
}
Provide exactly 5 high-caliber name options.
`;

  return prompt;
};
