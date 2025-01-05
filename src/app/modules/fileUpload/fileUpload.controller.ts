import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';

export const uploadImageFile = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'NO image found');
  }
  const fileUrl = `${req.protocol}://${req.get('host')}/uploadedFiles/image/${req.file.filename}`;
  res
    .status(httpStatus.OK)
    .json({ message: 'Image uploaded successfully!', fileUrl });
};

export const uploadDocumentFile = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No document found');
  }
  const fileUrl = `${req.protocol}://${req.get('host')}/uploadedFiles/bookFile/${req.file.filename}`;
  res
    .status(httpStatus.OK)
    .json({ message: 'Document uploaded successfully!', fileUrl });
};
