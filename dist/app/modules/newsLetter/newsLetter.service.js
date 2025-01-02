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
exports.NewsLetterService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const newsLetter_constant_1 = require("./newsLetter.constant");
const getAllNewsLetter = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andCondition = [];
    if (searchTerm) {
        const searchAbleFields = newsLetter_constant_1.newsLetterSearchableFields.map(single => {
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
                // Check if the value is a string "true" or "false"
                if (value === 'true' || value === 'false') {
                    return { [field]: JSON.parse(value) };
                }
                return { [field]: value };
            }),
        });
    }
    const whereConditions = andCondition.length > 0 ? { AND: andCondition } : {};
    const result = yield prisma_1.default.newsLetter.findMany({
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
    const total = yield prisma_1.default.newsLetter.count();
    const output = {
        data: result,
        meta: { page, limit, total },
    };
    return output;
});
const createNewsLetter = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check is email exist
    const isExist = yield prisma_1.default.newsLetter.findUnique({
        where: { email: payload.email },
    });
    if (isExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Email already exist!');
    }
    const newNewsLetter = yield prisma_1.default.newsLetter.create({
        data: payload,
    });
    return newNewsLetter;
});
const getSingleNewsLetter = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.newsLetter.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateNewsLetter = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.newsLetter.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteNewsLetter = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.newsLetter.delete({
        where: { id },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'NewsLetter not found!');
    }
    return result;
});
exports.NewsLetterService = {
    getAllNewsLetter,
    createNewsLetter,
    updateNewsLetter,
    getSingleNewsLetter,
    deleteNewsLetter,
};
