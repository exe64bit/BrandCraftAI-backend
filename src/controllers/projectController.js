import BrandProject from '../models/BrandProject.js';
import { calculateProjectProgress } from '../ai/orchestrator.js';

/**
 * @desc    Create a new brand project
 * @route   POST /api/projects
 * @access  Private
 */
export const createProject = async (req, res, next) => {
  try {
    const { projectName, originalIdea } = req.body;

    if (!projectName || !originalIdea) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both projectName and originalIdea.',
      });
    }

    const project = await BrandProject.create({
      userId: req.user._id,
      projectName: projectName.trim(),
      originalIdea: originalIdea.trim(),
      currentStage: 'discovery',
      status: 'in-progress',
    });

    const progress = calculateProjectProgress(project);

    res.status(201).json({
      success: true,
      project: {
        ...project.toObject(),
        progress,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all brand projects for current user
 * @route   GET /api/projects
 * @access  Private
 */
export const getProjects = async (req, res, next) => {
  try {
    const projects = await BrandProject.find({ userId: req.user._id }).sort({ updatedAt: -1 });

    const formattedProjects = projects.map((p) => {
      const obj = p.toObject();
      return {
        ...obj,
        progress: calculateProjectProgress(p),
      };
    });

    res.json({
      success: true,
      count: formattedProjects.length,
      projects: formattedProjects,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single brand project by ID
 * @route   GET /api/projects/:id
 * @access  Private
 */
export const getProjectById = async (req, res, next) => {
  try {
    const project = await BrandProject.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Brand project not found.',
      });
    }

    // Crucial security check: Verify ownership
    if (project.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this project.',
      });
    }

    const progress = calculateProjectProgress(project);

    res.json({
      success: true,
      project: {
        ...project.toObject(),
        progress,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update brand project (manual user edits or stage updates)
 * @route   PATCH /api/projects/:id
 * @access  Private
 */
export const updateProject = async (req, res, next) => {
  try {
    const project = await BrandProject.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Brand project not found.',
      });
    }

    // Crucial security check: Verify ownership
    if (project.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this project.',
      });
    }

    const allowedUpdates = [
      'projectName',
      'originalIdea',
      'currentStage',
      'status',
      'discovery',
      'positioning',
      'personality',
      'naming',
      'critique',
      'visualDirection',
      'consistency',
      'launchKit',
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    await project.save();

    const progress = calculateProjectProgress(project);

    res.json({
      success: true,
      message: 'Project updated successfully.',
      project: {
        ...project.toObject(),
        progress,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete brand project
 * @route   DELETE /api/projects/:id
 * @access  Private
 */
export const deleteProject = async (req, res, next) => {
  try {
    const project = await BrandProject.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Brand project not found.',
      });
    }

    // Crucial security check: Verify ownership
    if (project.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this project.',
      });
    }

    await project.deleteOne();

    res.json({
      success: true,
      message: 'Project deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
