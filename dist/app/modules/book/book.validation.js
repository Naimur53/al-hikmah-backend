"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookValidation = void 0;
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        // name can not include "-"
        name: zod_1.z
            .string({ required_error: 'Name is required' })
            .refine(val => !val.includes('-'), {
            message: 'Name cannot contain a hyphen (-)',
        }),
        banglaName: zod_1.z.string({ required_error: 'banglaName is required' }),
        photo: zod_1.z.string({ required_error: 'Photo is required' }),
        description: zod_1.z.string({ required_error: 'Description is required' }),
        keywords: zod_1.z.string({ required_error: 'Keywords is required' }),
        docLink: zod_1.z.string({ required_error: 'DocLink is required' }).optional(),
        pdfLink: zod_1.z.string({ required_error: 'PdfLink is required' }).optional(),
        pdfViewLink: zod_1.z
            .string({ required_error: 'PdfViewLink is required' })
            .optional(),
        categoryId: zod_1.z.string({ required_error: 'CategoryId is required' }),
        authorId: zod_1.z.string({ required_error: 'AuthorId is required' }),
        publisherId: zod_1.z.string({ required_error: 'PublisherId is required' }),
        isActive: zod_1.z
            .boolean({ required_error: 'IsActive is required' })
            .default(true),
    }),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({ required_error: 'Name is required' })
            .refine(val => !val.includes('-'), {
            message: 'Name cannot contain a hyphen (-)',
        }),
        banglaName: zod_1.z
            .string({ required_error: 'banglaName is required' })
            .optional(),
        pdfViewLink: zod_1.z
            .string({ required_error: 'PdfViewLink is required' })
            .optional(),
        photo: zod_1.z.string({ required_error: 'Photo is required' }).optional(),
        description: zod_1.z
            .string({ required_error: 'Description is required' })
            .optional(),
        keywords: zod_1.z.string({ required_error: 'Keywords is required' }).optional(),
        docLink: zod_1.z.string({ required_error: 'DocLink is required' }).optional(),
        pdfLink: zod_1.z.string({ required_error: 'PdfLink is required' }).optional(),
        categoryId: zod_1.z
            .string({ required_error: 'CategoryId is required' })
            .optional(),
        authorId: zod_1.z.string({ required_error: 'AuthorId is required' }).optional(),
        publisherId: zod_1.z
            .string({ required_error: 'PublisherId is required' })
            .optional(),
        isActive: zod_1.z
            .boolean({ required_error: 'IsActive is required' })
            .default(true),
    }),
});
exports.BookValidation = {
    createValidation,
    updateValidation,
};
