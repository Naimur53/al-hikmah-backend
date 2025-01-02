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
exports.SubChapterService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const subChapter_constant_1 = require("./subChapter.constant");
const getAllSubChapter = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andCondition = [];
    if (searchTerm) {
        const searchAbleFields = subChapter_constant_1.subChapterSearchableFields.map(single => {
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
    const result = yield prisma_1.default.subChapter.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: paginationOptions.sortBy && paginationOptions.sortOrder
            ? {
                [paginationOptions.sortBy]: paginationOptions.sortOrder,
            }
            : {
                subChapterNo: 'asc',
            },
    });
    const total = yield prisma_1.default.subChapter.count();
    const output = {
        data: result,
        meta: { page, limit, total },
    };
    return output;
});
const createSubChapter = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check any chapter has bookPage
    const chapter = yield prisma_1.default.chapter.findUnique({
        where: { id: payload.chapterId },
        select: {
            id: true,
            bookPages: {
                where: {
                    chapterId: payload.chapterId,
                    subChapterId: null,
                },
                select: {
                    id: true,
                },
                take: 1,
            },
        },
    });
    if (!chapter) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Chapter not found!');
    }
    if (chapter.bookPages.length > 0) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'BookPage already exists on chapter remove them first to create subchapter!');
    }
    // check if the subchapter already exists with number
    const isExist = yield prisma_1.default.subChapter.findFirst({
        where: {
            subChapterNo: payload.subChapterNo,
            chapterId: payload.chapterId,
        },
    });
    if (isExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'SubChapter already exists! with this number :' + payload.subChapterNo);
    }
    const newSubChapter = yield prisma_1.default.subChapter.create({
        data: payload,
    });
    return newSubChapter;
});
const getSingleSubChapter = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.subChapter.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateSubChapter = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.subChapter.findUnique({ where: { id } });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'SubChapter not found!');
    }
    if (payload.subChapterNo && isExist.subChapterNo !== payload.subChapterNo) {
        return yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.subChapter.updateMany({
                where: {
                    chapterId: isExist.chapterId,
                    subChapterNo: {
                        gte: payload.subChapterNo,
                    },
                },
                data: {
                    subChapterNo: {
                        increment: 1,
                    },
                },
            });
            return yield prisma.subChapter.update({
                where: { id },
                data: payload,
            });
        }));
    }
    const result = yield prisma_1.default.subChapter.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteSubChapter = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        // Find the page to delete
        const subChapterToDelete = yield prisma.subChapter.findUnique({
            where: { id },
        });
        if (!subChapterToDelete) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'BookPage not found!');
        }
        const { chapterId, subChapterNo } = subChapterToDelete;
        // Delete the specified BookPage
        const deletedPage = yield prisma.subChapter.delete({
            where: { id },
        });
        // Update the page numbers of subsequent pages
        yield prisma.subChapter.updateMany({
            where: {
                chapterId,
                subChapterNo: { gt: subChapterNo }, // Update only pages after the deleted one
            },
            data: {
                subChapterNo: { decrement: 1 }, // Decrement the page number by 1
            },
        });
        return deletedPage;
    }));
});
exports.SubChapterService = {
    getAllSubChapter,
    createSubChapter,
    updateSubChapter,
    getSingleSubChapter,
    deleteSubChapter,
};
