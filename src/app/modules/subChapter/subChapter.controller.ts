import { SubChapter } from '@prisma/client';
        import { Request, Response } from 'express';
        import { RequestHandler } from 'express-serve-static-core';
        import httpStatus from 'http-status';
        import { paginationFields } from '../../../constants/pagination';
        import catchAsync from '../../../shared/catchAsync';
        import pick from '../../../shared/pick';
        import sendResponse from '../../../shared/sendResponse';
        import { SubChapterService } from './subChapter.service';
        import { subChapterFilterAbleFields } from './subChapter.constant';
        const createSubChapter: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const SubChapterData = req.body;
        
            const result = await SubChapterService.createSubChapter(
              SubChapterData
            );
            sendResponse<SubChapter>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'SubChapter Created successfully!',
              data: result,
            });
          }
        );
        
        const getAllSubChapter = catchAsync(
          async (req: Request, res: Response) => {
            const filters = pick(req.query, [
              'searchTerm',
              ...subChapterFilterAbleFields,
            ]);
            const paginationOptions = pick(req.query, paginationFields);
        
            const result = await SubChapterService.getAllSubChapter(
              filters,
              paginationOptions
            );
        
            sendResponse<SubChapter[]>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'SubChapter retrieved successfully !',
              meta: result.meta,
              data: result.data,
            });
          }
        );
        
        const getSingleSubChapter: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
        
            const result = await SubChapterService.getSingleSubChapter(id);
        
            sendResponse<SubChapter>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'SubChapter retrieved  successfully!',
              data: result,
            });
          }
        );
        
        const updateSubChapter: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
            const updateAbleData = req.body;
        
            const result = await SubChapterService.updateSubChapter(
              id,
              updateAbleData
            );
        
            sendResponse<SubChapter>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'SubChapter Updated successfully!',
              data: result,
            });
          }
        );
        const deleteSubChapter: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
        
            const result = await SubChapterService.deleteSubChapter(id);
        
            sendResponse<SubChapter>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'SubChapter deleted successfully!',
              data: result,
            });
          }
        );
        
        export const SubChapterController = {
          getAllSubChapter,
          createSubChapter,
          updateSubChapter,
          getSingleSubChapter,
          deleteSubChapter,
        };