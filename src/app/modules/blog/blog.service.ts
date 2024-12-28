import { Blog, EUserRole, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { blogSearchableFields } from './blog.constant';
import { IBlogFilters } from './blog.interface';

const getAllBlog = async (
  filters: IBlogFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<Omit<Blog, 'content'>[]>> => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filterData } = filters;

  const andCondition = [];

  if (searchTerm) {
    const searchAbleFields = blogSearchableFields.map(single => {
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

  const whereConditions: Prisma.BlogWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.blog.findMany({
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
    select: {
      id: true,
      title: true,
      thumbnail: true,
      status: true,
      authorId: true,
      createdAt: true,
      updatedAt: true,
      description: true,
      author: {
        select: {
          id: true,
          name: true,
          photoUrl: true,
        },
      },
    },
  });
  const total = await prisma.blog.count();
  const output = {
    data: result,
    meta: { page, limit, total },
  };
  return output;
};

const createBlog = async (payload: Blog): Promise<Blog | null> => {
  const newBlog = await prisma.blog.create({
    data: payload,
  });
  return newBlog;
};

const getSingleBlog = async (id: string): Promise<Blog | null> => {
  const result = await prisma.blog.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateBlog = async (
  id: string,
  payload: Partial<Blog>,
  requestUserId: string,
): Promise<Blog | null> => {
  // check if the blog exists
  const blog = await prisma.blog.findUnique({
    where: {
      id,
    },
  });

  if (!blog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Blog not found!');
  }
  // get rqeustusr info
  const requestedUser = await prisma.user.findUnique({
    where: { id: requestUserId },
  });
  if (!requestedUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }
  // check if the user is the author of the blog
  if (requestedUser.role === EUserRole.USER) {
    if (payload.status === 'approved') {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'You are not authorized to approved!',
      );
    }
    //
    if (requestUserId !== blog.authorId) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'You are not authorized to update this blog!',
      );
    }
  }
  const result = await prisma.blog.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteBlog = async (id: string): Promise<Blog | null> => {
  const result = await prisma.blog.delete({
    where: { id },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Blog not found!');
  }
  return result;
};

export const BlogService = {
  getAllBlog,
  createBlog,
  updateBlog,
  getSingleBlog,
  deleteBlog,
};
