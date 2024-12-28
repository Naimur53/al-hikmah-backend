import { ELoginProvider, EUserRole } from '@prisma/client';
import { z } from 'zod';

const createAuthZodSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }),
    password: z.string({ required_error: 'Password is required' }).min(8),
    name: z.string({ required_error: 'Name is required' }),
    provider: z
      .enum([...Object.keys(ELoginProvider)] as [string, ...string[]])
      .default(ELoginProvider.normalEmail)
      .optional(),
    role: z.nativeEnum(EUserRole).default(EUserRole.USER).optional(),
  }),
});
const loginZodSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required!' }),
    password: z.string({ required_error: 'Password is required' }),
  }),
});
const googleLoginZodSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required!' }),
    gId: z.string({ required_error: 'Password is required' }),
    name: z.string({ required_error: 'name is required' }).optional(),
    photoUrl: z.string({ required_error: 'Password is required' }).optional(),
  }),
});
const loginAdminZodSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required!' }),
    password: z.string({ required_error: 'Password is required' }),
    otp: z.number({ required_error: 'otp is required' }),
  }),
});
const refreshTokenZodSchema = z.object({
  body: z.object({
    refreshToken: z.string({
      required_error: 'Refresh Token is required',
    }),
  }),
});
const verifyToken = z.object({
  body: z.object({
    token: z.number({ required_error: 'Token is required' }),
  }),
});
const verifyForgotToken = z.object({
  body: z.object({
    token: z.number({ required_error: 'Token is required' }),
    email: z.string({ required_error: 'Email is required' }),
  }),
});
const changePassword = z.object({
  body: z.object({
    token: z.number({ required_error: 'Token is required' }),
    email: z.string({ required_error: 'Email is required' }),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, { message: 'Password must be at least 8 characters long' }),
  }),
});

export const AuthValidation = {
  createAuthZodSchema,
  refreshTokenZodSchema,
  loginZodSchema,
  verifyToken,
  changePassword,
  loginAdminZodSchema,
  verifyForgotToken,
  googleLoginZodSchema,
};
