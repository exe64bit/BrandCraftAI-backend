export const buildCritiquePrompt = ({
  originalIdea,
  discovery,
  positioning,
  personality,
  selectedName,
  namingOptions = [],
}) => {
  const chosenName = selectedName || (namingOptions.find((n) => n.selected)?.name) || namingOptions[0]?.name || 'Unassigned Name';

  const prompt = `
You are a merciless, senior Brand Director and Venture Partner who tears apart mediocre brand decks.
Review the brand identity components developed so far and run a rigorous stress-test. Be intellectually honest, provocative, and actionable.

Brand Under Review:
- Original Idea: ${originalIdea}
- Selected Brand Name: "${chosenName}"
- Category: ${positioning?.category || 'N/A'}
- Differentiator: ${positioning?.differentiator || 'N/A'}
- Positioning Statement: ${positioning?.positioningStatement || 'N/A'}
- Target Audience: ${discovery?.targetAudience || 'N/A'}
- Problem: ${discovery?.problem || 'N/A'}
- Personality Traits: ${(personality?.traits || []).map((t) => (typeof t === 'string' ? t : `${t.trait} (${t.reason})`)).join('; ')}
- Avoid Traits: ${(personality?.avoidTraits || []).join(', ')}

Identify the blind spots, cliches, lazy assumptions, and risks before the brand launches to customers.

Return a JSON object strictly matching this schema:
{
  "genericPatterns": [
    "2 to 3 cliches, buzzwords, or generic startup tropes present in the current positioning or messaging"
  ],
  "weakAssumptions": [
    "2 to 3 fragile user behaviors or market dynamics being taken for granted without empirical proof"
  ],
  "contradictions": [
    "1 to 2 subtle friction points or tensions between the personality traits, naming, and target audience needs"
  ],
  "audienceMismatch": [
    "1 to 2 ways the current brand posture could alienate or fail to convince key segments of the audience"
  ],
  "namingConcerns": [
    "Critique of '${chosenName}': potential pronunciation traps, search collisions, negative connotations, or limiters to future expansion"
  ],
  "alternatives": [
    "3 concrete strategic pivots, sharper counter-angles, or bold suggestions to strengthen the brand right now"
  ]
}
`;

  return prompt;
};
