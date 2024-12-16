import express from 'express';
        import validateRequest from '../../middlewares/validateRequest';
        import { BookCategoryController } from './bookCategory.controller';
        import { BookCategoryValidation } from './bookCategory.validation';
        const router = express.Router();
        
        router.get('/', BookCategoryController.getAllBookCategory);
        router.get('/:id', BookCategoryController.getSingleBookCategory);
        
        router.post(
          '/',
          validateRequest(BookCategoryValidation.createValidation),
          BookCategoryController.createBookCategory
        );
        
        router.patch(
          '/:id',
          validateRequest(BookCategoryValidation.updateValidation),
          BookCategoryController.updateBookCategory
        );
        router.delete('/:id', BookCategoryController.deleteBookCategory);
        
        export const BookCategoryRoutes = router;