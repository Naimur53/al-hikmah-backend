import { Author } from '@prisma/client';
        import { Request, Response } from 'express';
        import { RequestHandler } from 'express-serve-static-core';
        import httpStatus from 'http-status';
        import { paginationFields } from '../../../constants/pagination';
        import catchAsync from '../../../shared/catchAsync';
        import pick from '../../../shared/pick';
        import sendResponse from '../../../shared/sendResponse';
        import { AuthorService } from './author.service';
        import { authorFilterAbleFields } from './author.constant';
        const createAuthor: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const AuthorData = req.body;
        
            const result = await AuthorService.createAuthor(
              AuthorData
            );
            sendResponse<Author>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Author Created successfully!',
              data: result,
            });
          }
        );
        
        const getAllAuthor = catchAsync(
          async (req: Request, res: Response) => {
            const filters = pick(req.query, [
              'searchTerm',
              ...authorFilterAbleFields,
            ]);
            const paginationOptions = pick(req.query, paginationFields);
        
            const result = await AuthorService.getAllAuthor(
              filters,
              paginationOptions
            );
        
            sendResponse<Author[]>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Author retrieved successfully !',
              meta: result.meta,
              data: result.data,
            });
          }
        );
        
        const getSingleAuthor: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
        
            const result = await AuthorService.getSingleAuthor(id);
        
            sendResponse<Author>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Author retrieved  successfully!',
              data: result,
            });
          }
        );
        
        const updateAuthor: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
            const updateAbleData = req.body;
        
            const result = await AuthorService.updateAuthor(
              id,
              updateAbleData
            );
        
            sendResponse<Author>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Author Updated successfully!',
              data: result,
            });
          }
        );
        const deleteAuthor: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
        
            const result = await AuthorService.deleteAuthor(id);
        
            sendResponse<Author>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Author deleted successfully!',
              data: result,
            });
          }
        );
        
        export const AuthorController = {
          getAllAuthor,
          createAuthor,
          updateAuthor,
          getSingleAuthor,
          deleteAuthor,
        };