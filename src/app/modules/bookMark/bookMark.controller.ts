import { BookMark } from '@prisma/client';
          import { Request, Response } from 'express';
          import { RequestHandler } from 'express-serve-static-core';
          import httpStatus from 'http-status';
          import { paginationFields } from '../../../constants/pagination';
          import catchAsync from '../../../shared/catchAsync';
          import pick from '../../../shared/pick';
          import sendResponse from '../../../shared/sendResponse';
          import { BookMarkService } from './bookMark.service';
          import { bookMarkFilterAbleFields } from './bookMark.constant';
          const createBookMark: RequestHandler = catchAsync(
            async (req: Request, res: Response) => {
              const BookMarkData = req.body;
          
              const result = await BookMarkService.createBookMark(
                BookMarkData
              );
              sendResponse<BookMark>(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: 'BookMark Created successfully!',
                data: result,
              });
            }
          );
          
          
  const getAllBookMark = catchAsync(
            async (req: Request, res: Response) => {
              const filters = pick(req.query, [
                'searchTerm',
                ...bookMarkFilterAbleFields,
              ]);
              const paginationOptions = pick(req.query, paginationFields);
          
              const result = await BookMarkService.getAllBookMark(
                filters,
                paginationOptions
              );
          
              sendResponse<BookMark[]>(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: 'BookMark retrieved successfully !',
                meta: result.meta,
                data: result.data,
              });
            }
          );
  
          
          const getSingleBookMark: RequestHandler = catchAsync(
            async (req: Request, res: Response) => {
              const id = req.params.id;
          
              const result = await BookMarkService.getSingleBookMark(id);
          
              sendResponse<BookMark>(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: 'BookMark retrieved  successfully!',
                data: result,
              });
            }
          );
          
          const updateBookMark: RequestHandler = catchAsync(
            async (req: Request, res: Response) => {
              const id = req.params.id;
              const updateAbleData = req.body;
          
              const result = await BookMarkService.updateBookMark(
                id,
                updateAbleData
              );
          
              sendResponse<BookMark>(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: 'BookMark Updated successfully!',
                data: result,
              });
            }
          );
          const deleteBookMark: RequestHandler = catchAsync(
            async (req: Request, res: Response) => {
              const id = req.params.id;
          
              const result = await BookMarkService.deleteBookMark(id);
          
              sendResponse<BookMark>(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: 'BookMark deleted successfully!',
                data: result,
              });
            }
          );
          
          export const BookMarkController = {
            getAllBookMark,
            createBookMark,
            updateBookMark,
            getSingleBookMark,
            deleteBookMark,
          };