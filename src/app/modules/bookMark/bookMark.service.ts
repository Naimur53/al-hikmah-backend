import { BookMark, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { bookMarkSearchableFields } from './bookMark.constant';
import { IBookMarkFilters } from './bookMark.interface';

const getAllBookMark = async (
  filters: IBookMarkFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<BookMark[]>> => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filterData } = filters;

  const andCondition = [];

  if (searchTerm) {
    const searchAbleFields = bookMarkSearchableFields.map(single => {
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
      AND: Object.entries(filterData).map(([field, value]) => {
        // Check if the value is a string "true" or "false"
        if (value === 'true' || value === 'false') {
          return { [field]: JSON.parse(value) };
        }
        return { [field]: value };
      }),
    });
  }

  const whereConditions: Prisma.BookMarkWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.bookMark.findMany({
    where: whereConditions,
    skip,
    take: limit,
    select: {
      id: true,
      userId: true,
      bookId: true,
      createdAt: true,
      updatedAt: true,
      book: {
        select: {
          id: true,
          name: true,
          banglaName: true,
          isFeatured: true,
          description: true,
          totalShare: true,
          keywords: true,
          photo: true,
          createdAt: true,
          updatedAt: true,
          isActive: true,
          author: true,
          publisher: true,
          category: true,
          authorId: true,
          publisherId: true,
          totalRead: true,
          categoryId: true,
          bookPages: {
            take: 1,
            select: {
              id: true,
              content: true,
            },
            where: {
              chapterId: null,
              subChapterId: null,
            },
          },
          chapters: {
            take: 1,
            orderBy: {
              chapterNo: 'asc',
            },
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
    orderBy:
      paginationOptions.sortBy && paginationOptions.sortOrder
        ? {
            [paginationOptions.sortBy]: paginationOptions.sortOrder,
          }
        : {
            createdAt: 'desc',
          },
  });
  const total = await prisma.bookMark.count();
  const output = {
    data: result,
    meta: { page, limit, total },
  };
  return output;
};

const createBookMark = async (payload: BookMark): Promise<BookMark | null> => {
  // check is exits
  const isExist = await prisma.bookMark.findFirst({
    where: {
      userId: payload.userId,
      bookId: payload.bookId,
    },
  });
  if (isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Already Book Marked ');
  }
  const newBookMark = await prisma.bookMark.create({
    data: payload,
  });
  return newBookMark;
};

const getSingleBookMark = async (id: string): Promise<BookMark | null> => {
  const result = await prisma.bookMark.findUnique({
    where: {
      id,
    },
  });
  return result;
};
const getSingleUserBookMark = async (
  id: string,
): Promise<BookMark[] | null> => {
  const result = await prisma.bookMark.findMany({
    where: {
      userId: id,
    },
  });
  return result;
};

const updateBookMark = async (
  id: string,
  payload: Partial<BookMark>,
): Promise<BookMark | null> => {
  const result = await prisma.bookMark.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteBookMark = async (id: string): Promise<BookMark | null> => {
  const result = await prisma.bookMark.delete({
    where: { id },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'BookMark not found!');
  }
  return result;
};

export const BookMarkService = {
  getAllBookMark,
  createBookMark,
  updateBookMark,
  getSingleBookMark,
  deleteBookMark,
  getSingleUserBookMark,
};
