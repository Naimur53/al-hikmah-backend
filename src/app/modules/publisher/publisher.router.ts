import express from 'express';
        import validateRequest from '../../middlewares/validateRequest';
        import { PublisherController } from './publisher.controller';
        import { PublisherValidation } from './publisher.validation';
        const router = express.Router();
        
        router.get('/', PublisherController.getAllPublisher);
        router.get('/:id', PublisherController.getSinglePublisher);
        
        router.post(
          '/',
          validateRequest(PublisherValidation.createValidation),
          PublisherController.createPublisher
        );
        
        router.patch(
          '/:id',
          validateRequest(PublisherValidation.updateValidation),
          PublisherController.updatePublisher
        );
        router.delete('/:id', PublisherController.deletePublisher);
        
        export const PublisherRoutes = router;