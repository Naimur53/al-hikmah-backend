import { EUserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
const router = express.Router();

router.get(
  '/',
  auth(EUserRole.ADMIN, EUserRole.SUPER_ADMIN),
  UserController.getAllUser,
);
router.get(
  '/admin/overview',
  auth(EUserRole.ADMIN, EUserRole.SUPER_ADMIN),
  UserController.getAdminOverview,
);
router.get(
  '/admin/chart-overview',
  auth(EUserRole.ADMIN, EUserRole.SUPER_ADMIN),
  UserController.getAdminChartInfo,
);
router.get(
  '/:id',
  auth(EUserRole.ADMIN, EUserRole.SUPER_ADMIN, EUserRole.USER),
  UserController.getSingleUser,
);

// router.post(
//   '/',
//   validateRequest(UserValidation.createValidation),
//   UserController.createUser,
// );
// router.post(
//   '/image-upload',
//   uploadMulter.single('image'),
//   uploadImage,
//   UserController.uploadSingleFile,
// );
router.patch(
  '/:id',
  auth(EUserRole.ADMIN, EUserRole.SUPER_ADMIN, EUserRole.USER),
  validateRequest(UserValidation.updateValidation),
  UserController.updateUser,
);
router.delete('/:id', auth(EUserRole.SUPER_ADMIN), UserController.deleteUser);

export const UserRoutes = router;
