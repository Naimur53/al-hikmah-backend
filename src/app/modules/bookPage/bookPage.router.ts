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
            BookPageController.createBookPage
          );
          
          router.patch(
            '/:id',
            validateRequest(BookPageValidation.updateValidation),
            BookPageController.updateBookPage
          );
          router.delete('/:id', BookPageController.deleteBookPage);
          
          export const BookPageRoutes = router;