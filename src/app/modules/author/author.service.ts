import { Author, Prisma } from '@prisma/client';
        import httpStatus from 'http-status';
        import ApiError from '../../../errors/ApiError';
        import { paginationHelpers } from '../../../helpers/paginationHelper';
        import { IGenericResponse } from '../../../interfaces/common';
        import { IPaginationOptions } from '../../../interfaces/pagination';
        import prisma from '../../../shared/prisma';
        import { authorSearchableFields } from './author.constant';
        import { IAuthorFilters } from './author.interface';
        
        const getAllAuthor = async (
          filters: IAuthorFilters,
          paginationOptions: IPaginationOptions
        ): Promise<IGenericResponse<Author[]>> => {
          const { page, limit, skip } =
            paginationHelpers.calculatePagination(paginationOptions);
        
          const { searchTerm, ...filterData } = filters;
        
          const andCondition = [];
        
          if (searchTerm) {
            const searchAbleFields = authorSearchableFields.map(single => {
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
        
          const whereConditions: Prisma.AuthorWhereInput =
            andCondition.length > 0 ? { AND: andCondition } : {};
        
          const result = await prisma.author.findMany({
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
          const total = await prisma.author.count();
          const output = {
            data: result,
            meta: { page, limit, total },
          };
          return output;
        };
        
        const createAuthor = async (
          payload: Author
        ): Promise<Author | null> => {
          const newAuthor = await prisma.author.create({
            data: payload,
          });
          return newAuthor;
        };
        
        const getSingleAuthor = async (
          id: string
        ): Promise<Author | null> => {
          const result = await prisma.author.findUnique({
            where: {
              id,
            },
          });
          return result;
        };
        
        const updateAuthor = async (
          id: string,
          payload: Partial<Author>
        ): Promise<Author | null> => {
          const result = await prisma.author.update({
            where: {
              id,
            },
            data: payload,
          });
          return result;
        };
        
        const deleteAuthor = async (
          id: string
        ): Promise<Author | null> => {
          const result = await prisma.author.delete({
            where: { id },
          });
          if (!result) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Author not found!');
          }
          return result;
        };
        
        export const AuthorService = {
          getAllAuthor,
          createAuthor,
          updateAuthor,
          getSingleAuthor,
          deleteAuthor,
        };