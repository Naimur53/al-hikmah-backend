import express from 'express';
        import validateRequest from '../../middlewares/validateRequest';
        import { SubChapterController } from './subChapter.controller';
        import { SubChapterValidation } from './subChapter.validation';
        const router = express.Router();
        
        router.get('/', SubChapterController.getAllSubChapter);
        router.get('/:id', SubChapterController.getSingleSubChapter);
        
        router.post(
          '/',
          validateRequest(SubChapterValidation.createValidation),
          SubChapterController.createSubChapter
        );
        
        router.patch(
          '/:id',
          validateRequest(SubChapterValidation.updateValidation),
          SubChapterController.updateSubChapter
        );
        router.delete('/:id', SubChapterController.deleteSubChapter);
        
        export const SubChapterRoutes = router;