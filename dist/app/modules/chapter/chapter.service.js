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
exports.ChapterService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const chapter_constant_1 = require("./chapter.constant");
const getAllChapter = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andCondition = [];
    if (searchTerm) {
        const searchAbleFields = chapter_constant_1.chapterSearchableFields.map(single => {
            const query = {
                [single]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            };
            return query;
        });
        andCondition.push({
            OR: searchAbleFields,
        });
    }
    if (Object.keys(filters).length) {
        andCondition.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditions = andCondition.length > 0 ? { AND: andCondition } : {};
    const result = yield prisma_1.default.chapter.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: paginationOptions.sortBy && paginationOptions.sortOrder
            ? {
                [paginationOptions.sortBy]: paginationOptions.sortOrder,
            }
            : {
                chapterNo: 'asc',
            },
        select: {
            id: true,
            chapterNo: true,
            title: true,
            description: true,
            bookPages: {
                where: {
                    subChapterId: null,
                },
                take: 1,
                select: {
                    id: true,
                    page: true,
                },
            },
            book: {
                select: {
                    id: true,
                    name: true,
                },
            },
            subChapters: {
                take: 1,
                select: {
                    id: true,
                    title: true,
                    subChapterNo: true,
                },
            },
        },
    });
    const total = yield prisma_1.default.chapter.count({ where: whereConditions });
    const output = {
        data: result,
        meta: { page, limit, total },
    };
    return output;
});
const createChapter = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // is there is any bookPage found on bookPage with bookId
    const book = yield prisma_1.default.book.findUnique({
        where: { id: payload.bookId },
        select: {
            id: true,
            bookPages: {
                where: {
                    bookId: payload.bookId,
                    chapterId: null,
                    subChapterId: null,
                },
                select: {
                    id: true,
                },
                take: 1,
            },
        },
    });
    if (!book) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Book not found!');
    }
    if (book.bookPages.length > 0) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'This book already has a book page on core!');
    }
    // before create check does the chapterNo already exist
    const isExist = yield prisma_1.default.chapter.findFirst({
        where: {
            bookId: payload.bookId,
            chapterNo: payload.chapterNo,
        },
    });
    if (isExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Chapter No :${payload.chapterNo} already exist with this book!`);
    }
    const newChapter = yield prisma_1.default.chapter.create({
        data: payload,
    });
    return newChapter;
});
const getSingleChapter = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.chapter.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateChapter = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.chapter.findUnique({ where: { id } });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Chapter not found!');
    }
    if (payload.chapterNo && isExist.chapterNo !== payload.chapterNo) {
        return yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            yield tx.chapter.updateMany({
                where: {
                    bookId: isExist.bookId,
                    chapterNo: {
                        gte: payload.chapterNo,
                    },
                },
                data: {
                    chapterNo: {
                        increment: 1,
                    },
                },
            });
            return yield tx.chapter.update({ where: { id }, data: payload });
        }));
    }
    const result = yield prisma_1.default.chapter.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteChapter = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        // Find the page to delete
        const chapterToDelete = yield prisma.chapter.findUnique({
            where: { id },
        });
        if (!chapterToDelete) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'chapter not found!');
        }
        const { bookId, chapterNo } = chapterToDelete;
        // Delete the specified BookPage
        const deletedChapter = yield prisma.chapter.delete({
            where: { id },
        });
        // Update the page numbers of subsequent pages
        yield prisma.chapter.updateMany({
            where: {
                bookId,
                chapterNo: { gt: chapterNo }, // Update only pages after the deleted one
            },
            data: {
                chapterNo: { decrement: 1 }, // Decrement the page number by 1
            },
        });
        return deletedChapter;
    }));
});
exports.ChapterService = {
    getAllChapter,
    createChapter,
    updateChapter,
    getSingleChapter,
    deleteChapter,
};
