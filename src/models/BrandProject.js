import mongoose from 'mongoose';

const brandProjectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    projectName: {
      type: String,
      required: [true, 'Please provide a project name'],
      trim: true,
      maxlength: [120, 'Project name cannot exceed 120 characters'],
    },
    originalIdea: {
      type: String,
      required: [true, 'Please provide the original business/product idea'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['in-progress', 'completed', 'archived'],
      default: 'in-progress',
    },
    currentStage: {
      type: String,
      enum: [
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
      ],
      default: 'discovery',
    },

    // 1. Discovery
    discovery: {
      problem: { type: String, default: '' },
      targetAudience: { type: String, default: '' },
      context: { type: String, default: '' },
      goals: { type: [String], default: [] },
      constraints: { type: [String], default: [] },
      value: { type: String, default: '' },
      assumptions: { type: [String], default: [] },
      openQuestions: { type: [String], default: [] },
      userNotes: { type: String, default: '' },
    },

    // 2. Positioning
    positioning: {
      category: { type: String, default: '' },
      differentiator: { type: String, default: '' },
      valueProposition: { type: String, default: '' },
      competitiveAngle: { type: String, default: '' },
      positioningStatement: { type: String, default: '' },
    },

    // 3. Personality
    personality: {
      traits: [
        {
          trait: { type: String, required: true },
          reason: { type: String, required: true },
        },
      ],
      avoidTraits: { type: [String], default: [] },
      principles: { type: [String], default: [] },
    },

    // 4. Naming
    naming: {
      options: [
        {
          name: { type: String, required: true },
          rationale: { type: String, default: '' },
          positioning: { type: String, default: '' },
          territory: { type: String, default: 'metaphorical' },
          selected: { type: Boolean, default: false },
          isNewlyAdded: { type: Boolean, default: false },
        },
      ],
      selectedName: { type: String, default: '' },
    },

    // 5. Critique
    critique: {
      genericPatterns: { type: [String], default: [] },
      weakAssumptions: { type: [String], default: [] },
      contradictions: { type: [String], default: [] },
      audienceMismatch: { type: [String], default: [] },
      namingConcerns: { type: [String], default: [] },
      alternatives: { type: [String], default: [] },
    },

    // 6. Visual Direction
    visualDirection: {
      colors: {
        primary: { type: String, default: '#3B82F6' },
        secondary: { type: String, default: '#10B981' },
        accent: { type: String, default: '#F59E0B' },
        background: { type: String, default: '#F8FAFC' },
        text: { type: String, default: '#0F172A' },
        paletteRationale: { type: String, default: '' },
      },
      typography: {
        headingFont: { type: String, default: 'Space Grotesk' },
        bodyFont: { type: String, default: 'Inter' },
        styleGuide: { type: String, default: '' },
      },
      mood: { type: String, default: '' },
      shapes: { type: [String], default: [] },
      symbols: { type: [String], default: [] },
      imagery: {
        style: { type: String, default: '' },
        photography: { type: String, default: '' },
        composition: { type: String, default: '' },
        lighting: { type: String, default: '' },
      },
      logoDirection: { type: String, default: '' },
      avoid: { type: [String], default: [] },
    },

    // 7. Generated Visuals
    generatedVisuals: [
      {
        type: {
          type: String,
          enum: ['logo', 'moodboard', 'brand-visual', 'social-visual'],
          required: true,
        },
        prompt: { type: String, required: true },
        imageUrl: { type: String, required: true },
        fileId: { type: String, default: '' },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // 8. Consistency Check
    consistency: {
      score: { type: Number, default: 0 },
      scoreExplanation: {
        type: String,
        default: 'AI-generated internal coherence estimate based on positioning, personality, and visuals.',
      },
      issues: { type: [String], default: [] },
      recommendations: { type: [String], default: [] },
    },

    // 9. Launch Kit
    launchKit: {
      headline: { type: String, default: '' },
      subheadline: { type: String, default: '' },
      cta: { type: String, default: '' },
      oneLinePitch: { type: String, default: '' },
      landingPageCopy: {
        heroDescription: { type: String, default: '' },
        featuresSummary: { type: [String], default: [] },
        socialProofHook: { type: String, default: '' },
      },
      socialPost: { type: String, default: '' },
      launchMessage: { type: String, default: '' },
      brandVoiceExamples: { type: [String], default: [] },
    },
  },
  {
    timestamps: true,
  }
);

const BrandProject = mongoose.model('BrandProject', brandProjectSchema);
export default BrandProject;
