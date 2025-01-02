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
exports.UserService = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const user_constant_1 = require("./user.constant");
const getAllUser = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andCondition = [];
    if (searchTerm) {
        const searchAbleFields = user_constant_1.userSearchableFields.map(single => {
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
    const result = yield prisma_1.default.user.findMany({
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
    const total = yield prisma_1.default.user.count();
    const output = {
        data: result,
        meta: { page, limit, total },
    };
    return output;
});
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield prisma_1.default.user.create({
        data: payload,
    });
    return newUser;
});
const getSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateUser = (id, payload, requestedUserId) => __awaiter(void 0, void 0, void 0, function* () {
    // check if the user exists
    const requestedUser = yield prisma_1.default.user.findUnique({
        where: {
            id: requestedUserId,
        },
    });
    if (!requestedUser) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    if (requestedUser.role === client_1.EUserRole.ADMIN) {
        if (payload.role) {
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'You are not allowed to update role!');
        }
    }
    if (requestedUser.role === client_1.EUserRole.USER) {
        if (requestedUser.id !== id) {
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'You are not allowed to update this user!');
        }
        // check if the user update role
        if (payload.role) {
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'You are not allowed to update role!');
        }
        if (payload.isBlocked) {
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'You are not allowed to update isBlocked!');
        }
        if (payload.isVerified) {
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'You are not allowed to update isVerified!');
        }
    }
    if (payload.password) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'You are not allowed to update password');
    }
    const result = yield prisma_1.default.user.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.delete({
        where: { id },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    return result;
});
const getAdminOverview = () => __awaiter(void 0, void 0, void 0, function* () {
    const [totalUser, totalBook, totalBlog, totalNewsletter, totalAuthor, totalPublisher, totalCategory,] = yield Promise.all([
        prisma_1.default.user.count(),
        prisma_1.default.book.count(),
        prisma_1.default.blog.count(),
        prisma_1.default.newsLetter.count(),
        prisma_1.default.author.count(),
        prisma_1.default.publisher.count(),
        prisma_1.default.bookCategory.count(),
    ]);
    return {
        totalUser,
        totalBook,
        totalBlog,
        totalNewsletter,
        totalAuthor,
        totalPublisher,
        totalCategory,
    };
});
exports.UserService = {
    getAllUser,
    createUser,
    updateUser,
    getSingleUser,
    deleteUser,
    getAdminOverview,
};
