import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    page: z.number({ required_error: 'Page is required' }).min(1),
    content: z.string({ required_error: 'Content is required' }),
    bookId: z.string({ required_error: 'BookId is required' }),
    chapterId: z.string({ required_error: 'ChapterId is required' }).optional(),
    subChapterId: z
      .string({ required_error: 'SubChapterId is required' })
      .optional(),
  }),
});
const updateValidation = z.object({
  body: z.object({
    page: z.number({ required_error: 'Page is required' }).optional(),
    content: z.string({ required_error: 'Content is required' }).optional(),
    bookId: z.string({ required_error: 'BookId is required' }).optional(),
    chapterId: z.string({ required_error: 'ChapterId is required' }).optional(),
    subChapterId: z
      .string({ required_error: 'SubChapterId is required' })
      .optional(),
  }),
});
const bulkCreateValidation = z.object({
  body: z.array(
    z.object({
      page: z.number({ required_error: 'Page is required' }).min(1),
      content: z.string({ required_error: 'Content is required' }),
      bookId: z.string({ required_error: 'BookId is required' }),
      chapterId: z
        .string({ required_error: 'ChapterId is required' })
        .optional(),
      subChapterId: z
        .string({ required_error: 'SubChapterId is required' })
        .optional(),
    }),
  ),
});
const bulkDeleteValidation = z.object({
  body: z.array(
    z.string({
      required_error: 'BookPageId is required',
    }),
  ),
});

export const BookPageValidation = {
  createValidation,
  updateValidation,
  bulkCreateValidation,
  bulkDeleteValidation,
};
