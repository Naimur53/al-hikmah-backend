import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import { jwtHelpers } from '../../helpers/jwtHelpers';
import prisma from '../../shared/prisma';

const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //get authorization token
      const token = req.headers.authorization;
      console.log({ token });
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
      }
      // verify token
      let verifiedUser = null;

      verifiedUser = jwtHelpers.verifyToken(token, config.jwt.secret as Secret);

      const isUserExist = await prisma.user.findUnique({
        where: { id: verifiedUser.userId },
        select: { id: true, email: true, isBlocked: true, role: true },
      });
      if (!isUserExist) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');
      }
      if (isUserExist.isBlocked) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'User is blocked');
      }
      // set user in request
      req.user = verifiedUser; // role  , userid
      req.user.role = isUserExist.role;

      // role diye guard korar jnno
      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
      }
      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
