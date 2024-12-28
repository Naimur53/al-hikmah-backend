"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookCategoryValidation = void 0;
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'Name is required' }),
    }),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'Name is required' }).optional(),
    }),
});
exports.BookCategoryValidation = {
    createValidation,
    updateValidation,
};
