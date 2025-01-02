"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const book_constant_1 = require("./book.constant");
const getAllBook = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const { searchTerm, author, publisher, category } = filters, filterData = __rest(filters, ["searchTerm", "author", "publisher", "category"]);
    const andCondition = [];
    const theOrCondition = [];
    console.log(filterData);
    if (searchTerm) {
        const searchAbleFields = book_constant_1.bookSearchableFields.map(single => {
            const query = {
                [single]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            };
            return query;
        });
        theOrCondition.push(...searchAbleFields);
    }
    if (author || publisher || category) {
        if (author) {
            theOrCondition.push(...author.split(',').map((id) => {
                return {
                    author: {
                        name: {
                            equals: id,
                        },
                    },
                };
            }));
        }
        if (publisher) {
            theOrCondition.push(...publisher.split(',').map((id) => {
                return {
                    publisher: {
                        name: {
                            equals: id,
                        },
                    },
                };
            }));
        }
        if (category) {
            theOrCondition.push(...category.split(',').map((id) => {
                return {
                    category: {
                        name: {
                            equals: id,
                        },
                    },
                };
            }));
        }
    }
    if (theOrCondition.length > 0) {
        andCondition.push({ OR: theOrCondition });
    }
    if (Object.keys(filters).length) {
        andCondition.push({
            AND: Object.keys(filterData).map(key => {
                return {
                    [key]: {
                        equals: key === 'isActive' || key === 'isFeatured'
                            ? JSON.parse(filterData[key])
                            : filterData[key],
                    },
                };
            }),
        });
    }
    const whereConditions = andCondition.length > 0 ? { AND: andCondition } : {};
    const result = yield prisma_1.default.book.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: paginationOptions.sortBy && paginationOptions.sortOrder
            ? {
                [paginationOptions.sortBy]: paginationOptions.sortOrder,
            }
            : {
                createdAt: 'desc',
            },
        // include: { author: true, publisher: true, category: true },
    });
    const total = yield prisma_1.default.book.count({ where: whereConditions });
    const output = {
        data: result,
        meta: { page, limit, total },
    };
    return output;
});
const createBook = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check is book exist with name
    const isExits = yield prisma_1.default.book.findUnique({
        where: { name: payload.name },
    });
    if (isExits) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Book name already exist!`);
    }
    // Check if category, author, and publisher exist in parallel
    const [category, author, publisher] = yield Promise.all([
        prisma_1.default.bookCategory.findUnique({ where: { id: payload.categoryId } }),
        prisma_1.default.author.findUnique({ where: { id: payload.authorId } }),
        prisma_1.default.publisher.findUnique({ where: { id: payload.publisherId } }),
    ]);
    // Validate existence of required references
    if (!category) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Book Category not found!`);
    }
    if (!author) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Author not found!`);
    }
    if (!publisher) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Publisher not found!`);
    }
    const newBook = yield prisma_1.default.book.create({
        data: payload,
    });
    return newBook;
});
const getSingleBook = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.book.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            name: true,
            banglaName: true,
            isFeatured: true,
            description: true,
            keywords: true,
            photo: true,
            createdAt: true,
            updatedAt: true,
            docLink: true,
            isActive: true,
            pdfLink: true,
            author: true,
            publisher: true,
            category: true,
            authorId: true,
            publisherId: true,
            totalRead: true,
            pdfViewLink: true,
            categoryId: true,
            chapters: {
                orderBy: {
                    chapterNo: 'asc',
                },
                select: {
                    id: true,
                    title: true,
                    bookId: true,
                    description: true,
                    createdAt: true,
                    chapterNo: true,
                    updatedAt: true,
                    subChapters: {
                        orderBy: {
                            subChapterNo: 'asc',
                        },
                        select: {
                            id: true,
                            description: true,
                            title: true,
                            chapterId: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                },
            },
        },
    });
    return result;
});
const getSingleBookByName = (name) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(name, name.split('-').join(' '));
    const result = yield prisma_1.default.book.findUnique({
        where: {
            name: name.includes('-') ? name.split('-').join(' ') : name,
            isActive: true,
        },
        select: {
            id: true,
            name: true,
            banglaName: true,
            isFeatured: true,
            description: true,
            keywords: true,
            photo: true,
            createdAt: true,
            updatedAt: true,
            docLink: true,
            isActive: true,
            pdfLink: true,
            author: true,
            publisher: true,
            category: true,
            authorId: true,
            publisherId: true,
            totalRead: true,
            pdfViewLink: true,
            categoryId: true,
            chapters: {
                orderBy: {
                    chapterNo: 'asc',
                },
                select: {
                    id: true,
                    title: true,
                    bookId: true,
                    description: true,
                    createdAt: true,
                    chapterNo: true,
                    updatedAt: true,
                    subChapters: {
                        orderBy: {
                            subChapterNo: 'asc',
                        },
                        select: {
                            id: true,
                            description: true,
                            title: true,
                            chapterId: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                },
            },
        },
    });
    console.log(result);
    return result;
});
const updateBook = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.book.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteBook = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.book.delete({
        where: { id },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Book not found!');
    }
    return result;
});
exports.BookService = {
    getAllBook,
    createBook,
    updateBook,
    getSingleBook,
    deleteBook,
    getSingleBookByName,
};
