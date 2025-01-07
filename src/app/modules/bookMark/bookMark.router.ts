import { EUserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BookMarkController } from './bookMark.controller';
import { BookMarkValidation } from './bookMark.validation';
const router = express.Router();

router.get('/', BookMarkController.getAllBookMark);
router.get(
  '/single-user-book-mark',
  auth(EUserRole.ADMIN, EUserRole.SUPER_ADMIN, EUserRole.USER),
  BookMarkController.getSingleUserBookMark,
);
router.get('/:id', BookMarkController.getSingleBookMark);

router.post(
  '/',
  auth(EUserRole.ADMIN, EUserRole.SUPER_ADMIN, EUserRole.USER),
  validateRequest(BookMarkValidation.createValidation),
  BookMarkController.createBookMark,
);

router.patch(
  '/:id',
  auth(EUserRole.ADMIN, EUserRole.SUPER_ADMIN, EUserRole.USER),
  validateRequest(BookMarkValidation.updateValidation),
  BookMarkController.updateBookMark,
);
router.delete(
  '/:id',
  auth(EUserRole.ADMIN, EUserRole.SUPER_ADMIN, EUserRole.USER),
  BookMarkController.deleteBookMark,
);

export const BookMarkRoutes = router;
