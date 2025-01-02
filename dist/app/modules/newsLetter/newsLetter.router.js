"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsLetterRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const newsLetter_controller_1 = require("./newsLetter.controller");
const newsLetter_validation_1 = require("./newsLetter.validation");
const router = express_1.default.Router();
router.get('/', newsLetter_controller_1.NewsLetterController.getAllNewsLetter);
router.get('/:id', newsLetter_controller_1.NewsLetterController.getSingleNewsLetter);
router.post('/', (0, validateRequest_1.default)(newsLetter_validation_1.NewsLetterValidation.createValidation), newsLetter_controller_1.NewsLetterController.createNewsLetter);
router.patch('/:id', (0, validateRequest_1.default)(newsLetter_validation_1.NewsLetterValidation.updateValidation), newsLetter_controller_1.NewsLetterController.updateNewsLetter);
router.delete('/:id', newsLetter_controller_1.NewsLetterController.deleteNewsLetter);
exports.NewsLetterRoutes = router;
