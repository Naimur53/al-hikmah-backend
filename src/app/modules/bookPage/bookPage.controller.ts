import { BookPage, Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { bookPageFilterAbleFields } from './bookPage.constant';
import { BookPageService } from './bookPage.service';
const createBookPage: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const BookPageData = req.body;

    const result = await BookPageService.createBookPage(BookPageData);
    sendResponse<BookPage>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'BookPage Created successfully!',
      data: result,
    });
  },
);
const bulkCreateBookPage: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const BookPageData = req.body;

    const result = await BookPageService.bulkCreateBookPage(BookPageData);
    sendResponse<Prisma.BatchPayload>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'BookPage Created successfully!',
      data: result,
    });
  },
);

const getAllBookPage = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['searchTerm', ...bookPageFilterAbleFields]);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await BookPageService.getAllBookPage(
    filters,
    paginationOptions,
  );

  sendResponse<BookPage[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'BookPage retrieved successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleBookPage: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await BookPageService.getSingleBookPage(id);

    sendResponse<BookPage>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'BookPage retrieved  successfully!',
      data: result,
    });
  },
);
const getSingleBookPageByName: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const name = req.params.name;

    const result = await BookPageService.getSingleBookPageByName(name);

    sendResponse<BookPage>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'BookPage retrieved  successfully!',
      data: result,
    });
  },
);

const updateBookPage: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateAbleData = req.body;

    const result = await BookPageService.updateBookPage(id, updateAbleData);

    sendResponse<BookPage>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'BookPage Updated successfully!',
      data: result,
    });
  },
);
const deleteBookPage: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await BookPageService.deleteBookPage(id);

    sendResponse<BookPage>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'BookPage deleted successfully!',
      data: result,
    });
  },
);
const bulkDeleteBookPage: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const ids = req.body as string[];

    const result = await BookPageService.bulkDeleteBookPage(ids);

    sendResponse<BookPage[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'BookPage deleted successfully!',
      data: result,
    });
  },
);

export const BookPageController = {
  getAllBookPage,
  createBookPage,
  updateBookPage,
  getSingleBookPage,
  deleteBookPage,
  bulkCreateBookPage,
  bulkDeleteBookPage,
  getSingleBookPageByName,
};
