import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { BookPageController } from './bookPage.controller';
import { BookPageValidation } from './bookPage.validation';
const router = express.Router();

router.get('/', BookPageController.getAllBookPage);
router.get('/:id', BookPageController.getSingleBookPage);

router.post(
  '/',
  validateRequest(BookPageValidation.createValidation),
  BookPageController.createBookPage,
);
router.post(
  '/bulk',
  validateRequest(BookPageValidation.bulkCreateValidation),
  BookPageController.bulkCreateBookPage,
);

router.patch(
  '/:id',
  validateRequest(BookPageValidation.updateValidation),
  BookPageController.updateBookPage,
);
router.delete(
  '/bulk',
  validateRequest(BookPageValidation.bulkDeleteValidation),
  BookPageController.bulkDeleteBookPage,
);
router.delete('/:id', BookPageController.deleteBookPage);

export const BookPageRoutes = router;
