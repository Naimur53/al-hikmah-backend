"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChapterValidation = void 0;
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: 'Title is required' }),
        description: zod_1.z
            .string({ required_error: 'Description is required' })
            .optional(),
        bookId: zod_1.z.string({ required_error: 'BookId is required' }),
        chapterNo: zod_1.z.number({ required_error: 'ChapterNo is required' }),
    }),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: 'Title is required' }).optional(),
        description: zod_1.z
            .string({ required_error: 'Description is required' })
            .optional(),
        bookId: zod_1.z.string({ required_error: 'BookId is required' }).optional(),
        chapterNo: zod_1.z.number({ required_error: 'ChapterNo is required' }).optional(),
    }),
});
exports.ChapterValidation = {
    createValidation,
    updateValidation,
};
