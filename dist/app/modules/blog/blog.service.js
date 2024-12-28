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
exports.BlogService = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const blog_constant_1 = require("./blog.constant");
const getAllBlog = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andCondition = [];
    if (searchTerm) {
        const searchAbleFields = blog_constant_1.blogSearchableFields.map(single => {
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
    const result = yield prisma_1.default.blog.findMany({
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
    });
    const total = yield prisma_1.default.blog.count();
    const output = {
        data: result,
        meta: { page, limit, total },
    };
    return output;
});
const createBlog = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const newBlog = yield prisma_1.default.blog.create({
        data: payload,
    });
    return newBlog;
});
const getSingleBlog = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.blog.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateBlog = (id, payload, requestUserId) => __awaiter(void 0, void 0, void 0, function* () {
    // check if the blog exists
    const blog = yield prisma_1.default.blog.findUnique({
        where: {
            id,
        },
    });
    if (!blog) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Blog not found!');
    }
    // get rqeustusr info
    const requestedUser = yield prisma_1.default.user.findUnique({
        where: { id: requestUserId },
    });
    if (!requestedUser) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    // check if the user is the author of the blog
    if (requestedUser.role === client_1.EUserRole.USER) {
        if (payload.status === 'approved') {
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'You are not authorized to approved!');
        }
        //
        if (requestUserId !== blog.authorId) {
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'You are not authorized to update this blog!');
        }
    }
    const result = yield prisma_1.default.blog.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteBlog = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.blog.delete({
        where: { id },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Blog not found!');
    }
    return result;
});
exports.BlogService = {
    getAllBlog,
    createBlog,
    updateBlog,
    getSingleBlog,
    deleteBlog,
};
