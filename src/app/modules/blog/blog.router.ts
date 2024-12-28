import { EUserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BlogController } from './blog.controller';
import { BlogValidation } from './blog.validation';
const router = express.Router();

router.get('/', BlogController.getAllBlog);
router.get(
  '/:id',
  auth(EUserRole.ADMIN, EUserRole.SUPER_ADMIN, EUserRole.USER),
  BlogController.getSingleBlog,
);

router.post(
  '/',
  auth(EUserRole.ADMIN, EUserRole.SUPER_ADMIN, EUserRole.USER),
  validateRequest(BlogValidation.createValidation),
  BlogController.createBlog,
);

router.patch(
  '/:id',
  auth(EUserRole.ADMIN, EUserRole.SUPER_ADMIN, EUserRole.USER),
  validateRequest(BlogValidation.updateValidation),
  BlogController.updateBlog,
);
router.delete(
  '/:id',
  auth(EUserRole.ADMIN, EUserRole.SUPER_ADMIN, EUserRole.USER),
  BlogController.deleteBlog,
);

export const BlogRoutes = router;
