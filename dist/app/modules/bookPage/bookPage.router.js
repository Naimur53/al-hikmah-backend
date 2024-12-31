"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookPageRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const bookPage_controller_1 = require("./bookPage.controller");
const bookPage_validation_1 = require("./bookPage.validation");
const router = express_1.default.Router();
router.get('/', bookPage_controller_1.BookPageController.getAllBookPage);
router.get('/:id', bookPage_controller_1.BookPageController.getSingleBookPage);
router.post('/', (0, validateRequest_1.default)(bookPage_validation_1.BookPageValidation.createValidation), bookPage_controller_1.BookPageController.createBookPage);
router.post('/bulk', (0, validateRequest_1.default)(bookPage_validation_1.BookPageValidation.bulkCreateValidation), bookPage_controller_1.BookPageController.bulkCreateBookPage);
router.patch('/:id', (0, validateRequest_1.default)(bookPage_validation_1.BookPageValidation.updateValidation), bookPage_controller_1.BookPageController.updateBookPage);
router.delete('/bulk', (0, validateRequest_1.default)(bookPage_validation_1.BookPageValidation.bulkDeleteValidation), bookPage_controller_1.BookPageController.bulkDeleteBookPage);
router.delete('/:id', bookPage_controller_1.BookPageController.deleteBookPage);
exports.BookPageRoutes = router;
