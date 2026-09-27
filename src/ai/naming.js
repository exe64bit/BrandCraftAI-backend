import { callGeminiJSON } from './gemini.js';
import { buildNamingPrompt } from '../prompts/naming.js';

export const runNamingStage = async ({
  originalIdea,
  discovery,
  positioning,
  personality,
  existingOptions = [],
  isRegenerate = false,
}) => {
  const prompt = buildNamingPrompt({
    originalIdea,
    discovery,
    positioning,
    personality,
    existingNames: existingOptions,
    isRegenerate,
  });

  const systemInstruction = 'You are a master brand namer. Return exactly 5 inventive, trademarkable, high-resonance brand name concepts with territory, rationale, and positioning fit.';

  const result = await callGeminiJSON({ prompt, systemInstruction });

  const validTerritories = ['descriptive', 'metaphorical', 'abstract', 'action-oriented', 'community-oriented'];

  let newOptions = [];
  if (Array.isArray(result.options)) {
    newOptions = result.options.map((opt, idx) => ({
      name: opt.name?.trim() || `BrandConcept ${idx + 1}`,
      rationale: opt.rationale || 'Evocative phrasing designed to inspire trust and dynamic momentum.',
      positioning: opt.positioning || 'Reinforces market leadership and clear differentiation.',
      territory: validTerritories.includes(opt.territory) ? opt.territory : 'metaphorical',
      selected: false,
      isNewlyAdded: isRegenerate,
    }));
  }

  if (newOptions.length === 0) {
    newOptions = [
      { name: 'TeamUp', rationale: 'Direct and energetic, signaling active collaboration.', positioning: 'Instantly identifies student team-building focus.', territory: 'action-oriented', selected: false, isNewlyAdded: isRegenerate },
      { name: 'Cohort', rationale: 'Evokes academic kinship and mutual growth.', positioning: 'Frames project teams as enduring collegiate units.', territory: 'community-oriented', selected: false, isNewlyAdded: isRegenerate },
      { name: 'NexusLab', rationale: 'A central connection hub for innovative projects.', positioning: 'Signals high-tech coordination and competence.', territory: 'metaphorical', selected: false, isNewlyAdded: isRegenerate },
    ];
  }

  // If this is a regeneration, preserve old options (marked isNewlyAdded: false) and append new ones (marked isNewlyAdded: true)
  if (isRegenerate && existingOptions.length > 0) {
    const preservedOld = existingOptions.map((opt) => ({
      name: opt.name,
      rationale: opt.rationale,
      positioning: opt.positioning,
      territory: opt.territory,
      selected: Boolean(opt.selected),
      isNewlyAdded: false,
    }));
    // If an option was already selected, keep its selected status
    const previouslySelected = preservedOld.find((o) => o.selected);

    return {
      options: [...preservedOld, ...newOptions],
      selectedName: previouslySelected ? previouslySelected.name : '',
    };
  }

  // By default, select the first option if none is selected
  newOptions[0].selected = true;

  return {
    options: newOptions,
    selectedName: newOptions[0].name,
  };
};
