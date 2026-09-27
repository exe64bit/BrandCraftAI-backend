/**
 * Brand AI Workflow Orchestrator
 *
 * Conceptual Workflow Pipeline:
 * [Discovery] -> [Positioning] -> [Personality] -> [Naming] -> [Critique]
 *    -> [Visual Direction] -> [Generated Visuals] -> [Consistency Check]
 *    -> [Launch Kit] -> [Final Brand Kit]
 *
 * NOTE: Each stage is executed as its own discrete, resumable HTTP request.
 * This guarantees zero timeout dropoffs, saves LLM token budget, and allows
 * users to inspect, edit, or regenerate every stage individually.
 */

export const STAGES = [
  'discovery',
  'positioning',
  'personality',
  'naming',
  'critique',
  'visual',
  'images',
  'consistency',
  'launch',
  'brand-kit',
];

/**
 * Checks if a specific stage has been completed on the project.
 */
export const isStageComplete = (stageName, project) => {
  if (!project) return false;

  switch (stageName) {
    case 'discovery':
      return Boolean(project.discovery && project.discovery.problem && project.discovery.targetAudience);
    case 'positioning':
      return Boolean(project.positioning && project.positioning.category && project.positioning.positioningStatement);
    case 'personality':
      return Boolean(project.personality && project.personality.traits && project.personality.traits.length > 0);
    case 'naming':
      return Boolean(
        project.naming &&
        project.naming.options &&
        project.naming.options.length > 0 &&
        (project.naming.selectedName || project.naming.options.some((o) => o.selected))
      );
    case 'critique':
      return Boolean(project.critique && project.critique.genericPatterns && project.critique.genericPatterns.length > 0);
    case 'visual':
      return Boolean(project.visualDirection && project.visualDirection.colors && project.visualDirection.mood);
    case 'images':
      return Boolean(project.generatedVisuals && project.generatedVisuals.length > 0);
    case 'consistency':
      return Boolean(project.consistency && project.consistency.score > 0);
    case 'launch':
      return Boolean(project.launchKit && project.launchKit.headline && project.launchKit.oneLinePitch);
    case 'brand-kit':
      // Ready if at least launch or consistency is reached
      return Boolean(project.launchKit && project.launchKit.headline);
    default:
      return false;
  }
};

/**
 * Computes the overall progress metrics for a brand project.
 */
export const calculateProjectProgress = (project) => {
  if (!project) {
    return { completedStagesCount: 0, totalStages: STAGES.length, percentage: 0, completedMap: {} };
  }

  const completedMap = {};
  let completedCount = 0;

  for (const stage of STAGES) {
    const complete = isStageComplete(stage, project);
    completedMap[stage] = complete;
    if (complete) {
      completedCount++;
    }
  }

  const percentage = Math.round((completedCount / STAGES.length) * 100);

  return {
    completedStagesCount: completedCount,
    totalStages: STAGES.length,
    percentage,
    completedMap,
    displayText: `${completedCount} / ${STAGES.length} stages completed`,
  };
};

/**
 * Determines the next logical stage in the progression.
 */
export const getNextStage = (currentStage) => {
  const index = STAGES.indexOf(currentStage);
  if (index === -1 || index >= STAGES.length - 1) {
    return 'brand-kit';
  }
  return STAGES[index + 1];
};
