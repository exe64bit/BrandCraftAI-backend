export const buildLaunchPrompt = ({
  selectedName,
  originalIdea,
  discovery,
  positioning,
  personality,
  visualDirection,
  previousResult = null,
}) => {
  const brandName = selectedName || 'Brand';

  let prompt = `
You are an award-winning Creative Director and Launch Copywriter (behind legendary SaaS and consumer launches).
Write the definitive go-to-market Launch Kit for "${brandName}" built on its finalized brand identity.

Finalized Brand Foundation:
- Brand Name: "${brandName}"
- Category: ${positioning?.category || 'N/A'}
- Target Audience: ${discovery?.targetAudience || 'N/A'}
- Primary Problem: ${discovery?.problem || 'N/A'}
- Core Value Proposition: ${positioning?.valueProposition || 'N/A'}
- Positioning Statement: ${positioning?.positioningStatement || 'N/A'}
- Brand Personality: ${(personality?.traits || []).map((t) => (typeof t === 'string' ? t : t.trait)).join(', ')}
- Voice Principles: ${(personality?.principles || []).join('; ')}
`;

  if (previousResult) {
    prompt += `
Prior Launch Copy Attempt:
${JSON.stringify(previousResult, null, 2)}
Please provide a bold, fresh angle with high conversion punch and distinctive phrasing.
`;
  }

  prompt += `
Return a JSON object strictly matching this schema:
{
  "headline": "Magnetic, punchy 5 to 8 word landing page hero headline that stops visitors in their tracks",
  "subheadline": "Crisp 15-20 word supporting subheadline clarifying exactly who this is for and the immediate payoff",
  "cta": "Action-oriented 2 to 4 word button text that triggers curiosity or ambition",
  "oneLinePitch": "A memorable, elevator-ready one-line sentence summarizing the brand",
  "landingPageCopy": {
    "heroDescription": "Compelling 2-sentence value description for the hero section",
    "featuresSummary": [
      "Feature 1: User-centric benefit hook",
      "Feature 2: Workflow superpower hook",
      "Feature 3: Transformative outcome hook"
    ],
    "socialProofHook": "Fascinating social proof or rallying call angle to build initial trust"
  },
  "socialPost": "High-engagement announcement post for LinkedIn and X (Twitter) with compelling hook, body, and call-to-action",
  "launchMessage": "Inspiring founder's letter / community launch memo explaining why we built this and what it means for users",
  "brandVoiceExamples": [
    "Example 1: How we say 'Sign Up / Welcome' in our unique brand voice",
    "Example 2: How we deliver a microcopy error or setback in our brand voice",
    "Example 3: How we celebrate a user milestone or win in our brand voice"
  ]
}
`;

  return prompt;
};
