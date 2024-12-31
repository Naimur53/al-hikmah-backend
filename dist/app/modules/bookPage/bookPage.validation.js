"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookPageValidation = void 0;
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        page: zod_1.z.number({ required_error: 'Page is required' }).min(1),
        content: zod_1.z.string({ required_error: 'Content is required' }),
        bookId: zod_1.z.string({ required_error: 'BookId is required' }),
        chapterId: zod_1.z.string({ required_error: 'ChapterId is required' }).optional(),
        subChapterId: zod_1.z
            .string({ required_error: 'SubChapterId is required' })
            .optional(),
    }),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({
        page: zod_1.z.number({ required_error: 'Page is required' }).optional(),
        content: zod_1.z.string({ required_error: 'Content is required' }).optional(),
        bookId: zod_1.z.string({ required_error: 'BookId is required' }).optional(),
        chapterId: zod_1.z.string({ required_error: 'ChapterId is required' }).optional(),
        subChapterId: zod_1.z
            .string({ required_error: 'SubChapterId is required' })
            .optional(),
    }),
});
const bulkCreateValidation = zod_1.z.object({
    body: zod_1.z.array(zod_1.z.object({
        page: zod_1.z.number({ required_error: 'Page is required' }).min(1),
        content: zod_1.z.string({ required_error: 'Content is required' }),
        bookId: zod_1.z.string({ required_error: 'BookId is required' }),
        chapterId: zod_1.z
            .string({ required_error: 'ChapterId is required' })
            .optional(),
        subChapterId: zod_1.z
            .string({ required_error: 'SubChapterId is required' })
            .optional(),
    })),
});
const bulkDeleteValidation = zod_1.z.object({
    body: zod_1.z.array(zod_1.z.string({
        required_error: 'BookPageId is required',
    })),
});
exports.BookPageValidation = {
    createValidation,
    updateValidation,
    bulkCreateValidation,
    bulkDeleteValidation,
};
