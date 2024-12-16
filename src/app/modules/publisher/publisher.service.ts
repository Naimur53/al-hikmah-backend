import { Publisher, Prisma } from '@prisma/client';
        import httpStatus from 'http-status';
        import ApiError from '../../../errors/ApiError';
        import { paginationHelpers } from '../../../helpers/paginationHelper';
        import { IGenericResponse } from '../../../interfaces/common';
        import { IPaginationOptions } from '../../../interfaces/pagination';
        import prisma from '../../../shared/prisma';
        import { publisherSearchableFields } from './publisher.constant';
        import { IPublisherFilters } from './publisher.interface';
        
        const getAllPublisher = async (
          filters: IPublisherFilters,
          paginationOptions: IPaginationOptions
        ): Promise<IGenericResponse<Publisher[]>> => {
          const { page, limit, skip } =
            paginationHelpers.calculatePagination(paginationOptions);
        
          const { searchTerm, ...filterData } = filters;
        
          const andCondition = [];
        
          if (searchTerm) {
            const searchAbleFields = publisherSearchableFields.map(single => {
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
        
          const whereConditions: Prisma.PublisherWhereInput =
            andCondition.length > 0 ? { AND: andCondition } : {};
        
          const result = await prisma.publisher.findMany({
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
          const total = await prisma.publisher.count();
          const output = {
            data: result,
            meta: { page, limit, total },
          };
          return output;
        };
        
        const createPublisher = async (
          payload: Publisher
        ): Promise<Publisher | null> => {
          const newPublisher = await prisma.publisher.create({
            data: payload,
          });
          return newPublisher;
        };
        
        const getSinglePublisher = async (
          id: string
        ): Promise<Publisher | null> => {
          const result = await prisma.publisher.findUnique({
            where: {
              id,
            },
          });
          return result;
        };
        
        const updatePublisher = async (
          id: string,
          payload: Partial<Publisher>
        ): Promise<Publisher | null> => {
          const result = await prisma.publisher.update({
            where: {
              id,
            },
            data: payload,
          });
          return result;
        };
        
        const deletePublisher = async (
          id: string
        ): Promise<Publisher | null> => {
          const result = await prisma.publisher.delete({
            where: { id },
          });
          if (!result) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Publisher not found!');
          }
          return result;
        };
        
        export const PublisherService = {
          getAllPublisher,
          createPublisher,
          updatePublisher,
          getSinglePublisher,
          deletePublisher,
        };