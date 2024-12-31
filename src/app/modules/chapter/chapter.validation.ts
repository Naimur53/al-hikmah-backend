import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    description: z
      .string({ required_error: 'Description is required' })
      .optional(),
    bookId: z.string({ required_error: 'BookId is required' }),
    chapterNo: z.number({ required_error: 'ChapterNo is required' }),
  }),
});
const updateValidation = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }).optional(),
    description: z
      .string({ required_error: 'Description is required' })
      .optional(),
    bookId: z.string({ required_error: 'BookId is required' }).optional(),
    chapterNo: z.number({ required_error: 'ChapterNo is required' }).optional(),
  }),
});
export const ChapterValidation = {
  createValidation,
  updateValidation,
};
