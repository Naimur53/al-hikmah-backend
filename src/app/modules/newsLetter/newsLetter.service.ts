import { NewsLetter, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { newsLetterSearchableFields } from './newsLetter.constant';
import { INewsLetterFilters } from './newsLetter.interface';

const getAllNewsLetter = async (
  filters: INewsLetterFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<NewsLetter[]>> => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filterData } = filters;

  const andCondition = [];

  if (searchTerm) {
    const searchAbleFields = newsLetterSearchableFields.map(single => {
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

  const whereConditions: Prisma.NewsLetterWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.newsLetter.findMany({
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
  const total = await prisma.newsLetter.count();
  const output = {
    data: result,
    meta: { page, limit, total },
  };
  return output;
};

const createNewsLetter = async (
  payload: NewsLetter,
): Promise<NewsLetter | null> => {
  // check is email exist
  const isExist = await prisma.newsLetter.findUnique({
    where: { email: payload.email },
  });
  if (isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already exist!');
  }
  const newNewsLetter = await prisma.newsLetter.create({
    data: payload,
  });
  return newNewsLetter;
};

const getSingleNewsLetter = async (id: string): Promise<NewsLetter | null> => {
  const result = await prisma.newsLetter.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateNewsLetter = async (
  id: string,
  payload: Partial<NewsLetter>,
): Promise<NewsLetter | null> => {
  const result = await prisma.newsLetter.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteNewsLetter = async (id: string): Promise<NewsLetter | null> => {
  const result = await prisma.newsLetter.delete({
    where: { id },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'NewsLetter not found!');
  }
  return result;
};

export const NewsLetterService = {
  getAllNewsLetter,
  createNewsLetter,
  updateNewsLetter,
  getSingleNewsLetter,
  deleteNewsLetter,
};
