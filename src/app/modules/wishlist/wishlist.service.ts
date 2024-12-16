import { Wishlist, Prisma } from '@prisma/client';
        import httpStatus from 'http-status';
        import ApiError from '../../../errors/ApiError';
        import { paginationHelpers } from '../../../helpers/paginationHelper';
        import { IGenericResponse } from '../../../interfaces/common';
        import { IPaginationOptions } from '../../../interfaces/pagination';
        import prisma from '../../../shared/prisma';
        import { wishlistSearchableFields } from './wishlist.constant';
        import { IWishlistFilters } from './wishlist.interface';
        
        const getAllWishlist = async (
          filters: IWishlistFilters,
          paginationOptions: IPaginationOptions
        ): Promise<IGenericResponse<Wishlist[]>> => {
          const { page, limit, skip } =
            paginationHelpers.calculatePagination(paginationOptions);
        
          const { searchTerm, ...filterData } = filters;
        
          const andCondition = [];
        
          if (searchTerm) {
            const searchAbleFields = wishlistSearchableFields.map(single => {
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
        
          const whereConditions: Prisma.WishlistWhereInput =
            andCondition.length > 0 ? { AND: andCondition } : {};
        
          const result = await prisma.wishlist.findMany({
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
          const total = await prisma.wishlist.count();
          const output = {
            data: result,
            meta: { page, limit, total },
          };
          return output;
        };
        
        const createWishlist = async (
          payload: Wishlist
        ): Promise<Wishlist | null> => {
          const newWishlist = await prisma.wishlist.create({
            data: payload,
          });
          return newWishlist;
        };
        
        const getSingleWishlist = async (
          id: string
        ): Promise<Wishlist | null> => {
          const result = await prisma.wishlist.findUnique({
            where: {
              id,
            },
          });
          return result;
        };
        
        const updateWishlist = async (
          id: string,
          payload: Partial<Wishlist>
        ): Promise<Wishlist | null> => {
          const result = await prisma.wishlist.update({
            where: {
              id,
            },
            data: payload,
          });
          return result;
        };
        
        const deleteWishlist = async (
          id: string
        ): Promise<Wishlist | null> => {
          const result = await prisma.wishlist.delete({
            where: { id },
          });
          if (!result) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Wishlist not found!');
          }
          return result;
        };
        
        export const WishlistService = {
          getAllWishlist,
          createWishlist,
          updateWishlist,
          getSingleWishlist,
          deleteWishlist,
        };