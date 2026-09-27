import BrandProject from '../models/BrandProject.js';
import { runDiscoveryStage } from '../ai/discovery.js';
import { runPositioningStage } from '../ai/positioning.js';
import { runPersonalityStage } from '../ai/personality.js';
import { runNamingStage } from '../ai/naming.js';
import { runCritiqueStage } from '../ai/critic.js';
import { runVisualStage } from '../ai/visual.js';
import { runConsistencyStage } from '../ai/consistency.js';
import { runLaunchStage } from '../ai/launch.js';
import { generatePollinationsImage } from '../services/pollinations.js';
import { uploadToImageKit } from '../services/imagekit.js';
import { calculateProjectProgress } from '../ai/orchestrator.js';

// Helper to fetch and verify project ownership
const getOwnedProject = async (projectId, userId) => {
  const project = await BrandProject.findById(projectId);
  if (!project) {
    const error = new Error('Brand project not found');
    error.status = 404;
    throw error;
  }
  if (project.userId.toString() !== userId.toString()) {
    const error = new Error('Not authorized to access or modify this project');
    error.status = 403;
    throw error;
  }
  return project;
};

/**
 * 1. Discovery Stage
 * POST /api/projects/:id/discovery
 */
export const handleDiscovery = async (req, res, next) => {
  try {
    const project = await getOwnedProject(req.params.id, req.user._id);
    const { userNotes = '', regenerate = false } = req.body;

    const previousResult = regenerate && project.discovery?.problem ? project.discovery : null;

    const discoveryData = await runDiscoveryStage({
      originalIdea: project.originalIdea,
      userNotes: userNotes || project.discovery?.userNotes || '',
      previousResult,
    });

    project.discovery = discoveryData;
    if (project.currentStage === 'discovery') {
      project.currentStage = 'positioning';
    }
    await project.save();

    res.json({
      success: true,
      stage: 'discovery',
      discovery: project.discovery,
      currentStage: project.currentStage,
      progress: calculateProjectProgress(project),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 2. Positioning Stage
 * POST /api/projects/:id/positioning
 */
export const handlePositioning = async (req, res, next) => {
  try {
    const project = await getOwnedProject(req.params.id, req.user._id);
    const { regenerate = false } = req.body;

    const previousResult = regenerate && project.positioning?.category ? project.positioning : null;

    const positioningData = await runPositioningStage({
      originalIdea: project.originalIdea,
      discovery: project.discovery,
      previousResult,
    });

    project.positioning = positioningData;
    if (['discovery', 'positioning'].includes(project.currentStage)) {
      project.currentStage = 'personality';
    }
    await project.save();

    res.json({
      success: true,
      stage: 'positioning',
      positioning: project.positioning,
      currentStage: project.currentStage,
      progress: calculateProjectProgress(project),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 3. Personality Stage
 * POST /api/projects/:id/personality
 */
export const handlePersonality = async (req, res, next) => {
  try {
    const project = await getOwnedProject(req.params.id, req.user._id);
    const { regenerate = false } = req.body;

    const previousResult = regenerate && project.personality?.traits?.length ? project.personality : null;

    const personalityData = await runPersonalityStage({
      originalIdea: project.originalIdea,
      discovery: project.discovery,
      positioning: project.positioning,
      previousResult,
    });

    project.personality = personalityData;
    if (['discovery', 'positioning', 'personality'].includes(project.currentStage)) {
      project.currentStage = 'naming';
    }
    await project.save();

    res.json({
      success: true,
      stage: 'personality',
      personality: project.personality,
      currentStage: project.currentStage,
      progress: calculateProjectProgress(project),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 4. Naming Stage
 * POST /api/projects/:id/naming
 */
export const handleNaming = async (req, res, next) => {
  try {
    const project = await getOwnedProject(req.params.id, req.user._id);
    const { regenerate = false } = req.body;

    const existingOptions = project.naming?.options || [];

    const namingData = await runNamingStage({
      originalIdea: project.originalIdea,
      discovery: project.discovery,
      positioning: project.positioning,
      personality: project.personality,
      existingOptions,
      isRegenerate: regenerate,
    });

    project.naming.options = namingData.options;
    if (namingData.selectedName) {
      project.naming.selectedName = namingData.selectedName;
    }
    if (['discovery', 'positioning', 'personality', 'naming'].includes(project.currentStage)) {
      project.currentStage = 'critique';
    }
    await project.save();

    res.json({
      success: true,
      stage: 'naming',
      naming: project.naming,
      currentStage: project.currentStage,
      progress: calculateProjectProgress(project),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 5. Critique Stage
 * POST /api/projects/:id/critique
 */
export const handleCritique = async (req, res, next) => {
  try {
    const project = await getOwnedProject(req.params.id, req.user._id);

    const critiqueData = await runCritiqueStage({
      originalIdea: project.originalIdea,
      discovery: project.discovery,
      positioning: project.positioning,
      personality: project.personality,
      selectedName: project.naming?.selectedName || (project.naming?.options?.find((o) => o.selected)?.name) || '',
      namingOptions: project.naming?.options || [],
    });

    project.critique = critiqueData;
    if (['discovery', 'positioning', 'personality', 'naming', 'critique'].includes(project.currentStage)) {
      project.currentStage = 'visual';
    }
    await project.save();

    res.json({
      success: true,
      stage: 'critique',
      critique: project.critique,
      currentStage: project.currentStage,
      progress: calculateProjectProgress(project),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 6. Visual Direction Stage
 * POST /api/projects/:id/visual
 */
export const handleVisual = async (req, res, next) => {
  try {
    const project = await getOwnedProject(req.params.id, req.user._id);
    const { regenerate = false } = req.body;

    const previousResult = regenerate && project.visualDirection?.mood ? project.visualDirection : null;

    const visualData = await runVisualStage({
      originalIdea: project.originalIdea,
      discovery: project.discovery,
      positioning: project.positioning,
      personality: project.personality,
      selectedName: project.naming?.selectedName || (project.naming?.options?.find((o) => o.selected)?.name) || '',
      critique: project.critique,
      previousResult,
    });

    project.visualDirection = visualData;
    if (['discovery', 'positioning', 'personality', 'naming', 'critique', 'visual'].includes(project.currentStage)) {
      project.currentStage = 'images';
    }
    await project.save();

    res.json({
      success: true,
      stage: 'visual',
      visualDirection: project.visualDirection,
      currentStage: project.currentStage,
      progress: calculateProjectProgress(project),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 7. Image Generation (Pollinations AI + ImageKit)
 * POST /api/projects/:id/generate-image
 * body: { type: "logo"|"moodboard"|"brand-visual"|"social-visual", promptOverride }
 */
export const handleGenerateImage = async (req, res, next) => {
  try {
    const project = await getOwnedProject(req.params.id, req.user._id);
    const { type, promptOverride } = req.body;

    const validTypes = ['logo', 'moodboard', 'brand-visual', 'social-visual'];
    if (!type || !validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid visual type. Must be one of: ${validTypes.join(', ')}`,
      });
    }

    const brandName = project.naming?.selectedName || (project.naming?.options?.find((o) => o.selected)?.name) || 'Brand';
    const category = project.positioning?.category || 'Tech Innovation';
    const colors = project.visualDirection?.colors || { primary: '#3B82F6', secondary: '#10B981', accent: '#F59E0B' };
    const mood = project.visualDirection?.mood || 'Modern, vibrant, professional';
    const shapes = (project.visualDirection?.shapes || []).join(', ') || 'Interlocking geometric lines';
    const avoid = (project.visualDirection?.avoid || []).join(', ') || 'Clutter, cartoonish, low resolution';

    // Construct a controlled brand-aligned prompt
    let prompt = promptOverride;
    if (!prompt) {
      switch (type) {
        case 'logo':
          prompt = `Minimalist modern vector logo icon mark for "${brandName}", representing ${category}. Clean geometric vector design, ${shapes}, primary color ${colors.primary} with subtle ${colors.secondary} accent on clean minimalist background. Professional brand identity mark, Paul Rand aesthetic, ultra-sharp vector lines, no messy text or clutter. Avoid: ${avoid}.`;
          break;
        case 'moodboard':
          prompt = `Aesthetic brand moodboard presentation for "${brandName}". Harmonic color palette (${colors.primary}, ${colors.secondary}, ${colors.accent}), tactile materials, modern architecture, abstract fluid geometric textures, editorial design layout, studio lighting, Pentagram agency presentation standard. Avoid: ${avoid}.`;
          break;
        case 'brand-visual':
          prompt = `Inspiring cinematic brand hero visual for "${brandName}". Ambitious collegiate collaborators co-creating in a modern glass workshop studio, energetic teamwork, natural golden hour lighting with subtle ${colors.primary} ambient glow, editorial 8k resolution, authentic expression. Avoid: ${avoid}.`;
          break;
        case 'social-visual':
          prompt = `Dynamic high-engagement social media launch graphic for "${brandName}". Bold modern typography poster layout, clean geometric gradient shapes in ${colors.primary} and ${colors.accent}, sleek high-contrast aesthetic, vibrant and forward-looking. Avoid: ${avoid}.`;
          break;
      }
    }

    console.log(`[Image Controller] Initiating generation for type: ${type}`);

    // 1. Fetch from Pollinations AI
    const { buffer, directUrl } = await generatePollinationsImage(prompt, {
      width: 1024,
      height: 1024,
      model: 'openai/gpt-image-1.5',
      nologo: true,
    });

    // 2. Upload to ImageKit (or fallback safely)
    const fileName = `${type}-${Date.now()}.jpg`;
    const folderPath = `brand-ai/projects/${project._id}/${type}`;
    const uploadResult = await uploadToImageKit(buffer, fileName, folderPath, directUrl);

    // 3. Save to MongoDB project
    const newVisual = {
      type,
      prompt,
      imageUrl: uploadResult.imageUrl,
      fileId: uploadResult.fileId,
      createdAt: new Date(),
    };

    project.generatedVisuals.push(newVisual);
    if (project.currentStage === 'images') {
      project.currentStage = 'consistency';
    }
    await project.save();

    res.json({
      success: true,
      visual: newVisual,
      generatedVisuals: project.generatedVisuals,
      currentStage: project.currentStage,
      progress: calculateProjectProgress(project),
    });
  } catch (error) {
    console.error('[Generate Image Error]:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Image generation failed. Please try again.',
    });
  }
};

/**
 * 8. Consistency Check Stage
 * POST /api/projects/:id/consistency
 */
export const handleConsistency = async (req, res, next) => {
  try {
    const project = await getOwnedProject(req.params.id, req.user._id);

    const consistencyData = await runConsistencyStage({
      selectedName: project.naming?.selectedName || (project.naming?.options?.find((o) => o.selected)?.name) || '',
      originalIdea: project.originalIdea,
      positioning: project.positioning,
      personality: project.personality,
      visualDirection: project.visualDirection,
      launchKit: project.launchKit,
    });

    project.consistency = consistencyData;
    if (['discovery', 'positioning', 'personality', 'naming', 'critique', 'visual', 'images', 'consistency'].includes(project.currentStage)) {
      project.currentStage = 'launch';
    }
    await project.save();

    res.json({
      success: true,
      stage: 'consistency',
      consistency: project.consistency,
      currentStage: project.currentStage,
      progress: calculateProjectProgress(project),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 9. Launch Kit Stage
 * POST /api/projects/:id/launch
 */
export const handleLaunch = async (req, res, next) => {
  try {
    const project = await getOwnedProject(req.params.id, req.user._id);
    const { regenerate = false } = req.body;

    const previousResult = regenerate && project.launchKit?.headline ? project.launchKit : null;

    const launchData = await runLaunchStage({
      selectedName: project.naming?.selectedName || (project.naming?.options?.find((o) => o.selected)?.name) || '',
      originalIdea: project.originalIdea,
      discovery: project.discovery,
      positioning: project.positioning,
      personality: project.personality,
      visualDirection: project.visualDirection,
      previousResult,
    });

    project.launchKit = launchData;
    project.currentStage = 'brand-kit';
    project.status = 'completed';
    await project.save();

    res.json({
      success: true,
      stage: 'launch',
      launchKit: project.launchKit,
      currentStage: project.currentStage,
      progress: calculateProjectProgress(project),
    });
  } catch (error) {
    next(error);
  }
};
