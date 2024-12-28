import { User } from '@prisma/client';
export type IRefreshTokenResponse = {
  accessToken: string;
  refreshToken: string;
  user: Omit<User, 'password'>;
};
export type IVerifyTokeResponse = {
  accessToken: string;
  refreshToken: string;
  user: Omit<User, 'password'>;
};
export type ILogin = {
  email: string;
  password: string;
};
export type IGoogleLogin = {
  email: string;
  name?: string;
  photoUrl?: string;
  gId: string;
};
export type IAdminLogin = {
  email: string;
  password: string;
  opt: number;
};
export type ILoginResponse = {
  accessToken: string;
  user: Omit<User, 'password'>;
  refreshToken?: string;
  otp?: number;
};
