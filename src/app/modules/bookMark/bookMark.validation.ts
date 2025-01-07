import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    bookId: z.string({ required_error: 'Book id is required' }),
  }),
});
const updateValidation = z.object({
  body: z.object({
    bookId: z.string({ required_error: 'Book id is required' }).optional(),
  }),
});
export const BookMarkValidation = {
  createValidation,
  updateValidation,
};
