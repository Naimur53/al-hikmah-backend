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
exports.WishlistService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const wishlist_constant_1 = require("./wishlist.constant");
const getAllWishlist = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andCondition = [];
    if (searchTerm) {
        const searchAbleFields = wishlist_constant_1.wishlistSearchableFields.map(single => {
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
    const result = yield prisma_1.default.wishlist.findMany({
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
    const total = yield prisma_1.default.wishlist.count();
    const output = {
        data: result,
        meta: { page, limit, total },
    };
    return output;
});
const createWishlist = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check is wilshlist exist with name and user
    const isWishlistExist = yield prisma_1.default.wishlist.findFirst({
        where: { userId: payload.userId, name: payload.name },
    });
    if (isWishlistExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Wishlist already exist!');
    }
    const newWishlist = yield prisma_1.default.wishlist.create({
        data: payload,
    });
    return newWishlist;
});
const getSingleWishlist = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.wishlist.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateWishlist = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.wishlist.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteWishlist = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.wishlist.delete({
        where: { id },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Wishlist not found!');
    }
    return result;
});
exports.WishlistService = {
    getAllWishlist,
    createWishlist,
    updateWishlist,
    getSingleWishlist,
    deleteWishlist,
};
