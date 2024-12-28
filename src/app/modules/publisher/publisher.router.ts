import { EUserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { PublisherController } from './publisher.controller';
import { PublisherValidation } from './publisher.validation';
const router = express.Router();

router.get('/', PublisherController.getAllPublisher);
router.get('/:id', PublisherController.getSinglePublisher);

router.post(
  '/',
  auth(EUserRole.SUPER_ADMIN, EUserRole.ADMIN),
  validateRequest(PublisherValidation.createValidation),
  PublisherController.createPublisher,
);

router.patch(
  '/:id',
  auth(EUserRole.SUPER_ADMIN, EUserRole.ADMIN),
  validateRequest(PublisherValidation.updateValidation),
  PublisherController.updatePublisher,
);
router.delete(
  '/:id',
  auth(EUserRole.SUPER_ADMIN, EUserRole.ADMIN),
  PublisherController.deletePublisher,
);

export const PublisherRoutes = router;
