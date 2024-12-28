import { EUserRole, EVerificationOtp, User } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import createBycryptPassword from '../../../helpers/createBycryptPassword';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import sendEmail from '../../../helpers/sendEmail';
import EmailTemplates from '../../../shared/EmailTemplates';
import prisma from '../../../shared/prisma';
import generateOTP, { checkTimeOfOTP } from '../../../utils/generatateOpt';
import { UserService } from '../user/user.service';
import {
  IAdminLogin,
  IGoogleLogin,
  ILogin,
  ILoginResponse,
  IRefreshTokenResponse,
  IVerifyTokeResponse,
} from './auth.Interface';
const createUser = async (user: User): Promise<ILoginResponse> => {
  // checking is user buyer
  const { password: givenPassword, ...rest } = user;
  if (!givenPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Password is required');
  }
  const otp = generateOTP();
  const genarateBycryptPass = await createBycryptPassword(givenPassword);

  const isUserExist = await prisma.user.findUnique({
    where: { email: user.email },
  });

  // create data
  const dataToCreate: User = {
    password: genarateBycryptPass,
    ...rest,
    // only for super admin
    role:
      rest.email === config.mainAdminEmail
        ? EUserRole.SUPER_ADMIN // super admin
        : EUserRole.USER,
    isVerified: false,
    isBlocked: false,
  };
  // if user and account exits
  if (isUserExist?.id && isUserExist.isVerified) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'User already exits');
  }

  const newUser = await prisma.$transaction(async tx => {
    // delete if all opt
    // if  user already exits but not verified
    if (isUserExist?.id && !isUserExist.isVerified) {
      // start new  transection  for new user
      await tx.verificationOtp.deleteMany({
        where: { ownById: isUserExist.id },
      });
      await tx.user.delete({ where: { id: isUserExist.id } });
    }

    const newUserInfo = await tx.user.create({
      data: dataToCreate,
    });
    // create new otp
    await tx.verificationOtp.create({
      data: {
        ownById: newUserInfo.id,
        otp: otp,
        type: EVerificationOtp.createUser,
      },
    });
    return newUserInfo;
  });
  if (!newUser?.id) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'failed to create user');
  }
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const { password, id, email, name, ...others } = newUser;
  //create access token & refresh token
  const accessToken = jwtHelpers.createToken(
    { userId: id, role: newUser.role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  const refreshToken = jwtHelpers.createToken(
    { userId: id, role: newUser.role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  );

  return {
    user: { email, id, name, ...others },
    accessToken,
    refreshToken,
    otp,
  };
  // eslint-disable-next-line no-unused-vars
};

const loginUser = async (payload: ILogin): Promise<ILoginResponse> => {
  const { email: givenEmail, password } = payload;
  const isUserExist = await prisma.user.findUnique({
    where: { email: givenEmail },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  if (
    isUserExist.password &&
    !(await bcryptjs.compare(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  //create access token & refresh token
  const { email, id, role, name, ...others } = isUserExist;

  const accessToken = jwtHelpers.createToken(
    { userId: id, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  const refreshToken = jwtHelpers.createToken(
    { userId: id, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  );

  return {
    user: { email, id, name, role, ...others },
    accessToken,
    refreshToken,
  };
};

const googleLoginUser = async (
  payload: IGoogleLogin,
): Promise<ILoginResponse> => {
  const { email: givenEmail, photoUrl, gId, name: givenName } = payload;
  let user: User;
  const isUserExist = await prisma.user.findUnique({
    where: { email: givenEmail },
  });

  if (!isUserExist) {
    // throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
    // create one
    const generateBycryptGid = await createBycryptPassword(gId);
    const newUser = await prisma.user.create({
      data: {
        email: givenEmail,
        name: givenName || 'unknown',
        photoUrl,
        gId: generateBycryptGid,
        role: EUserRole.USER,
        isVerified: true,
        isBlocked: false,
        loginProvider: 'google',
      },
    });
    user = newUser;
  } else {
    const generateBycryptGid = await createBycryptPassword(gId);
    // check user was login with normalEmail
    if (!isUserExist.gId) {
      // linking
      const updateUserGId = await prisma.user.update({
        where: { email: givenEmail },
        data: { gId: generateBycryptGid },
      });
      user = updateUserGId;
    } else {
      // check is user was login with google
      if (generateBycryptGid !== isUserExist.gId) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'User Gid does not match!');
      }
      user = isUserExist;
    }
  }
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  //create access token & refresh token
  const { email, id, role, name, ...others } = user;

  const accessToken = jwtHelpers.createToken(
    { userId: id, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  const refreshToken = jwtHelpers.createToken(
    { userId: id, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  );

  return {
    user: { email, id, name, role, ...others },
    accessToken,
    refreshToken,
  };
};
const loginAdmin = async (payload: ILogin): Promise<{ otp: string }> => {
  const { email: givenEmail, password } = payload;
  const isUserExist = await prisma.user.findUnique({
    where: { email: givenEmail },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  if (
    isUserExist.password &&
    !(await bcryptjs.compare(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  //create access token & refresh token
  const { email, role } = isUserExist;

  if (role === EUserRole.USER) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Your are not a admin');
  }
  const otp = generateOTP();
  const verificationOtp = await prisma.$transaction(async tx => {
    await tx.verificationOtp.deleteMany({
      where: { ownById: isUserExist.id },
    });
    return await tx.verificationOtp.create({
      data: {
        ownById: isUserExist.id,
        otp: otp,
        type: EVerificationOtp.adminLogin,
      },
    });
  });
  if (!verificationOtp.otp) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to generate otp');
  }
  await sendEmail(
    { to: email },
    {
      subject: EmailTemplates.adminLogin.subject,
      html: EmailTemplates.adminLogin.html({ token: otp }),
    },
  );
  return {
    otp: 'otp send',
  };
};
const verifyOtpForAdminLogin = async (
  payload: IAdminLogin,
): Promise<ILoginResponse> => {
  const { email: givenEmail, password } = payload;
  const isUserExist = await prisma.user.findUnique({
    where: { email: givenEmail },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  if (
    isUserExist.password &&
    !(await bcryptjs.compare(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }
  const isTokenExit = await prisma.verificationOtp.findFirst({
    where: {
      ownById: isUserExist.id,
      otp: payload.opt,
      type: EVerificationOtp.adminLogin,
    },
  });

  if (!isTokenExit) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'OTP is not match');
  }

  // check time validation
  if (checkTimeOfOTP(isTokenExit.createdAt)) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'OPT is expired!');
  }
  //create access token & refresh
  const { email, id, role, name, ...others } = isUserExist;

  const accessToken = jwtHelpers.createToken(
    { userId: id, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  const refreshToken = jwtHelpers.createToken(
    { userId: id, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  );

  return {
    user: { email, id, name, role, ...others },
    accessToken,
    refreshToken,
  };
};
const resendEmail = async (givenEmail: string): Promise<ILoginResponse> => {
  const isUserExist = await prisma.user.findUnique({
    where: { email: givenEmail },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (isUserExist?.isVerified) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already verified');
  }
  const otp = generateOTP();
  //create access token & refresh token
  const { email, id, role, name, ...others } = isUserExist;

  const accessToken = jwtHelpers.createToken(
    { userId: id, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );
  const verificationOtp = await prisma.$transaction(async tx => {
    await tx.verificationOtp.deleteMany({
      where: { ownById: isUserExist.id },
    });
    return await tx.verificationOtp.create({
      data: {
        ownById: isUserExist.id,
        otp: otp,
        type: EVerificationOtp.createUser,
      },
    });
  });
  if (!verificationOtp.id) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Cannot create verification Otp',
    );
  }
  const refreshToken = jwtHelpers.createToken(
    { userId: id, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  );

  return {
    user: { email, id, name, role, ...others },
    accessToken,
    refreshToken: refreshToken,
    otp,
  };
};
const sendForgotEmail = async (
  givenEmail: string,
): Promise<{ otp: number }> => {
  const isUserExist = await prisma.user.findUnique({
    where: { email: givenEmail },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const otp = generateOTP();
  //create access token & refresh token
  const { email } = isUserExist;

  const verificationOtp = await prisma.$transaction(async tx => {
    await tx.verificationOtp.deleteMany({
      where: { ownById: isUserExist.id },
    });
    return await tx.verificationOtp.create({
      data: {
        ownById: isUserExist.id,
        otp: otp,
        type: EVerificationOtp.forgotPassword,
      },
    });
  });
  if (!verificationOtp.id) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Cannot create verification Otp',
    );
  }
  await sendEmail(
    { to: email },
    {
      subject: EmailTemplates.verifyForgot.subject,
      html: EmailTemplates.verifyForgot.html({ token: otp }),
    },
  );
  return {
    otp,
  };
};
const sendDeleteUserEmail = async (
  givenEmail: string,
): Promise<{ otp: number }> => {
  const isUserExist = await prisma.user.findUnique({
    where: { email: givenEmail },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const otp = generateOTP();
  //create access token & refresh token
  const { email } = isUserExist;
  console.log(email);
  const verificationOtp = await prisma.$transaction(async tx => {
    await tx.verificationOtp.deleteMany({
      where: { ownById: isUserExist.id },
    });
    return await tx.verificationOtp.create({
      data: {
        ownById: isUserExist.id,
        otp: otp,
        type: EVerificationOtp.deleteUser,
      },
    });
  });
  if (!verificationOtp.id) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Cannot create verification Otp',
    );
  }
  await sendEmail(
    { to: email },
    {
      subject: EmailTemplates.deleteUser.subject,
      html: EmailTemplates.deleteUser.html({ token: otp }),
    },
  );
  return {
    otp,
  };
};

const verifySignupToken = async (
  token: number,
  userId: string,
): Promise<IVerifyTokeResponse> => {
  const isUserExist = await prisma.user.findUnique({ where: { id: userId } });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // check is token match and valid
  const isTokenExit = await prisma.verificationOtp.findFirst({
    where: {
      ownById: userId,
      otp: token,
      type: EVerificationOtp.createUser,
    },
  });

  if (!isTokenExit) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'OTP is not match');
  }

  // check time validation
  if (checkTimeOfOTP(isTokenExit.createdAt)) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'OPT is expired!');
  }

  //generate new Access token

  const newAccessToken = jwtHelpers.createToken(
    {
      userId: isUserExist.id,
      role: isUserExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  // delete all otp
  await prisma.verificationOtp.deleteMany({
    where: { ownById: isUserExist.id },
  });
  const result = await UserService.updateUser(isUserExist.id, {
    isVerified: true,
  });
  if (!result) {
    new ApiError(httpStatus.BAD_REQUEST, 'user not found');
  }

  const refreshToken = jwtHelpers.createToken(
    { userId: isUserExist.id, role: isUserExist.role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const { password, ...rest } = result as User;
  return {
    accessToken: newAccessToken,
    refreshToken,
    user: rest,
  };
};

const verifyDeleteUserToken = async (
  token: number,
  userEmail: string,
): Promise<{ token: number; isValidate: boolean; deletedUserId: string }> => {
  const isUserExist = await prisma.user.findUnique({
    where: { email: userEmail },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  console.log(token, userEmail);
  // check is token match and valid
  const isTokenExit = await prisma.verificationOtp.findFirst({
    where: {
      ownById: isUserExist.id,
      otp: token,
      type: EVerificationOtp.deleteUser,
    },
  });

  if (!isTokenExit) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'OTP is not match');
  }

  // check time validation
  if (checkTimeOfOTP(isTokenExit.createdAt)) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'OPT is expired!');
  }

  // delete all otp user
  const result = await prisma.user.delete({
    where: {
      id: isUserExist.id,
    },
  });
  if (!result.id) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to delete');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  return {
    token,
    isValidate: true,
    deletedUserId: result.id,
  };
};

const verifyForgotToken = async (
  token: number,
  userEmail: string,
): Promise<{ token: number; isValidate: boolean }> => {
  const isUserExist = await prisma.user.findUnique({
    where: { email: userEmail },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // check is token match and valid
  const isTokenExit = await prisma.verificationOtp.findFirst({
    where: {
      ownById: isUserExist.id,
      otp: token,
      type: EVerificationOtp.forgotPassword,
    },
  });

  if (!isTokenExit) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'OTP is not match');
  }

  // check time validation
  if (checkTimeOfOTP(isTokenExit.createdAt)) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'OPT is expired!');
  }

  // delete all otp
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  return {
    token,
    isValidate: true,
  };
};
const changePassword = async ({
  password,
  email,
  otp,
}: {
  password: string;
  email: string;
  otp: number;
}): Promise<ILoginResponse> => {
  // checking is user buyer
  // check is token match and valid

  const genarateBycryptPass = await createBycryptPassword(password);

  const isUserExist = await prisma.user.findUnique({
    where: { email: email },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }
  const isTokenExit = await prisma.verificationOtp.findFirst({
    where: {
      ownById: isUserExist.id,
      otp,
      type: EVerificationOtp.forgotPassword,
    },
  });

  if (!isTokenExit) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'OTP is not match');
  }
  if (checkTimeOfOTP(isTokenExit.createdAt)) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'OPT is expired!');
  }
  const result = await prisma.$transaction(async tx => {
    await tx.verificationOtp.deleteMany({
      where: {
        ownById: isUserExist.id,
      },
    });
    return await tx.user.update({
      where: { id: isUserExist.id },
      data: { password: genarateBycryptPass },
    });
  });
  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong');
  }
  //create access token & refresh token
  const accessToken = jwtHelpers.createToken(
    { userId: isUserExist.id, role: isUserExist.role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  const refreshToken = jwtHelpers.createToken(
    { userId: isUserExist.id, role: isUserExist.role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  );

  return {
    user: result,
    accessToken,
    refreshToken,
    otp,
  };
  // eslint-disable-next-line no-unused-vars
};
const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  //verify token
  // invalid token - synchronous
  let verifiedToken = null;
  console.log({ token });
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret,
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  const { id: idToken } = verifiedToken;
  // checking deleted user's refresh token

  const isUserExist = await prisma.user.findFirst({ where: { id: idToken } });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  //generate new Access token

  const newAccessToken = jwtHelpers.createToken(
    {
      userId: isUserExist.id,
      role: isUserExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );
  const { email, id, role, name, password, ...others } = isUserExist;

  return {
    accessToken: newAccessToken,
    refreshToken: token,
    user: { email, id, role, name, ...others },
  };
};

export const AuthService = {
  createUser,
  loginUser,
  refreshToken,
  verifySignupToken,
  resendEmail,
  sendForgotEmail,
  verifyForgotToken,
  changePassword,
  sendDeleteUserEmail,
  verifyDeleteUserToken,
  loginAdmin,
  verifyOtpForAdminLogin,
  googleLoginUser,
};
