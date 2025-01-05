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
        return {
          [field]:
            value === null || value === 'undefined' || value === 'null'
              ? null
              : { equals: value },
        };
      }),
    });
  }

  const whereConditions: Prisma.BookPageWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};
  console.log(andCondition[0]);
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
    select: {
      id: true,
      bookId: true,
      page: true,
      chapterId: true,
      subChapterId: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      book: {
        select: {
          id: true,
          name: true,
        },
      },
      chapter: {
        select: {
          id: true,
          title: true,
          description: true,
          chapterNo: true,
        },
      },
      subChapter: {
        select: {
          id: true,
          title: true,
          subChapterNo: true,
          description: true,
        },
      },
    },
  });
  const total = await prisma.bookPage.count({ where: whereConditions });
  const output = {
    data: result,
    meta: { page, limit, total },
  };
  return output;
};

const createBookPage = async (payload: BookPage): Promise<BookPage | null> => {
  // check if book page exist with value
  const isExits = await prisma.bookPage.findFirst({
    where: {
      bookId: payload.bookId,
      page: payload.page,
      chapterId: payload.chapterId || null,
      subChapterId: payload.subChapterId || null,
    },
  });

  if (isExits) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Book Page already exist with this value!' + 'page no:' + payload.page,
    );
  }

  const isAnyExits = await prisma.book.findFirst({
    where: {
      id: payload.bookId,
    },
    select: {
      chapters: {
        select: {
          id: true,
          subChapters: {
            select: {
              id: true,
            },
          },
        },
        take: 1,
      },
    },
  });

  // if (
  //   isAnyExits?.chapters.length &&
  //   isAnyExits.chapters[0].subChapters?.length &&
  //   !payload.subChapterId
  // ) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'SubChapterId is required!');
  // }

  if (isAnyExits?.chapters.length && !payload.chapterId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'ChapterId is required!');
  }

  if (payload.chapterId && payload.subChapterId) {
    const isAnyPageExitsUnderTheChapter = await prisma.bookPage.findFirst({
      where: {
        bookId: payload.bookId,
        chapterId: payload.chapterId,
        subChapterId: null,
      },
    });
    if (isAnyPageExitsUnderTheChapter) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'You can not add page on sub that already have page on chapter ',
      );
    }
  }

  const newBookPage = await prisma.bookPage.create({
    data: payload,
  });
  return newBookPage;
};

const bulkCreateBookPage = async (
  payload: BookPage[],
): Promise<Prisma.BatchPayload> => {
  const bookId = payload[0].bookId;
  const chapterId = payload[0].chapterId || null;
  const subChapterId = payload[0].subChapterId || null;

  payload.forEach(page => {
    if (page.bookId !== bookId) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'BookId must be same for all pages!',
      );
    }
    const getSingleChapter = page.chapterId || null;
    if (subChapterId !== chapterId) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'ChapterId must be same for all pages!',
      );
    }
    const getSingleSubChapter = page.subChapterId || null;
    if (getSingleSubChapter !== subChapterId) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'SubChapterId must be same for all pages!',
      );
    }
  });
  // check if book page exist with value
  const isExits = await prisma.bookPage.findMany({
    where: {
      bookId: payload[0].bookId,
      page: {
        in: payload.map(page => page.page),
      },
      chapterId: payload[0].chapterId || null,
      subChapterId: payload[0].subChapterId || null,
    },
  });
  if (isExits.length) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Book Page already exist with this value!' +
        "page no's:" +
        isExits.map(page => page.page).join(', '),
    );
  }
  const newBookPage = await prisma.bookPage.createMany({ data: payload });
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
const getSingleBookPageByName = async (
  id: string,
): Promise<BookPage | null> => {
  console.log(id);
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
  const isExists = await prisma.bookPage.findUnique({ where: { id } });
  if (!isExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'BookPage not found!');
  }
  if (payload.page && payload.page !== isExists.page) {
    return await prisma.$transaction(async tx => {
      await tx.bookPage.updateMany({
        where: {
          bookId: isExists.bookId,
          chapterId: isExists.chapterId,
          subChapterId: isExists.subChapterId,
          page: { gte: payload.page },
        },
        data: { page: { increment: 1 } },
      });
      return await tx.bookPage.update({
        where: { id },
        data: { page: payload.page },
      });
    });
  }
  const result = await prisma.bookPage.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteBookPage = async (id: string): Promise<BookPage | null> => {
  return await prisma.$transaction(async prisma => {
    // Find the page to delete
    const pageToDelete = await prisma.bookPage.findUnique({
      where: { id },
    });

    if (!pageToDelete) {
      throw new ApiError(httpStatus.NOT_FOUND, 'BookPage not found!');
    }

    const { page, bookId, chapterId, subChapterId } = pageToDelete;

    // Delete the specified BookPage
    const deletedPage = await prisma.bookPage.delete({
      where: { id },
    });

    // Update the page numbers of subsequent pages
    await prisma.bookPage.updateMany({
      where: {
        bookId, // Ensure it belongs to the same book
        chapterId, // Optional: Ensure it's within the same chapter
        subChapterId, // Optional: Ensure it's within the same sub-chapter
        page: { gt: page }, // Update only pages after the deleted one
      },
      data: {
        page: { decrement: 1 }, // Decrement the page number by 1
      },
    });

    return deletedPage;
  });
};

const bulkDeleteBookPage = async (ids: string[]): Promise<BookPage[]> => {
  return await prisma.$transaction(async prisma => {
    // Find all pages to delete
    const pagesToDelete = await prisma.bookPage.findMany({
      where: { id: { in: ids } },
    });

    if (!pagesToDelete.length) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'No BookPages found for the provided IDs!',
      );
    }

    // Delete the specified BookPages
    const deletedPages = await prisma.bookPage.deleteMany({
      where: { id: { in: ids } },
    });

    // Group pages by bookId, chapterId, and subChapterId to update independently
    const updates = pagesToDelete.reduce(
      (acc, page) => {
        const key = `${page.bookId}-${page.chapterId || 'null'}-${page.subChapterId || 'null'}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(page);
        return acc;
      },
      {} as Record<string, BookPage[]>,
    );

    // For each group, update subsequent page numbers
    for (const [key, pages] of Object.entries(updates)) {
      const { bookId, chapterId, subChapterId } = pages[0];
      const lowestPage = Math.min(...pages.map(p => p.page));

      await prisma.bookPage.updateMany({
        where: {
          bookId,
          chapterId: chapterId || null, // Handle null values
          subChapterId: subChapterId || null,
          page: { gt: lowestPage },
        },
        data: {
          page: { decrement: pages.length }, // Decrement page numbers by the number of deleted pages
        },
      });
    }

    return pagesToDelete; // Return the deleted pages
  });
};

export const BookPageService = {
  getAllBookPage,
  createBookPage,
  updateBookPage,
  getSingleBookPage,
  deleteBookPage,
  bulkCreateBookPage,
  bulkDeleteBookPage,
  getSingleBookPageByName,
};
