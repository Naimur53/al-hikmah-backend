import { EUserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { WishlistController } from './wishlist.controller';
import { WishlistValidation } from './wishlist.validation';
const router = express.Router();

router.get('/', WishlistController.getAllWishlist);
router.get('/:id', WishlistController.getSingleWishlist);

router.post(
  '/',
  auth(EUserRole.ADMIN, EUserRole.SUPER_ADMIN, EUserRole.USER),
  validateRequest(WishlistValidation.createValidation),
  WishlistController.createWishlist,
);

router.patch(
  '/:id',
  auth(EUserRole.ADMIN, EUserRole.SUPER_ADMIN, EUserRole.USER),
  validateRequest(WishlistValidation.updateValidation),
  WishlistController.updateWishlist,
);
router.delete(
  '/:id',
  auth(EUserRole.ADMIN, EUserRole.SUPER_ADMIN),
  WishlistController.deleteWishlist,
);

export const WishlistRoutes = router;
