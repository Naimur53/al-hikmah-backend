import { User, Prisma } from '@prisma/client';
        import httpStatus from 'http-status';
        import ApiError from '../../../errors/ApiError';
        import { paginationHelpers } from '../../../helpers/paginationHelper';
        import { IGenericResponse } from '../../../interfaces/common';
        import { IPaginationOptions } from '../../../interfaces/pagination';
        import prisma from '../../../shared/prisma';
        import { userSearchableFields } from './user.constant';
        import { IUserFilters } from './user.interface';
        
        const getAllUser = async (
          filters: IUserFilters,
          paginationOptions: IPaginationOptions
        ): Promise<IGenericResponse<User[]>> => {
          const { page, limit, skip } =
            paginationHelpers.calculatePagination(paginationOptions);
        
          const { searchTerm, ...filterData } = filters;
        
          const andCondition = [];
        
          if (searchTerm) {
            const searchAbleFields = userSearchableFields.map(single => {
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
        
          const whereConditions: Prisma.UserWhereInput =
            andCondition.length > 0 ? { AND: andCondition } : {};
        
          const result = await prisma.user.findMany({
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
          const total = await prisma.user.count();
          const output = {
            data: result,
            meta: { page, limit, total },
          };
          return output;
        };
        
        const createUser = async (
          payload: User
        ): Promise<User | null> => {
          const newUser = await prisma.user.create({
            data: payload,
          });
          return newUser;
        };
        
        const getSingleUser = async (
          id: string
        ): Promise<User | null> => {
          const result = await prisma.user.findUnique({
            where: {
              id,
            },
          });
          return result;
        };
        
        const updateUser = async (
          id: string,
          payload: Partial<User>
        ): Promise<User | null> => {
          const result = await prisma.user.update({
            where: {
              id,
            },
            data: payload,
          });
          return result;
        };
        
        const deleteUser = async (
          id: string
        ): Promise<User | null> => {
          const result = await prisma.user.delete({
            where: { id },
          });
          if (!result) {
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
          }
          return result;
        };
        
        export const UserService = {
          getAllUser,
          createUser,
          updateUser,
          getSingleUser,
          deleteUser,
        };