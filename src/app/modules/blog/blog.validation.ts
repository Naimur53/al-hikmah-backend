import { EBlogStatus } from '@prisma/client';
import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required ' }),
    description: z.string({ required_error: 'Description is required ' }),
    thumbnail: z.string({ required_error: 'Thumbnail is required ' }),
    content: z.string({ required_error: 'Content is required ' }),
    status: z
      .enum([...Object.keys(EBlogStatus)] as [string, ...string[]])
      .default(EBlogStatus.pending)
      .optional(),
  }),
});
const updateValidation = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required ' }).optional(),
    description: z
      .string({ required_error: 'Description is required ' })
      .optional(),
    thumbnail: z
      .string({ required_error: 'Thumbnail is required ' })
      .optional(),
    content: z.string({ required_error: 'Content is required ' }).optional(),
    status: z
      .enum([...Object.keys(EBlogStatus)] as [string, ...string[]])
      .default(EBlogStatus.pending)
      .optional(),
  }),
});
export const BlogValidation = {
  createValidation,
  updateValidation,
};
