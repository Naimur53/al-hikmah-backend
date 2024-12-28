"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookCategoryRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const bookCategory_controller_1 = require("./bookCategory.controller");
const bookCategory_validation_1 = require("./bookCategory.validation");
const router = express_1.default.Router();
router.get('/', bookCategory_controller_1.BookCategoryController.getAllBookCategory);
router.get('/:id', bookCategory_controller_1.BookCategoryController.getSingleBookCategory);
router.post('/', (0, auth_1.default)(client_1.EUserRole.ADMIN, client_1.EUserRole.SUPER_ADMIN), (0, validateRequest_1.default)(bookCategory_validation_1.BookCategoryValidation.createValidation), bookCategory_controller_1.BookCategoryController.createBookCategory);
router.patch('/:id', (0, auth_1.default)(client_1.EUserRole.ADMIN, client_1.EUserRole.SUPER_ADMIN), (0, validateRequest_1.default)(bookCategory_validation_1.BookCategoryValidation.updateValidation), bookCategory_controller_1.BookCategoryController.updateBookCategory);
router.delete('/:id', (0, auth_1.default)(client_1.EUserRole.ADMIN, client_1.EUserRole.SUPER_ADMIN), bookCategory_controller_1.BookCategoryController.deleteBookCategory);
exports.BookCategoryRoutes = router;
