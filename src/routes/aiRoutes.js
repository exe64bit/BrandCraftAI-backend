import express from 'express';
import {
  handleDiscovery,
  handlePositioning,
  handlePersonality,
  handleNaming,
  handleCritique,
  handleVisual,
  handleGenerateImage,
  handleConsistency,
  handleLaunch,
} from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All AI workflow stage routes require authentication
router.use(protect);

router.post('/:id/discovery', handleDiscovery);
router.post('/:id/positioning', handlePositioning);
router.post('/:id/personality', handlePersonality);
router.post('/:id/naming', handleNaming);
router.post('/:id/critique', handleCritique);
router.post('/:id/visual', handleVisual);
router.post('/:id/generate-image', handleGenerateImage);
router.post('/:id/consistency', handleConsistency);
router.post('/:id/launch', handleLaunch);

export default router;
