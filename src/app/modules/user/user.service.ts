import { EUserRole, Prisma, User } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { userSearchableFields } from './user.constant';
import { IAdminOverview, IUserFilters } from './user.interface';

const getAllUser = async (
  filters: IUserFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<User[]>> => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filterData } = filters;

  const andCondition = [];

  if (searchTerm) {
    const searchAbleFields = userSearchableFields.map(single => {
      const query = {
        [single]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      };
      return query;
    });
    andCondition.push({
      OR: searchAbleFields,
    });
  }
  if (Object.keys(filters).length) {
    andCondition.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      paginationOptions.sortBy && paginationOptions.sortOrder
        ? {
            [paginationOptions.sortBy]: paginationOptions.sortOrder,
          }
        : {
            createdAt: 'desc',
          },
  });
  const total = await prisma.user.count();
  const output = {
    data: result,
    meta: { page, limit, total },
  };
  return output;
};

const createUser = async (payload: User): Promise<User | null> => {
  const newUser = await prisma.user.create({
    data: payload,
  });
  return newUser;
};

const getSingleUser = async (id: string): Promise<User | null> => {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateUser = async (
  id: string,
  payload: Partial<User>,
  requestedUserId: string,
): Promise<User | null> => {
  // check if the user exists
  const requestedUser = await prisma.user.findUnique({
    where: {
      id: requestedUserId,
    },
  });
  if (!requestedUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }

  if (requestedUser.role === EUserRole.ADMIN) {
    if (payload.role) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'You are not allowed to update role!',
      );
    }
  }
  if (requestedUser.role === EUserRole.USER) {
    if (requestedUser.id !== id) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'You are not allowed to update this user!',
      );
    }
    // check if the user update role
    if (payload.role) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'You are not allowed to update role!',
      );
    }
    if (payload.isBlocked) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'You are not allowed to update isBlocked!',
      );
    }
    if (payload.isVerified) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'You are not allowed to update isVerified!',
      );
    }
  }
  if (payload.password) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You are not allowed to update password',
    );
  }
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteUser = async (id: string): Promise<User | null> => {
  const result = await prisma.user.delete({
    where: { id },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }
  return result;
};
const getAdminOverview = async (): Promise<IAdminOverview | null> => {
  const [
    totalUser,
    totalBook,
    totalBlog,
    totalNewsletter,
    totalAuthor,
    totalPublisher,
    totalCategory,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.book.count(),
    prisma.blog.count(),
    prisma.newsLetter.count(),
    prisma.author.count(),
    prisma.publisher.count(),
    prisma.bookCategory.count(),
  ]);

  return {
    totalUser,
    totalBook,
    totalBlog,
    totalNewsletter,
    totalAuthor,
    totalPublisher,
    totalCategory,
  };
};

export const UserService = {
  getAllUser,
  createUser,
  updateUser,
  getSingleUser,
  deleteUser,
  getAdminOverview,
};
