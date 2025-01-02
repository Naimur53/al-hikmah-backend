import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { NewsLetterController } from './newsLetter.controller';
import { NewsLetterValidation } from './newsLetter.validation';
const router = express.Router();

router.get('/', NewsLetterController.getAllNewsLetter);
router.get('/:id', NewsLetterController.getSingleNewsLetter);

router.post(
  '/',
  validateRequest(NewsLetterValidation.createValidation),
  NewsLetterController.createNewsLetter,
);

router.patch(
  '/:id',
  validateRequest(NewsLetterValidation.updateValidation),
  NewsLetterController.updateNewsLetter,
);
router.delete('/:id', NewsLetterController.deleteNewsLetter);

export const NewsLetterRoutes = router;
