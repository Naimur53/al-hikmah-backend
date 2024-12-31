"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const author_router_1 = require("../modules/author/author.router");
const blog_router_1 = require("../modules/blog/blog.router");
const book_router_1 = require("../modules/book/book.router");
const bookCategory_router_1 = require("../modules/bookCategory/bookCategory.router");
const chapter_router_1 = require("../modules/chapter/chapter.router");
const publisher_router_1 = require("../modules/publisher/publisher.router");
const subChapter_router_1 = require("../modules/subChapter/subChapter.router");
const user_router_1 = require("../modules/user/user.router");
const wishlist_router_1 = require("../modules/wishlist/wishlist.router");
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/auth/auth.route");
const bookPage_router_1 = require("../modules/bookPage/bookPage.router");
const router = express_1.default.Router();
const moduleRoutes = [
    // ... routes
    {
        path: '/blog',
        route: blog_router_1.BlogRoutes,
    },
    {
        path: '/bookCategory',
        route: bookCategory_router_1.BookCategoryRoutes,
    },
    {
        path: '/user',
        route: user_router_1.UserRoutes,
    },
    {
        path: '/book',
        route: book_router_1.BookRoutes,
    },
    {
        path: '/author',
        route: author_router_1.AuthorRoutes,
    },
    {
        path: '/publisher',
        route: publisher_router_1.PublisherRoutes,
    },
    {
        path: '/chapter',
        route: chapter_router_1.ChapterRoutes,
    },
    {
        path: '/subChapter',
        route: subChapter_router_1.SubChapterRoutes,
    },
    {
        path: '/wishlist',
        route: wishlist_router_1.WishlistRoutes,
    },
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/bookPage',
        route: bookPage_router_1.BookPageRoutes,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
