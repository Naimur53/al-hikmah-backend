"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookMarkRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const bookMark_controller_1 = require("./bookMark.controller");
const bookMark_validation_1 = require("./bookMark.validation");
const router = express_1.default.Router();
router.get('/', bookMark_controller_1.BookMarkController.getAllBookMark);
router.get('/:id', bookMark_controller_1.BookMarkController.getSingleBookMark);
router.post('/', (0, validateRequest_1.default)(bookMark_validation_1.BookMarkValidation.createValidation), bookMark_controller_1.BookMarkController.createBookMark);
router.patch('/:id', (0, validateRequest_1.default)(bookMark_validation_1.BookMarkValidation.updateValidation), bookMark_controller_1.BookMarkController.updateBookMark);
router.delete('/:id', bookMark_controller_1.BookMarkController.deleteBookMark);
exports.BookMarkRoutes = router;
