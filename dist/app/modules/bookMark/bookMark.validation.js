"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookMarkValidation = void 0;
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        bookId: zod_1.z.string({ required_error: 'Book id is required' }),
    }),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({
        bookId: zod_1.z.string({ required_error: 'Book id is required' }).optional(),
    }),
});
exports.BookMarkValidation = {
    createValidation,
    updateValidation,
};
