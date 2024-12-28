import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required ' }),
    photoUrl: z.string({ required_error: 'PhotoUrl is required ' }).optional(),
  }),
});
const updateValidation = z.object({
  body: z.object({}),
});
export const PublisherValidation = {
  createValidation,
  updateValidation,
};
