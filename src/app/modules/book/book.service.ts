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
          paginationOptions: IPaginationOptions
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
          });
          const total = await prisma.book.count();
          const output = {
            data: result,
            meta: { page, limit, total },
          };
          return output;
        };
        
        const createBook = async (
          payload: Book
        ): Promise<Book | null> => {
          const newBook = await prisma.book.create({
            data: payload,
          });
          return newBook;
        };
        
        const getSingleBook = async (
          id: string
        ): Promise<Book | null> => {
          const result = await prisma.book.findUnique({
            where: {
              id,
            },
          });
          return result;
        };
        
        const updateBook = async (
          id: string,
          payload: Partial<Book>
        ): Promise<Book | null> => {
          const result = await prisma.book.update({
            where: {
              id,
            },
            data: payload,
          });
          return result;
        };
        
        const deleteBook = async (
          id: string
        ): Promise<Book | null> => {
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