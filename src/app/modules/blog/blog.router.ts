import express from 'express';
        import validateRequest from '../../middlewares/validateRequest';
        import { BlogController } from './blog.controller';
        import { BlogValidation } from './blog.validation';
        const router = express.Router();
        
        router.get('/', BlogController.getAllBlog);
        router.get('/:id', BlogController.getSingleBlog);
        
        router.post(
          '/',
          validateRequest(BlogValidation.createValidation),
          BlogController.createBlog
        );
        
        router.patch(
          '/:id',
          validateRequest(BlogValidation.updateValidation),
          BlogController.updateBlog
        );
        router.delete('/:id', BlogController.deleteBlog);
        
        export const BlogRoutes = router;