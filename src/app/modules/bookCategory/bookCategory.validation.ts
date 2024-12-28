import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
  }),
});
const updateValidation = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).optional(),
  }),
});
export const BookCategoryValidation = {
  createValidation,
  updateValidation,
};
