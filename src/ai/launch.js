import { callGeminiJSON } from './gemini.js';
import { buildLaunchPrompt } from '../prompts/launch.js';

export const runLaunchStage = async ({
  selectedName,
  originalIdea,
  discovery,
  positioning,
  personality,
  visualDirection,
  previousResult = null,
}) => {
  const prompt = buildLaunchPrompt({
    selectedName,
    originalIdea,
    discovery,
    positioning,
    personality,
    visualDirection,
    previousResult,
  });

  const systemInstruction = 'You are a master launch copywriter. Craft an electric, high-converting launch kit with headline, elevator pitch, landing page copy, social announcements, and brand voice guidelines.';

  const result = await callGeminiJSON({ prompt, systemInstruction });

  const landingPageCopy = result.landingPageCopy || {};

  return {
    headline: result.headline || `Find Your Dream Project Teammates — In Minutes`,
    subheadline: result.subheadline || 'Match with ambitious students across campus who share your work ethic, complimentary skills, and project vision.',
    cta: result.cta || 'Find Teammates',
    oneLinePitch: result.oneLinePitch || 'The intelligent matching hub connecting ambitious collegiate builders for world-changing student projects.',
    landingPageCopy: {
      heroDescription: landingPageCopy.heroDescription || 'Stop settling for randomized group partners. Filter by skills, working styles, and verified project ambition.',
      featuresSummary: Array.isArray(landingPageCopy.featuresSummary) && landingPageCopy.featuresSummary.length
        ? landingPageCopy.featuresSummary
        : [
            'Smart Skill Complementarity: Never end up with 4 frontend devs and no designer.',
            'Working Style Compatibility: Align on schedules, pace, and ambition before day one.',
            'Verified Portfolio Badges: Proof of work vetted by past project peers.',
          ],
      socialProofHook: landingPageCopy.socialProofHook || 'Joined by 2,400+ students from 50+ top universities building award-winning capstone and hackathon projects.',
    },
    socialPost: result.socialPost || `Building college projects shouldn't feel like partner roulette.\n\nWe built ${selectedName || 'TeamUp'} to help students match with teammates who actually pull their weight, complement their skills, and share their ambition.\n\nLive now — find your squad: [link] 🚀`,
    launchMessage: result.launchMessage || `Every great company, open-source tool, and breakthrough capstone started in a college dorm with the right group of friends. But finding those friends shouldn't be left to luck. That is why we built ${selectedName || 'this platform'}.`,
    brandVoiceExamples: Array.isArray(result.brandVoiceExamples) && result.brandVoiceExamples.length
      ? result.brandVoiceExamples
      : [
          'Welcome screen: "Welcome to the workshop. Let’s find the people who turn your concept into reality."',
          'Empty state: "No matches in this filter yet. Broaden your skills mesh or spark a new squad search."',
          'Milestone win: "Project team assembled in 4 minutes flat. Time to ship."',
        ],
  };
};
