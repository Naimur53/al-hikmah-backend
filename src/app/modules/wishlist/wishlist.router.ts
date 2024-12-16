import express from 'express';
        import validateRequest from '../../middlewares/validateRequest';
        import { WishlistController } from './wishlist.controller';
        import { WishlistValidation } from './wishlist.validation';
        const router = express.Router();
        
        router.get('/', WishlistController.getAllWishlist);
        router.get('/:id', WishlistController.getSingleWishlist);
        
        router.post(
          '/',
          validateRequest(WishlistValidation.createValidation),
          WishlistController.createWishlist
        );
        
        router.patch(
          '/:id',
          validateRequest(WishlistValidation.updateValidation),
          WishlistController.updateWishlist
        );
        router.delete('/:id', WishlistController.deleteWishlist);
        
        export const WishlistRoutes = router;