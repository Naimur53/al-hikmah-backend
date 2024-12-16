"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubChapterValidation = void 0;
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    body: zod_1.z.object({}),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({}),
});
exports.SubChapterValidation = {
    createValidation,
    updateValidation,
};
