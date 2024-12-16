import { BookCategory } from '@prisma/client';
        import { Request, Response } from 'express';
        import { RequestHandler } from 'express-serve-static-core';
        import httpStatus from 'http-status';
        import { paginationFields } from '../../../constants/pagination';
        import catchAsync from '../../../shared/catchAsync';
        import pick from '../../../shared/pick';
        import sendResponse from '../../../shared/sendResponse';
        import { BookCategoryService } from './bookCategory.service';
        import { bookCategoryFilterAbleFields } from './bookCategory.constant';
        const createBookCategory: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const BookCategoryData = req.body;
        
            const result = await BookCategoryService.createBookCategory(
              BookCategoryData
            );
            sendResponse<BookCategory>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'BookCategory Created successfully!',
              data: result,
            });
          }
        );
        
        const getAllBookCategory = catchAsync(
          async (req: Request, res: Response) => {
            const filters = pick(req.query, [
              'searchTerm',
              ...bookCategoryFilterAbleFields,
            ]);
            const paginationOptions = pick(req.query, paginationFields);
        
            const result = await BookCategoryService.getAllBookCategory(
              filters,
              paginationOptions
            );
        
            sendResponse<BookCategory[]>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'BookCategory retrieved successfully !',
              meta: result.meta,
              data: result.data,
            });
          }
        );
        
        const getSingleBookCategory: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
        
            const result = await BookCategoryService.getSingleBookCategory(id);
        
            sendResponse<BookCategory>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'BookCategory retrieved  successfully!',
              data: result,
            });
          }
        );
        
        const updateBookCategory: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
            const updateAbleData = req.body;
        
            const result = await BookCategoryService.updateBookCategory(
              id,
              updateAbleData
            );
        
            sendResponse<BookCategory>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'BookCategory Updated successfully!',
              data: result,
            });
          }
        );
        const deleteBookCategory: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
        
            const result = await BookCategoryService.deleteBookCategory(id);
        
            sendResponse<BookCategory>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'BookCategory deleted successfully!',
              data: result,
            });
          }
        );
        
        export const BookCategoryController = {
          getAllBookCategory,
          createBookCategory,
          updateBookCategory,
          getSingleBookCategory,
          deleteBookCategory,
        };