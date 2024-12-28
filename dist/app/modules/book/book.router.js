"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const book_controller_1 = require("./book.controller");
const book_validation_1 = require("./book.validation");
const router = express_1.default.Router();
router.get('/', book_controller_1.BookController.getAllBook);
router.get('/:id', book_controller_1.BookController.getSingleBook);
router.post('/', (0, auth_1.default)(client_1.EUserRole.SUPER_ADMIN, client_1.EUserRole.ADMIN), (0, validateRequest_1.default)(book_validation_1.BookValidation.createValidation), book_controller_1.BookController.createBook);
router.patch('/:id', (0, auth_1.default)(client_1.EUserRole.SUPER_ADMIN, client_1.EUserRole.ADMIN), (0, validateRequest_1.default)(book_validation_1.BookValidation.updateValidation), book_controller_1.BookController.updateBook);
router.delete('/:id', (0, auth_1.default)(client_1.EUserRole.SUPER_ADMIN, client_1.EUserRole.ADMIN), book_controller_1.BookController.deleteBook);
exports.BookRoutes = router;
