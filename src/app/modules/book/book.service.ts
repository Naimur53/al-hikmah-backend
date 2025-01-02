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
): Promise<IGenericResponse<Partial<Book>[]>> => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, author, publisher, category, ...filterData } = filters;

  const andCondition = [];
  const theOrCondition = [];
  console.log(filterData);
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
    theOrCondition.push(...searchAbleFields);
  }

  if (author || publisher || category) {
    if (author) {
      theOrCondition.push(
        ...author.split(',').map((id: string) => {
          return {
            author: {
              name: {
                equals: id,
              },
            },
          };
        }),
      );
    }
    if (publisher) {
      theOrCondition.push(
        ...publisher.split(',').map((id: string) => {
          return {
            publisher: {
              name: {
                equals: id,
              },
            },
          };
        }),
      );
    }
    if (category) {
      theOrCondition.push(
        ...category.split(',').map((id: string) => {
          return {
            category: {
              name: {
                equals: id,
              },
            },
          };
        }),
      );
    }
  }
  if (theOrCondition.length > 0) {
    andCondition.push({ OR: theOrCondition });
  }
  if (Object.keys(filters).length) {
    andCondition.push({
      AND: Object.keys(filterData).map(key => {
        return {
          [key]: {
            equals:
              key === 'isActive' || key === 'isFeatured'
                ? JSON.parse((filterData as any)[key])
                : (filterData as any)[key],
          },
        };
      }),
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
    // include: { author: true, publisher: true, category: true },
  });

  const total = await prisma.book.count({ where: whereConditions });
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
      docLink: true,
      isActive: true,
      pdfLink: true,
      author: true,
      publisher: true,
      category: true,
      authorId: true,
      publisherId: true,
      totalRead: true,
      pdfViewLink: true,
      categoryId: true,
      chapters: {
        orderBy: {
          chapterNo: 'asc',
        },
        select: {
          id: true,
          title: true,
          bookId: true,
          description: true,
          createdAt: true,
          chapterNo: true,
          updatedAt: true,
          subChapters: {
            orderBy: {
              subChapterNo: 'asc',
            },
            select: {
              id: true,
              description: true,
              title: true,
              chapterId: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      },
    },
  });
  return result;
};
const getSingleBookByName = async (name: string): Promise<Book | null> => {
  console.log(name, name.split('-').join(' '));
  const result = await prisma.book.findUnique({
    where: {
      name: name.includes('-') ? name.split('-').join(' ') : name,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      banglaName: true,
      isFeatured: true,
      description: true,
      keywords: true,
      photo: true,
      createdAt: true,
      updatedAt: true,
      docLink: true,
      isActive: true,
      pdfLink: true,
      author: true,
      publisher: true,
      category: true,
      authorId: true,
      publisherId: true,
      totalRead: true,
      pdfViewLink: true,
      totalShare: true,
      categoryId: true,
      chapters: {
        orderBy: {
          chapterNo: 'asc',
        },
        select: {
          id: true,
          title: true,
          bookId: true,
          description: true,
          createdAt: true,
          chapterNo: true,
          updatedAt: true,
          subChapters: {
            orderBy: {
              subChapterNo: 'asc',
            },
            select: {
              id: true,
              description: true,
              title: true,
              chapterId: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      },
    },
  });
  console.log(result);
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
const updateBookShareCount = async (id: string): Promise<Book | null> => {
  const result = await prisma.book.update({
    where: {
      id,
    },
    data: {
      totalShare: {
        increment: 1,
      },
    },
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
  updateBookShareCount,
  getSingleBookByName,
};
