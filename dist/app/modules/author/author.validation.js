"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorValidation = void 0;
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'Name is required' }),
        photoUrl: zod_1.z.string({ required_error: 'PhotoUrl is required' }),
    }),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'Name is required' }).optional(),
        photoUrl: zod_1.z.string({ required_error: 'PhotoUrl is required' }).optional(),
    }),
});
exports.AuthorValidation = {
    createValidation,
    updateValidation,
};
