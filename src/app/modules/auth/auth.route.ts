import { EUserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';
const router = express.Router();
router.post(
  '/signup',
  validateRequest(AuthValidation.createAuthZodSchema),
  AuthController.createUser,
);
router.post(
  '/signin',
  validateRequest(AuthValidation.loginZodSchema),
  AuthController.loginUser,
);
router.post(
  '/google-login',
  validateRequest(AuthValidation.googleLoginZodSchema),
  AuthController.googleLoginUser,
);
router.post(
  '/verify-otp-for-admin-login',
  validateRequest(AuthValidation.loginAdminZodSchema),
  AuthController.verifyOtpForAdminLogin,
);
router.post(
  '/admin-login',
  validateRequest(AuthValidation.loginZodSchema),
  AuthController.loginAdmin,
);
router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AuthController.refreshToken,
);
router.post(
  '/verify-signup-token',
  validateRequest(AuthValidation.verifyToken),
  auth(EUserRole.USER, EUserRole.SUPER_ADMIN),
  AuthController.verifySignupToken,
);
router.post(
  '/verify-forgot-token',
  validateRequest(AuthValidation.verifyForgotToken),
  AuthController.verifyForgotToken,
);
router.post(
  '/verify-delete-user-token-and-delete-user',
  validateRequest(AuthValidation.verifyForgotToken),
  AuthController.verifyDeleteUserToken,
);
router.post(
  '/change-password',
  validateRequest(AuthValidation.changePassword),
  AuthController.changePassword,
);
router.post('/resend-signup-email/:email', AuthController.resendEmail);
router.post('/send-forgot-email/:email', AuthController.sendForgotEmail);
router.post(
  '/send-delete-user-email/:email',
  AuthController.sendDeleteUserEmail,
);

export const AuthRoutes = router;
