"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const createAuthZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: 'Email is required' }),
        password: zod_1.z.string({ required_error: 'Password is required' }).min(8),
        name: zod_1.z.string({ required_error: 'Name is required' }),
        provider: zod_1.z
            .enum([...Object.keys(client_1.ELoginProvider)])
            .default(client_1.ELoginProvider.normalEmail)
            .optional(),
        role: zod_1.z.nativeEnum(client_1.EUserRole).default(client_1.EUserRole.USER).optional(),
    }),
});
const loginZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: 'Email is required!' }),
        password: zod_1.z.string({ required_error: 'Password is required' }),
    }),
});
const googleLoginZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: 'Email is required!' }),
        gId: zod_1.z.string({ required_error: 'Password is required' }),
        name: zod_1.z.string({ required_error: 'name is required' }).optional(),
        photoUrl: zod_1.z.string({ required_error: 'Password is required' }).optional(),
    }),
});
const loginAdminZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: 'Email is required!' }),
        password: zod_1.z.string({ required_error: 'Password is required' }),
        otp: zod_1.z.number({ required_error: 'otp is required' }),
    }),
});
const refreshTokenZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        refreshToken: zod_1.z.string({
            required_error: 'Refresh Token is required',
        }),
    }),
});
const verifyToken = zod_1.z.object({
    body: zod_1.z.object({
        token: zod_1.z.number({ required_error: 'Token is required' }),
    }),
});
const verifyForgotToken = zod_1.z.object({
    body: zod_1.z.object({
        token: zod_1.z.number({ required_error: 'Token is required' }),
        email: zod_1.z.string({ required_error: 'Email is required' }),
    }),
});
const changePassword = zod_1.z.object({
    body: zod_1.z.object({
        token: zod_1.z.number({ required_error: 'Token is required' }),
        email: zod_1.z.string({ required_error: 'Email is required' }),
        password: zod_1.z
            .string({ required_error: 'Password is required' })
            .min(8, { message: 'Password must be at least 8 characters long' }),
    }),
});
exports.AuthValidation = {
    createAuthZodSchema,
    refreshTokenZodSchema,
    loginZodSchema,
    verifyToken,
    changePassword,
    loginAdminZodSchema,
    verifyForgotToken,
    googleLoginZodSchema,
};
