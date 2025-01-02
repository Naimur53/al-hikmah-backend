import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    chapterId: z.string({ required_error: 'ChapterId is required' }),
    title: z.string({ required_error: 'Name is required' }),
    description: z
      .string({ required_error: 'Description is required' })
      .optional(),
    subChapterNo: z.number({ required_error: 'SubChapterNo is required' }),
  }),
});
const updateValidation = z.object({
  body: z.object({
    chapterId: z.string({ required_error: 'ChapterId is required' }).optional(),
    title: z.string({ required_error: 'Name is required' }).optional(),
    description: z
      .string({ required_error: 'Description is required' })
      .optional(),
    subChapterNo: z.number({ required_error: 'SubChapterNo is required' }),
  }),
});
export const SubChapterValidation = {
  createValidation,
  updateValidation,
};
