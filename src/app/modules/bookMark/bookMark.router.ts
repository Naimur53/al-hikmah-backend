import express from 'express';
          import validateRequest from '../../middlewares/validateRequest';
          import { BookMarkController } from './bookMark.controller';
          import { BookMarkValidation } from './bookMark.validation';
          const router = express.Router();
          
          router.get('/', BookMarkController.getAllBookMark);
          router.get('/:id', BookMarkController.getSingleBookMark);
          
          router.post(
            '/',
            validateRequest(BookMarkValidation.createValidation),
            BookMarkController.createBookMark
          );
          
          router.patch(
            '/:id',
            validateRequest(BookMarkValidation.updateValidation),
            BookMarkController.updateBookMark
          );
          router.delete('/:id', BookMarkController.deleteBookMark);
          
          export const BookMarkRoutes = router;