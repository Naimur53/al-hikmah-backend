import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }),
  }),
});
const updateValidation = z.object({
  body: z.object({}),
});
export const NewsLetterValidation = {
  createValidation,
  updateValidation,
};
