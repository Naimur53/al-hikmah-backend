import { Publisher } from '@prisma/client';
        import { Request, Response } from 'express';
        import { RequestHandler } from 'express-serve-static-core';
        import httpStatus from 'http-status';
        import { paginationFields } from '../../../constants/pagination';
        import catchAsync from '../../../shared/catchAsync';
        import pick from '../../../shared/pick';
        import sendResponse from '../../../shared/sendResponse';
        import { PublisherService } from './publisher.service';
        import { publisherFilterAbleFields } from './publisher.constant';
        const createPublisher: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const PublisherData = req.body;
        
            const result = await PublisherService.createPublisher(
              PublisherData
            );
            sendResponse<Publisher>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Publisher Created successfully!',
              data: result,
            });
          }
        );
        
        const getAllPublisher = catchAsync(
          async (req: Request, res: Response) => {
            const filters = pick(req.query, [
              'searchTerm',
              ...publisherFilterAbleFields,
            ]);
            const paginationOptions = pick(req.query, paginationFields);
        
            const result = await PublisherService.getAllPublisher(
              filters,
              paginationOptions
            );
        
            sendResponse<Publisher[]>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Publisher retrieved successfully !',
              meta: result.meta,
              data: result.data,
            });
          }
        );
        
        const getSinglePublisher: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
        
            const result = await PublisherService.getSinglePublisher(id);
        
            sendResponse<Publisher>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Publisher retrieved  successfully!',
              data: result,
            });
          }
        );
        
        const updatePublisher: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
            const updateAbleData = req.body;
        
            const result = await PublisherService.updatePublisher(
              id,
              updateAbleData
            );
        
            sendResponse<Publisher>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Publisher Updated successfully!',
              data: result,
            });
          }
        );
        const deletePublisher: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
        
            const result = await PublisherService.deletePublisher(id);
        
            sendResponse<Publisher>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Publisher deleted successfully!',
              data: result,
            });
          }
        );
        
        export const PublisherController = {
          getAllPublisher,
          createPublisher,
          updatePublisher,
          getSinglePublisher,
          deletePublisher,
        };