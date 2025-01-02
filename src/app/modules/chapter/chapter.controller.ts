import { Chapter } from '@prisma/client';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { chapterFilterAbleFields } from './chapter.constant';
import { ChapterService } from './chapter.service';
const createChapter: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const ChapterData = req.body;

    const result = await ChapterService.createChapter(ChapterData);
    sendResponse<Chapter>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Chapter Created successfully!',
      data: result,
    });
  },
);

const getAllChapter = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['searchTerm', ...chapterFilterAbleFields]);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await ChapterService.getAllChapter(filters, paginationOptions);

  sendResponse<Partial<Chapter>[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Chapter retrieved successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleChapter: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await ChapterService.getSingleChapter(id);

    sendResponse<Chapter>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Chapter retrieved  successfully!',
      data: result,
    });
  },
);

const updateChapter: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateAbleData = req.body;

    const result = await ChapterService.updateChapter(id, updateAbleData);

    sendResponse<Chapter>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Chapter Updated successfully!',
      data: result,
    });
  },
);
const deleteChapter: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await ChapterService.deleteChapter(id);

    sendResponse<Chapter>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Chapter deleted successfully!',
      data: result,
    });
  },
);

export const ChapterController = {
  getAllChapter,
  createChapter,
  updateChapter,
  getSingleChapter,
  deleteChapter,
};
