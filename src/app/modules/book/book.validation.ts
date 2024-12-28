import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    photo: z.string({ required_error: 'Photo is required' }),
    description: z.string({ required_error: 'Description is required' }),
    keywords: z.string({ required_error: 'Keywords is required' }),
    docLink: z.string({ required_error: 'DocLink is required' }).optional(),
    pdfLink: z.string({ required_error: 'PdfLink is required' }).optional(),
    categoryId: z.string({ required_error: 'CategoryId is required' }),
    authorId: z.string({ required_error: 'AuthorId is required' }),
    publisherId: z.string({ required_error: 'PublisherId is required' }),
    isActive: z
      .boolean({ required_error: 'IsActive is required' })
      .default(true),
  }),
});
const updateValidation = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).optional(),
    photo: z.string({ required_error: 'Photo is required' }).optional(),
    description: z
      .string({ required_error: 'Description is required' })
      .optional(),
    keywords: z.string({ required_error: 'Keywords is required' }).optional(),
    docLink: z.string({ required_error: 'DocLink is required' }).optional(),
    pdfLink: z.string({ required_error: 'PdfLink is required' }).optional(),
    categoryId: z
      .string({ required_error: 'CategoryId is required' })
      .optional(),
    authorId: z.string({ required_error: 'AuthorId is required' }).optional(),
    publisherId: z
      .string({ required_error: 'PublisherId is required' })
      .optional(),
    isActive: z
      .boolean({ required_error: 'IsActive is required' })
      .default(true),
  }),
});
export const BookValidation = {
  createValidation,
  updateValidation,
};
