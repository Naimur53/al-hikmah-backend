import { Blog, Prisma } from '@prisma/client';
        import httpStatus from 'http-status';
        import ApiError from '../../../errors/ApiError';
        import { paginationHelpers } from '../../../helpers/paginationHelper';
        import { IGenericResponse } from '../../../interfaces/common';
        import { IPaginationOptions } from '../../../interfaces/pagination';
        import prisma from '../../../shared/prisma';
        import { blogSearchableFields } from './blog.constant';
        import { IBlogFilters } from './blog.interface';
        
        const getAllBlog = async (
          filters: IBlogFilters,
          paginationOptions: IPaginationOptions
        ): Promise<IGenericResponse<Blog[]>> => {
          const { page, limit, skip } =
            paginationHelpers.calculatePagination(paginationOptions);
        
          const { searchTerm, ...filterData } = filters;
        
          const andCondition = [];
        
          if (searchTerm) {
            const searchAbleFields = blogSearchableFields.map(single => {
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
        
          const whereConditions: Prisma.BlogWhereInput =
            andCondition.length > 0 ? { AND: andCondition } : {};
        
          const result = await prisma.blog.findMany({
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
          const total = await prisma.blog.count();
          const output = {
            data: result,
            meta: { page, limit, total },
          };
          return output;
        };
        
        const createBlog = async (
          payload: Blog
        ): Promise<Blog | null> => {
          const newBlog = await prisma.blog.create({
            data: payload,
          });
          return newBlog;
        };
        
        const getSingleBlog = async (
          id: string
        ): Promise<Blog | null> => {
          const result = await prisma.blog.findUnique({
            where: {
              id,
            },
          });
          return result;
        };
        
        const updateBlog = async (
          id: string,
          payload: Partial<Blog>
        ): Promise<Blog | null> => {
          const result = await prisma.blog.update({
            where: {
              id,
            },
            data: payload,
          });
          return result;
        };
        
        const deleteBlog = async (
          id: string
        ): Promise<Blog | null> => {
          const result = await prisma.blog.delete({
            where: { id },
          });
          if (!result) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Blog not found!');
          }
          return result;
        };
        
        export const BlogService = {
          getAllBlog,
          createBlog,
          updateBlog,
          getSingleBlog,
          deleteBlog,
        };