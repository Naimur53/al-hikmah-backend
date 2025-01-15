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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const pagination_1 = require("../../../constants/pagination");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const book_constant_1 = require("./book.constant");
const book_service_1 = require("./book.service");
const createBook = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const BookData = req.body;
    const result = yield book_service_1.BookService.createBook(BookData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Book Created successfully!',
        data: result,
    });
}));
const getAllBook = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, ['searchTerm', ...book_constant_1.bookFilterAbleFields]);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const isShort = req.query.isShort;
    const result = yield book_service_1.BookService.getAllBook(filters, paginationOptions, Boolean(isShort === 'true'));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Book retrieved successfully !',
        meta: result.meta,
        data: result.data,
    });
}));
const getSingleBook = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield book_service_1.BookService.getSingleBook(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Book retrieved  successfully!',
        data: result,
    });
}));
const getSingleBookByName = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.params.name;
    const result = yield book_service_1.BookService.getSingleBookByName(name);
    console.log(result);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Book retrieved  successfully!',
        data: result,
    });
}));
const getContentStructure = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.query.name;
    const id = req.query.id;
    const isActive = req.query.isActive;
    const result = yield book_service_1.BookService.getContentStructure({
        id,
        name,
        isActive,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Book retrieved  successfully!',
        data: result,
    });
}));
const updateBook = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updateAbleData = req.body;
    const result = yield book_service_1.BookService.updateBook(id, updateAbleData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Book Updated successfully!',
        data: result,
    });
}));
const updateBookShareCount = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updateAbleData = req.body;
    const result = yield book_service_1.BookService.updateBookShareCount(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Book share count Updated successfully!',
        data: {
            count: (result === null || result === void 0 ? void 0 : result.totalShare) || 0,
        },
    });
}));
const deleteBook = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield book_service_1.BookService.deleteBook(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Book deleted successfully!',
        data: result,
    });
}));
const getBooksBySearchText = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const searchText = req.query.searchText;
    const result = yield book_service_1.BookService.getBooksBySearchText(searchText);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Book Names retrieved successfully!',
        data: result,
    });
}));
const getRelatedBookByName = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.query.name;
    const type = req.query.type;
    const result = yield book_service_1.BookService.getRelatedBookByName(name, type);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Book retrieved  successfully!',
        data: result,
    });
}));
exports.BookController = {
    getAllBook,
    createBook,
    updateBook,
    getSingleBook,
    deleteBook,
    getSingleBookByName,
    updateBookShareCount,
    getContentStructure,
    getRelatedBookByName,
    getBooksBySearchText,
};
