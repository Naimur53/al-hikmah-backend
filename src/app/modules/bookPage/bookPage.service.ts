import { BookPage, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { bookPageSearchableFields } from './bookPage.constant';
import { IBookPageFilters } from './bookPage.interface';

const getAllBookPage = async (
  filters: IBookPageFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<BookPage[]>> => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filterData } = filters;

  const andCondition = [];

  if (searchTerm) {
    const searchAbleFields = bookPageSearchableFields.map(single => {
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
        return { [field]: value };
      }),
    });
  }

  const whereConditions: Prisma.BookPageWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.bookPage.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      paginationOptions.sortBy && paginationOptions.sortOrder
        ? {
            [paginationOptions.sortBy]: paginationOptions.sortOrder,
          }
        : {
            page: 'asc',
          },
  });
  const total = await prisma.bookPage.count();
  const output = {
    data: result,
    meta: { page, limit, total },
  };
  return output;
};

const createBookPage = async (payload: BookPage): Promise<BookPage | null> => {
  const newBookPage = await prisma.bookPage.create({
    data: payload,
  });
  return newBookPage;
};

const getSingleBookPage = async (id: string): Promise<BookPage | null> => {
  const result = await prisma.bookPage.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateBookPage = async (
  id: string,
  payload: Partial<BookPage>,
): Promise<BookPage | null> => {
  const result = await prisma.bookPage.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteBookPage = async (id: string): Promise<BookPage | null> => {
  const result = await prisma.bookPage.delete({
    where: { id },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'BookPage not found!');
  }
  return result;
};

export const BookPageService = {
  getAllBookPage,
  createBookPage,
  updateBookPage,
  getSingleBookPage,
  deleteBookPage,
};
