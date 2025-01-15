import { Book, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { nameToCorrectString } from '../../../utils';
import { bookEvents, EbookEvents } from '../../events/book.events';
import { bookSearchableFields } from './book.constant';
import { IBookFilters, IRelatedBook, IRelatedBookType } from './book.interface';

const getAllBook = async (
  filters: IBookFilters,
  paginationOptions: IPaginationOptions,
  isShort: boolean,
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
              key === 'isActive' || key === 'isFeatured' || key === 'isWishlist'
                ? JSON.parse((filterData as any)[key])
                : (filterData as any)[key],
          },
        };
      }),
    });
  }

  const whereConditions: Prisma.BookWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};
  const large = {
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
  };
  const short = {
    id: true,
    name: true,
    banglaName: true,
    photo: true,
    author: true,
    description: true,
  };
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
    select: isShort ? short : large,
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
      isWishlist: true,
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
  const result = await prisma.book.findUnique({
    where: {
      name: nameToCorrectString(name),
      // isActive: true,
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
      isWishlist: true,
      totalShare: true,
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
  if (result?.id) {
    // increment total read
    bookEvents.emit(EbookEvents.INCREMENT_READ_COUNT, result.id);
  }
  return result;
};

const getContentStructure = async ({
  name,
  id,
  isActive,
}: {
  name?: string;
  id?: string;
  isActive?: string;
}): Promise<Partial<Book> | null> => {
  let query: any = {};
  if (name) {
    query.name = name.includes('-') ? name.split('-').join(' ') : name;
  }
  if (id) {
    query.id = id;
  }
  console.log(query);
  if (isActive === 'false' || isActive === 'true') {
    query.isActive = isActive === 'true' ? true : false;
  }
  if (Object.keys(query).length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid query params');
  }

  const result = await prisma.book.findUnique({
    where: query,
    select: {
      id: true,
      name: true,
      banglaName: true,
      description: true,
      photo: true,
      createdAt: true,
      updatedAt: true,
      docLink: true,
      pdfLink: true,
      pdfViewLink: true,
      bookPages: {
        take: 10,
        where: {
          chapterId: null,
          subChapterId: null,
        },
      },
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

const getBooksBySearchText = async (
  searchText: string,
): Promise<Partial<Book>[] | null> => {
  const result = await prisma.book.findMany({
    take: 10,
    where: {
      OR: [
        { name: { contains: searchText, mode: 'insensitive' } },
        { banglaName: { contains: searchText, mode: 'insensitive' } },
        { keywords: { contains: searchText, mode: 'insensitive' } },
      ],
      AND: [{ isActive: true }],
    },
    select: {
      id: true,
      name: true,
      photo: true,
      banglaName: true,
      author: {
        select: {
          name: true,
        },
      },
      // publisher: {
      //   select: {
      //     name: true,
      //   },
      // },
      // category: {
      //   select: {
      //     name: true,
      //   },
      // },
    },
  });
  return result;
};
// get related book by name
const getRelatedBookByName = async (
  name: string,
  type?: IRelatedBookType,
): Promise<IRelatedBook[] | null> => {
  if (!name) {
    throw new ApiError(httpStatus.BAD_REQUEST, ' name is required!');
  }
  if (type) {
    return await prisma.book.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        OR: [
          type === IRelatedBookType.CATEGORY
            ? { category: { name: nameToCorrectString(name) } }
            : type === IRelatedBookType.AUTHOR
              ? { author: { name: nameToCorrectString(name) } }
              : type === IRelatedBookType.LATEST
                ? { createdAt: { lte: new Date() } }
                : type === IRelatedBookType.FEATURED
                  ? { isFeatured: true }
                  : type === IRelatedBookType.WISHLIST
                    ? { isWishlist: true }
                    : { publisher: { name: nameToCorrectString(name) } },
        ],
      },
      select: {
        id: true,
        name: true,
        photo: true,
        description: true,
        totalRead: true,
        banglaName: true,
      },
    });
  }
  const bookInfo = await prisma.book.findFirst({
    where: { name: nameToCorrectString(name) },
    select: {
      id: true,
      name: true,

      categoryId: true,
      authorId: true,
      publisherId: true,
      keywords: true,
    },
  });

  if (!bookInfo) {
    return await prisma.book.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        photo: true,
        description: true,
        totalRead: true,
        banglaName: true,
      },
    });
  }
  const result = await prisma.book.findMany({
    take: 10,
    where: {
      OR: [
        { categoryId: bookInfo.categoryId },
        { authorId: bookInfo.authorId },
        { publisherId: bookInfo.publisherId },
        ...bookInfo.keywords.split(',').map(single => {
          return {
            keywords: {
              contains: single,
              mode: 'insensitive' as Prisma.QueryMode,
            },
          };
        }),
      ],
      isActive: true,
      NOT: { id: bookInfo.id },
    },
    select: {
      id: true,
      name: true,
      photo: true,
      description: true,
      totalRead: true,
      banglaName: true,
    },
  });
  if (result.length < 1) {
    const randomBook = await prisma.book.findMany({
      where: { isActive: true, NOT: { id: bookInfo.id } },
      take: 10,
      select: {
        id: true,
        name: true,
        photo: true,
        description: true,
        totalRead: true,
        banglaName: true,
      },
    });
    return randomBook;
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
  getContentStructure,
  getRelatedBookByName,
  getBooksBySearchText,
};
