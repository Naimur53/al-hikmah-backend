import { SubChapter, Prisma } from '@prisma/client';
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
          paginationOptions: IPaginationOptions
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
                    createdAt: 'desc',
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
          payload: SubChapter
        ): Promise<SubChapter | null> => {
          const newSubChapter = await prisma.subChapter.create({
            data: payload,
          });
          return newSubChapter;
        };
        
        const getSingleSubChapter = async (
          id: string
        ): Promise<SubChapter | null> => {
          const result = await prisma.subChapter.findUnique({
            where: {
              id,
            },
          });
          return result;
        };
        
        const updateSubChapter = async (
          id: string,
          payload: Partial<SubChapter>
        ): Promise<SubChapter | null> => {
          const result = await prisma.subChapter.update({
            where: {
              id,
            },
            data: payload,
          });
          return result;
        };
        
        const deleteSubChapter = async (
          id: string
        ): Promise<SubChapter | null> => {
          const result = await prisma.subChapter.delete({
            where: { id },
          });
          if (!result) {
            throw new ApiError(httpStatus.NOT_FOUND, 'SubChapter not found!');
          }
          return result;
        };
        
        export const SubChapterService = {
          getAllSubChapter,
          createSubChapter,
          updateSubChapter,
          getSingleSubChapter,
          deleteSubChapter,
        };