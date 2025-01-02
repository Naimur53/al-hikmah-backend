"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubChapterValidation = void 0;
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        chapterId: zod_1.z.string({ required_error: 'ChapterId is required' }),
        title: zod_1.z.string({ required_error: 'Name is required' }),
        description: zod_1.z
            .string({ required_error: 'Description is required' })
            .optional(),
        subChapterNo: zod_1.z.number({ required_error: 'SubChapterNo is required' }),
    }),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({
        chapterId: zod_1.z.string({ required_error: 'ChapterId is required' }).optional(),
        title: zod_1.z.string({ required_error: 'Name is required' }).optional(),
        description: zod_1.z
            .string({ required_error: 'Description is required' })
            .optional(),
        subChapterNo: zod_1.z.number({ required_error: 'SubChapterNo is required' }),
    }),
});
exports.SubChapterValidation = {
    createValidation,
    updateValidation,
};
