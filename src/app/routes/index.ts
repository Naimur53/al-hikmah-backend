import { AuthorRoutes } from '../modules/author/author.router';
import { BlogRoutes } from '../modules/blog/blog.router';
import { BookRoutes } from '../modules/book/book.router';
import { BookCategoryRoutes } from '../modules/bookCategory/bookCategory.router';
import { ChapterRoutes } from '../modules/chapter/chapter.router';
import { PublisherRoutes } from '../modules/publisher/publisher.router';
import { SubChapterRoutes } from '../modules/subChapter/subChapter.router';
import { UserRoutes } from '../modules/user/user.router';
import { WishlistRoutes } from '../modules/wishlist/wishlist.router';

import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { BookMarkRoutes } from '../modules/bookMark/bookMark.router';
import { BookPageRoutes } from '../modules/bookPage/bookPage.router';
import { fileUploadRoutes } from '../modules/fileUpload/fileUpload.route';
import { NewsLetterRoutes } from '../modules/newsLetter/newsLetter.router';
const router = express.Router();

const moduleRoutes = [
  // ... routes

  {
    path: '/blog',
    route: BlogRoutes,
  },

  {
    path: '/bookCategory',
    route: BookCategoryRoutes,
  },

  {
    path: '/user',
    route: UserRoutes,
  },

  {
    path: '/book',
    route: BookRoutes,
  },
  {
    path: '/bookMark',
    route: BookMarkRoutes,
  },

  {
    path: '/author',
    route: AuthorRoutes,
  },

  {
    path: '/publisher',
    route: PublisherRoutes,
  },

  {
    path: '/chapter',
    route: ChapterRoutes,
  },

  {
    path: '/subChapter',
    route: SubChapterRoutes,
  },
  {
    path: '/newsLetter',
    route: NewsLetterRoutes,
  },

  {
    path: '/wishlist',
    route: WishlistRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/bookPage',
    route: BookPageRoutes,
  },
  {
    path: '/file-upload',
    route: fileUploadRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
