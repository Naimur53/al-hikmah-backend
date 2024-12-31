import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ChapterController } from './chapter.controller';
import { ChapterValidation } from './chapter.validation';
const router = express.Router();

router.get('/', ChapterController.getAllChapter);
router.get('/:id', ChapterController.getSingleChapter);

router.post(
  '/',
  validateRequest(ChapterValidation.createValidation),
  ChapterController.createChapter,
);

router.patch(
  '/:id',
  validateRequest(ChapterValidation.updateValidation),
  ChapterController.updateChapter,
);
router.delete('/:id', ChapterController.deleteChapter);

export const ChapterRoutes = router;
