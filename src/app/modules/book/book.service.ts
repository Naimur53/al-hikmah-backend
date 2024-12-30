import { Book, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { bookSearchableFields } from './book.constant';
import { IBookFilters } from './book.interface';

const getAllBook = async (
  filters: IBookFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<Book[]>> => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filterData } = filters;

  const andCondition = [];

  if (searchTerm) {
    const searchAbleFields = bookSearchableFields.map(single => {
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

  const whereConditions: Prisma.BookWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.book.findMany({
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
    include: { author: true, publisher: true, category: true },
  });
  const total = await prisma.book.count();
  const output = {
    data: result,
    meta: { page, limit, total },
  };
  return output;
};

const createBook = async (payload: Book): Promise<Book | null> => {
  // check is book exist with name

  const isExits = await prisma.book.findUnique({
    where: { name: payload.name },
  });
  if (isExits) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Book name already exist!`);
  }
  // Check if category, author, and publisher exist in parallel
  const [category, author, publisher] = await Promise.all([
    prisma.bookCategory.findUnique({ where: { id: payload.categoryId } }),
    prisma.author.findUnique({ where: { id: payload.authorId } }),
    prisma.publisher.findUnique({ where: { id: payload.publisherId } }),
  ]);

  // Validate existence of required references
  if (!category) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Book Category not found!`);
  }
  if (!author) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Author not found!`);
  }
  if (!publisher) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Publisher not found!`);
  }

  const newBook = await prisma.book.create({
    data: payload,
  });
  return newBook;
};

const getSingleBook = async (id: string): Promise<Book | null> => {
  const result = await prisma.book.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateBook = async (
  id: string,
  payload: Partial<Book>,
): Promise<Book | null> => {
  const result = await prisma.book.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteBook = async (id: string): Promise<Book | null> => {
  const result = await prisma.book.delete({
    where: { id },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found!');
  }
  return result;
};

export const BookService = {
  getAllBook,
  createBook,
  updateBook,
  getSingleBook,
  deleteBook,
};
