import { Book } from '@prisma/client';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { bookFilterAbleFields } from './book.constant';
import { IRelatedBook, IRelatedBookType } from './book.interface';
import { BookService } from './book.service';

const createBook: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const BookData = req.body;

    const result = await BookService.createBook(BookData);
    sendResponse<Book>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Book Created successfully!',
      data: result,
    });
  },
);

const getAllBook = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['searchTerm', ...bookFilterAbleFields]);
  const paginationOptions = pick(req.query, paginationFields);
  const isShort = req.query.isShort as string;
  const result = await BookService.getAllBook(
    filters,
    paginationOptions,
    Boolean(isShort === 'true'),
  );

  sendResponse<Partial<Book>[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book retrieved successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleBook: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await BookService.getSingleBook(id);

    sendResponse<Book>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Book retrieved  successfully!',
      data: result,
    });
  },
);
const getSingleBookByName: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const name = req.params.name;

    const result = await BookService.getSingleBookByName(name);
    console.log(result);
    sendResponse<Book>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Book retrieved  successfully!',
      data: result,
    });
  },
);
const getContentStructure: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const name = req.query.name as string;
    const id = req.query.id as string;
    const isActive = req.query.isActive as string;

    const result = await BookService.getContentStructure({
      id,
      name,
      isActive,
    });

    sendResponse<Partial<Book>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Book retrieved  successfully!',
      data: result,
    });
  },
);

const updateBook: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateAbleData = req.body;

    const result = await BookService.updateBook(id, updateAbleData);

    sendResponse<Book>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Book Updated successfully!',
      data: result,
    });
  },
);
const updateBookShareCount: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateAbleData = req.body;

    const result = await BookService.updateBookShareCount(id);

    sendResponse<{ count: number }>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Book share count Updated successfully!',
      data: {
        count: result?.totalShare || 0,
      },
    });
  },
);
const deleteBook: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await BookService.deleteBook(id);

    sendResponse<Book>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Book deleted successfully!',
      data: result,
    });
  },
);
const getBooksBySearchText: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const searchText = req.query.searchText as string;
    const result = await BookService.getBooksBySearchText(searchText);
    sendResponse<Partial<Book>[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Book Names retrieved successfully!',
      data: result,
    });
  },
);
const getRelatedBookByName: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const name = req.query.name as string;
    const type = req.query.type as IRelatedBookType;

    const result = await BookService.getRelatedBookByName(name, type);
    sendResponse<IRelatedBook[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Book retrieved  successfully!',
      data: result,
    });
  },
);
export const BookController = {
  getAllBook,
  createBook,
  updateBook,
  getSingleBook,
  deleteBook,
  getSingleBookByName,
  updateBookShareCount,
  getContentStructure,
  getRelatedBookByName,
  getBooksBySearchText,
};
