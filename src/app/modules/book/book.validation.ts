import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    // name can not include "-" and at the end no space
    name: z
      .string({ required_error: 'Name is required' })
      .refine(val => !val.includes('-') && !val.endsWith(' '), {
        message: 'Name cannot contain a hyphen (-) and cannot end with a space',
      }),
    banglaName: z.string({ required_error: 'banglaName is required' }),
    photo: z.string({ required_error: 'Photo is required' }),
    description: z.string({ required_error: 'Description is required' }),
    keywords: z.string({ required_error: 'Keywords is required' }),
    docLink: z.string({ required_error: 'DocLink is required' }).optional(),
    pdfLink: z.string({ required_error: 'PdfLink is required' }).optional(),
    pdfViewLink: z
      .string({ required_error: 'PdfViewLink is required' })
      .optional(),
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
    name: z
      .string({ required_error: 'Name is required' })
      .refine(val => !val.includes('-'), {
        message: 'Name cannot contain a hyphen (-)',
      })
      .optional(),
    banglaName: z
      .string({ required_error: 'banglaName is required' })
      .optional(),
    pdfViewLink: z
      .string({ required_error: 'PdfViewLink is required' })
      .optional(),
    photo: z.string({ required_error: 'Photo is required' }).optional(),
    description: z
      .string({ required_error: 'Description is required' })
      .optional(),
    keywords: z.string({ required_error: 'Keywords is required' }).optional(),
    docLink: z
      .string({ required_error: 'DocLink is required' })
      .optional()
      .nullable(),
    pdfLink: z
      .string({ required_error: 'PdfLink is required' })
      .optional()
      .nullable(),
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
