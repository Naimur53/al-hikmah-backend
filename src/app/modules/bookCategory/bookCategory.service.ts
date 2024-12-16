import { BookCategory, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { bookCategorySearchableFields } from './bookCategory.constant';
import { IBookCategoryFilters } from './bookCategory.interface';

const getAllBookCategory = async (
  filters: IBookCategoryFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<BookCategory[]>> => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filterData } = filters;

  const andCondition = [];

  if (searchTerm) {
    const searchAbleFields = bookCategorySearchableFields.map(single => {
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

  const whereConditions: Prisma.BookCategoryWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.bookCategory.findMany({
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
  const total = await prisma.bookCategory.count();
  const output = {
    data: result,
    meta: { page, limit, total },
  };
  return output;
};

const createBookCategory = async (
  payload: BookCategory,
): Promise<BookCategory | null> => {
  const newBookCategory = await prisma.bookCategory.create({
    data: payload,
  });
  return newBookCategory;
};

const getSingleBookCategory = async (
  id: string,
): Promise<BookCategory | null> => {
  const result = await prisma.bookCategory.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateBookCategory = async (
  id: string,
  payload: Partial<BookCategory>,
): Promise<BookCategory | null> => {
  const result = await prisma.bookCategory.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteBookCategory = async (id: string): Promise<BookCategory | null> => {
  const result = await prisma.bookCategory.delete({
    where: { id },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'BookCategory not found!');
  }
  return result;
};

export const BookCategoryService = {
  getAllBookCategory,
  createBookCategory,
  updateBookCategory,
  getSingleBookCategory,
  deleteBookCategory,
};
