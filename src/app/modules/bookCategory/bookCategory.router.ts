import { EUserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BookCategoryController } from './bookCategory.controller';
import { BookCategoryValidation } from './bookCategory.validation';
const router = express.Router();

router.get('/', BookCategoryController.getAllBookCategory);
router.get('/:id', BookCategoryController.getSingleBookCategory);

router.post(
  '/',
  auth(EUserRole.ADMIN, EUserRole.SUPER_ADMIN),
  validateRequest(BookCategoryValidation.createValidation),
  BookCategoryController.createBookCategory,
);

router.patch(
  '/:id',
  auth(EUserRole.ADMIN, EUserRole.SUPER_ADMIN),
  validateRequest(BookCategoryValidation.updateValidation),
  BookCategoryController.updateBookCategory,
);
router.delete(
  '/:id',
  auth(EUserRole.ADMIN, EUserRole.SUPER_ADMIN),
  BookCategoryController.deleteBookCategory,
);

export const BookCategoryRoutes = router;
