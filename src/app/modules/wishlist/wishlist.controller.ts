import { Wishlist } from '@prisma/client';
        import { Request, Response } from 'express';
        import { RequestHandler } from 'express-serve-static-core';
        import httpStatus from 'http-status';
        import { paginationFields } from '../../../constants/pagination';
        import catchAsync from '../../../shared/catchAsync';
        import pick from '../../../shared/pick';
        import sendResponse from '../../../shared/sendResponse';
        import { WishlistService } from './wishlist.service';
        import { wishlistFilterAbleFields } from './wishlist.constant';
        const createWishlist: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const WishlistData = req.body;
        
            const result = await WishlistService.createWishlist(
              WishlistData
            );
            sendResponse<Wishlist>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Wishlist Created successfully!',
              data: result,
            });
          }
        );
        
        const getAllWishlist = catchAsync(
          async (req: Request, res: Response) => {
            const filters = pick(req.query, [
              'searchTerm',
              ...wishlistFilterAbleFields,
            ]);
            const paginationOptions = pick(req.query, paginationFields);
        
            const result = await WishlistService.getAllWishlist(
              filters,
              paginationOptions
            );
        
            sendResponse<Wishlist[]>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Wishlist retrieved successfully !',
              meta: result.meta,
              data: result.data,
            });
          }
        );
        
        const getSingleWishlist: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
        
            const result = await WishlistService.getSingleWishlist(id);
        
            sendResponse<Wishlist>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Wishlist retrieved  successfully!',
              data: result,
            });
          }
        );
        
        const updateWishlist: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
            const updateAbleData = req.body;
        
            const result = await WishlistService.updateWishlist(
              id,
              updateAbleData
            );
        
            sendResponse<Wishlist>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Wishlist Updated successfully!',
              data: result,
            });
          }
        );
        const deleteWishlist: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
        
            const result = await WishlistService.deleteWishlist(id);
        
            sendResponse<Wishlist>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Wishlist deleted successfully!',
              data: result,
            });
          }
        );
        
        export const WishlistController = {
          getAllWishlist,
          createWishlist,
          updateWishlist,
          getSingleWishlist,
          deleteWishlist,
        };