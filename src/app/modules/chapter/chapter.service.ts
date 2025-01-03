import { Chapter, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { chapterSearchableFields } from './chapter.constant';
import { IChapterFilters } from './chapter.interface';

const getAllChapter = async (
  filters: IChapterFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<Partial<Chapter>[]>> => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filterData } = filters;

  const andCondition = [];

  if (searchTerm) {
    const searchAbleFields = chapterSearchableFields.map(single => {
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

  const whereConditions: Prisma.ChapterWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.chapter.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      paginationOptions.sortBy && paginationOptions.sortOrder
        ? {
            [paginationOptions.sortBy]: paginationOptions.sortOrder,
          }
        : {
            chapterNo: 'asc',
          },
    select: {
      id: true,
      chapterNo: true,
      title: true,
      description: true,
      bookPages: {
        take: 1,
        select: {
          id: true,
          page: true,
        },
      },
      book: {
        select: {
          id: true,
          name: true,
        },
      },
      subChapters: {
        take: 1,
        select: {
          id: true,
          title: true,
          subChapterNo: true,
        },
      },
    },
  });
  const total = await prisma.chapter.count({ where: whereConditions });
  const output = {
    data: result,
    meta: { page, limit, total },
  };
  return output;
};

const createChapter = async (payload: Chapter): Promise<Chapter | null> => {
  // is there is any bookPage found on bookPage with bookId

  const book = await prisma.book.findUnique({
    where: { id: payload.bookId },
    select: {
      id: true,
      bookPages: {
        where: {
          bookId: payload.bookId,
          chapterId: null,
          subChapterId: null,
        },
        select: {
          id: true,
        },
        take: 1,
      },
    },
  });
  if (!book) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found!');
  }
  if (book.bookPages.length > 0) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'This book already has a book page on core!',
    );
  }
  // before create check does the chapterNo already exist

  const isExist = await prisma.chapter.findFirst({
    where: {
      bookId: payload.bookId,
      chapterNo: payload.chapterNo,
    },
  });
  if (isExist) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Chapter No :${payload.chapterNo} already exist with this book!`,
    );
  }
  const newChapter = await prisma.chapter.create({
    data: payload,
  });
  return newChapter;
};

const getSingleChapter = async (id: string): Promise<Chapter | null> => {
  const result = await prisma.chapter.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateChapter = async (
  id: string,
  payload: Partial<Chapter>,
): Promise<Chapter | null> => {
  const isExist = await prisma.chapter.findUnique({ where: { id } });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Chapter not found!');
  }
  if (payload.chapterNo && isExist.chapterNo !== payload.chapterNo) {
    return await prisma.$transaction(async tx => {
      await tx.chapter.updateMany({
        where: {
          bookId: isExist.bookId,
          chapterNo: {
            gte: payload.chapterNo,
          },
        },
        data: {
          chapterNo: {
            increment: 1,
          },
        },
      });
      return await tx.chapter.update({ where: { id }, data: payload });
    });
  }
  const result = await prisma.chapter.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteChapter = async (id: string): Promise<Chapter | null> => {
  return await prisma.$transaction(async prisma => {
    // Find the page to delete
    const chapterToDelete = await prisma.chapter.findUnique({
      where: { id },
    });

    if (!chapterToDelete) {
      throw new ApiError(httpStatus.NOT_FOUND, 'chapter not found!');
    }

    const { bookId, chapterNo } = chapterToDelete;

    // Delete the specified BookPage
    const deletedChapter = await prisma.chapter.delete({
      where: { id },
    });

    // Update the page numbers of subsequent pages
    await prisma.chapter.updateMany({
      where: {
        bookId,
        chapterNo: { gt: chapterNo }, // Update only pages after the deleted one
      },
      data: {
        chapterNo: { decrement: 1 }, // Decrement the page number by 1
      },
    });
    return deletedChapter;
  });
};

export const ChapterService = {
  getAllChapter,
  createChapter,
  updateChapter,
  getSingleChapter,
  deleteChapter,
};
