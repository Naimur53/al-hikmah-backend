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
          paginationOptions: IPaginationOptions
        ): Promise<IGenericResponse<Chapter[]>> => {
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
                    createdAt: 'desc',
                  },
          });
          const total = await prisma.chapter.count();
          const output = {
            data: result,
            meta: { page, limit, total },
          };
          return output;
        };
        
        const createChapter = async (
          payload: Chapter
        ): Promise<Chapter | null> => {
          const newChapter = await prisma.chapter.create({
            data: payload,
          });
          return newChapter;
        };
        
        const getSingleChapter = async (
          id: string
        ): Promise<Chapter | null> => {
          const result = await prisma.chapter.findUnique({
            where: {
              id,
            },
          });
          return result;
        };
        
        const updateChapter = async (
          id: string,
          payload: Partial<Chapter>
        ): Promise<Chapter | null> => {
          const result = await prisma.chapter.update({
            where: {
              id,
            },
            data: payload,
          });
          return result;
        };
        
        const deleteChapter = async (
          id: string
        ): Promise<Chapter | null> => {
          const result = await prisma.chapter.delete({
            where: { id },
          });
          if (!result) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Chapter not found!');
          }
          return result;
        };
        
        export const ChapterService = {
          getAllChapter,
          createChapter,
          updateChapter,
          getSingleChapter,
          deleteChapter,
        };