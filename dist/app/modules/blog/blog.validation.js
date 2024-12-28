"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: 'Title is required ' }),
        description: zod_1.z.string({ required_error: 'Description is required ' }),
        thumbnail: zod_1.z.string({ required_error: 'Thumbnail is required ' }),
        content: zod_1.z.string({ required_error: 'Content is required ' }),
        status: zod_1.z
            .enum([...Object.keys(client_1.EBlogStatus)])
            .default(client_1.EBlogStatus.pending)
            .optional(),
    }),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: 'Title is required ' }).optional(),
        description: zod_1.z
            .string({ required_error: 'Description is required ' })
            .optional(),
        thumbnail: zod_1.z
            .string({ required_error: 'Thumbnail is required ' })
            .optional(),
        content: zod_1.z.string({ required_error: 'Content is required ' }).optional(),
        status: zod_1.z
            .enum([...Object.keys(client_1.EBlogStatus)])
            .default(client_1.EBlogStatus.pending)
            .optional(),
    }),
});
exports.BlogValidation = {
    createValidation,
    updateValidation,
};
