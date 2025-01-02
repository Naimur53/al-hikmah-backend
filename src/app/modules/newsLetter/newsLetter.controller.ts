import { NewsLetter } from '@prisma/client';
          import { Request, Response } from 'express';
          import { RequestHandler } from 'express-serve-static-core';
          import httpStatus from 'http-status';
          import { paginationFields } from '../../../constants/pagination';
          import catchAsync from '../../../shared/catchAsync';
          import pick from '../../../shared/pick';
          import sendResponse from '../../../shared/sendResponse';
          import { NewsLetterService } from './newsLetter.service';
          import { newsLetterFilterAbleFields } from './newsLetter.constant';
          const createNewsLetter: RequestHandler = catchAsync(
            async (req: Request, res: Response) => {
              const NewsLetterData = req.body;
          
              const result = await NewsLetterService.createNewsLetter(
                NewsLetterData
              );
              sendResponse<NewsLetter>(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: 'NewsLetter Created successfully!',
                data: result,
              });
            }
          );
          
          
  const getAllNewsLetter = catchAsync(
            async (req: Request, res: Response) => {
              const filters = pick(req.query, [
                'searchTerm',
                ...newsLetterFilterAbleFields,
              ]);
              const paginationOptions = pick(req.query, paginationFields);
          
              const result = await NewsLetterService.getAllNewsLetter(
                filters,
                paginationOptions
              );
          
              sendResponse<NewsLetter[]>(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: 'NewsLetter retrieved successfully !',
                meta: result.meta,
                data: result.data,
              });
            }
          );
  
          
          const getSingleNewsLetter: RequestHandler = catchAsync(
            async (req: Request, res: Response) => {
              const id = req.params.id;
          
              const result = await NewsLetterService.getSingleNewsLetter(id);
          
              sendResponse<NewsLetter>(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: 'NewsLetter retrieved  successfully!',
                data: result,
              });
            }
          );
          
          const updateNewsLetter: RequestHandler = catchAsync(
            async (req: Request, res: Response) => {
              const id = req.params.id;
              const updateAbleData = req.body;
          
              const result = await NewsLetterService.updateNewsLetter(
                id,
                updateAbleData
              );
          
              sendResponse<NewsLetter>(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: 'NewsLetter Updated successfully!',
                data: result,
              });
            }
          );
          const deleteNewsLetter: RequestHandler = catchAsync(
            async (req: Request, res: Response) => {
              const id = req.params.id;
          
              const result = await NewsLetterService.deleteNewsLetter(id);
          
              sendResponse<NewsLetter>(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: 'NewsLetter deleted successfully!',
                data: result,
              });
            }
          );
          
          export const NewsLetterController = {
            getAllNewsLetter,
            createNewsLetter,
            updateNewsLetter,
            getSingleNewsLetter,
            deleteNewsLetter,
          };