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
exports.BookPageService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const bookPage_constant_1 = require("./bookPage.constant");
const getAllBookPage = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andCondition = [];
    if (searchTerm) {
        const searchAbleFields = bookPage_constant_1.bookPageSearchableFields.map(single => {
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
            AND: Object.entries(filterData).map(([field, value]) => {
                return { [field]: value };
            }),
        });
    }
    const whereConditions = andCondition.length > 0 ? { AND: andCondition } : {};
    const result = yield prisma_1.default.bookPage.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: paginationOptions.sortBy && paginationOptions.sortOrder
            ? {
                [paginationOptions.sortBy]: paginationOptions.sortOrder,
            }
            : {
                page: 'asc',
            },
    });
    const total = yield prisma_1.default.bookPage.count();
    const output = {
        data: result,
        meta: { page, limit, total },
    };
    return output;
});
const createBookPage = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check if book page exist with value
    const isExits = yield prisma_1.default.bookPage.findFirst({
        where: {
            bookId: payload.bookId,
            page: payload.page,
            chapterId: payload.chapterId || null,
            subChapterId: payload.subChapterId || null,
        },
    });
    if (isExits) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Book Page already exist with this value!' + 'page no:' + payload.page);
    }
    const newBookPage = yield prisma_1.default.bookPage.create({
        data: payload,
    });
    return newBookPage;
});
const bulkCreateBookPage = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = payload[0].bookId;
    const chapterId = payload[0].chapterId || null;
    const subChapterId = payload[0].subChapterId || null;
    payload.forEach(page => {
        if (page.bookId !== bookId) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'BookId must be same for all pages!');
        }
        const getSingleChapter = page.chapterId || null;
        if (subChapterId !== chapterId) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'ChapterId must be same for all pages!');
        }
        const getSingleSubChapter = page.subChapterId || null;
        if (getSingleSubChapter !== subChapterId) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'SubChapterId must be same for all pages!');
        }
    });
    // check if book page exist with value
    const isExits = yield prisma_1.default.bookPage.findMany({
        where: {
            bookId: payload[0].bookId,
            page: {
                in: payload.map(page => page.page),
            },
            chapterId: payload[0].chapterId || null,
            subChapterId: payload[0].subChapterId || null,
        },
    });
    if (isExits.length) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Book Page already exist with this value!' +
            "page no's:" +
            isExits.map(page => page.page).join(', '));
    }
    const newBookPage = yield prisma_1.default.bookPage.createMany({ data: payload });
    return newBookPage;
});
const getSingleBookPage = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.bookPage.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateBookPage = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.bookPage.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteBookPage = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        // Find the page to delete
        const pageToDelete = yield prisma.bookPage.findUnique({
            where: { id },
        });
        if (!pageToDelete) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'BookPage not found!');
        }
        const { page, bookId, chapterId, subChapterId } = pageToDelete;
        // Delete the specified BookPage
        const deletedPage = yield prisma.bookPage.delete({
            where: { id },
        });
        // Update the page numbers of subsequent pages
        yield prisma.bookPage.updateMany({
            where: {
                bookId, // Ensure it belongs to the same book
                chapterId, // Optional: Ensure it's within the same chapter
                subChapterId, // Optional: Ensure it's within the same sub-chapter
                page: { gt: page }, // Update only pages after the deleted one
            },
            data: {
                page: { decrement: 1 }, // Decrement the page number by 1
            },
        });
        return deletedPage;
    }));
});
exports.BookPageService = {
    getAllBookPage,
    createBookPage,
    updateBookPage,
    getSingleBookPage,
    deleteBookPage,
    bulkCreateBookPage,
};
