import { EUserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AuthorController } from './author.controller';
import { AuthorValidation } from './author.validation';
const router = express.Router();

router.get('/', AuthorController.getAllAuthor);
router.get('/:id', AuthorController.getSingleAuthor);

router.post(
  '/',
  auth(EUserRole.ADMIN, EUserRole.SUPER_ADMIN),
  validateRequest(AuthorValidation.createValidation),
  AuthorController.createAuthor,
);

router.patch(
  '/:id',
  auth(EUserRole.ADMIN, EUserRole.SUPER_ADMIN),
  validateRequest(AuthorValidation.updateValidation),
  AuthorController.updateAuthor,
);
router.delete(
  '/:id',
  auth(EUserRole.ADMIN, EUserRole.SUPER_ADMIN),
  AuthorController.deleteAuthor,
);

export const AuthorRoutes = router;
