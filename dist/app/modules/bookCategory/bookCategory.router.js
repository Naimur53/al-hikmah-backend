"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookCategoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const bookCategory_controller_1 = require("./bookCategory.controller");
const bookCategory_validation_1 = require("./bookCategory.validation");
const router = express_1.default.Router();
router.get('/', bookCategory_controller_1.BookCategoryController.getAllBookCategory);
router.get('/:id', bookCategory_controller_1.BookCategoryController.getSingleBookCategory);
router.post('/', (0, validateRequest_1.default)(bookCategory_validation_1.BookCategoryValidation.createValidation), bookCategory_controller_1.BookCategoryController.createBookCategory);
router.patch('/:id', (0, validateRequest_1.default)(bookCategory_validation_1.BookCategoryValidation.updateValidation), bookCategory_controller_1.BookCategoryController.updateBookCategory);
router.delete('/:id', bookCategory_controller_1.BookCategoryController.deleteBookCategory);
exports.BookCategoryRoutes = router;
