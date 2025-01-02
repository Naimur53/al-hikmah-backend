import { Prisma, SubChapter } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { subChapterSearchableFields } from './subChapter.constant';
import { ISubChapterFilters } from './subChapter.interface';

const getAllSubChapter = async (
  filters: ISubChapterFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<SubChapter[]>> => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filterData } = filters;

  const andCondition = [];

  if (searchTerm) {
    const searchAbleFields = subChapterSearchableFields.map(single => {
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

  const whereConditions: Prisma.SubChapterWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.subChapter.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      paginationOptions.sortBy && paginationOptions.sortOrder
        ? {
            [paginationOptions.sortBy]: paginationOptions.sortOrder,
          }
        : {
            subChapterNo: 'asc',
          },
  });
  const total = await prisma.subChapter.count();
  const output = {
    data: result,
    meta: { page, limit, total },
  };
  return output;
};

const createSubChapter = async (
  payload: SubChapter,
): Promise<SubChapter | null> => {
  // check any chapter has bookPage
  const chapter = await prisma.chapter.findUnique({
    where: { id: payload.chapterId },
    select: {
      id: true,
      bookPages: {
        where: {
          chapterId: payload.chapterId,
          subChapterId: null,
        },
        select: {
          id: true,
        },
        take: 1,
      },
    },
  });

  if (!chapter) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Chapter not found!');
  }
  if (chapter.bookPages.length > 0) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'BookPage already exists on chapter remove them first to create subchapter!',
    );
  }
  // check if the subchapter already exists with number
  const isExist = await prisma.subChapter.findFirst({
    where: {
      subChapterNo: payload.subChapterNo,
      chapterId: payload.chapterId,
    },
  });
  if (isExist) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'SubChapter already exists! with this number :' + payload.subChapterNo,
    );
  }
  const newSubChapter = await prisma.subChapter.create({
    data: payload,
  });
  return newSubChapter;
};

const getSingleSubChapter = async (id: string): Promise<SubChapter | null> => {
  const result = await prisma.subChapter.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateSubChapter = async (
  id: string,
  payload: Partial<SubChapter>,
): Promise<SubChapter | null> => {
  const isExist = await prisma.subChapter.findUnique({ where: { id } });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SubChapter not found!');
  }
  if (payload.subChapterNo && isExist.subChapterNo !== payload.subChapterNo) {
    return await prisma.$transaction(async prisma => {
      await prisma.subChapter.updateMany({
        where: {
          chapterId: isExist.chapterId,
          subChapterNo: {
            gte: payload.subChapterNo,
          },
        },
        data: {
          subChapterNo: {
            increment: 1,
          },
        },
      });
      return await prisma.subChapter.update({
        where: { id },
        data: payload,
      });
    });
  }
  const result = await prisma.subChapter.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteSubChapter = async (id: string): Promise<SubChapter | null> => {
  return await prisma.$transaction(async prisma => {
    // Find the page to delete
    const subChapterToDelete = await prisma.subChapter.findUnique({
      where: { id },
    });

    if (!subChapterToDelete) {
      throw new ApiError(httpStatus.NOT_FOUND, 'BookPage not found!');
    }

    const { chapterId, subChapterNo } = subChapterToDelete;

    // Delete the specified BookPage
    const deletedPage = await prisma.subChapter.delete({
      where: { id },
    });

    // Update the page numbers of subsequent pages
    await prisma.subChapter.updateMany({
      where: {
        chapterId,
        subChapterNo: { gt: subChapterNo }, // Update only pages after the deleted one
      },
      data: {
        subChapterNo: { decrement: 1 }, // Decrement the page number by 1
      },
    });
    return deletedPage;
  });
};

export const SubChapterService = {
  getAllSubChapter,
  createSubChapter,
  updateSubChapter,
  getSingleSubChapter,
  deleteSubChapter,
};
