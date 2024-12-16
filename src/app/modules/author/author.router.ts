import express from 'express';
        import validateRequest from '../../middlewares/validateRequest';
        import { AuthorController } from './author.controller';
        import { AuthorValidation } from './author.validation';
        const router = express.Router();
        
        router.get('/', AuthorController.getAllAuthor);
        router.get('/:id', AuthorController.getSingleAuthor);
        
        router.post(
          '/',
          validateRequest(AuthorValidation.createValidation),
          AuthorController.createAuthor
        );
        
        router.patch(
          '/:id',
          validateRequest(AuthorValidation.updateValidation),
          AuthorController.updateAuthor
        );
        router.delete('/:id', AuthorController.deleteAuthor);
        
        export const AuthorRoutes = router;