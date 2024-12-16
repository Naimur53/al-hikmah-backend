import express from 'express';
        import validateRequest from '../../middlewares/validateRequest';
        import { BookController } from './book.controller';
        import { BookValidation } from './book.validation';
        const router = express.Router();
        
        router.get('/', BookController.getAllBook);
        router.get('/:id', BookController.getSingleBook);
        
        router.post(
          '/',
          validateRequest(BookValidation.createValidation),
          BookController.createBook
        );
        
        router.patch(
          '/:id',
          validateRequest(BookValidation.updateValidation),
          BookController.updateBook
        );
        router.delete('/:id', BookController.deleteBook);
        
        export const BookRoutes = router;