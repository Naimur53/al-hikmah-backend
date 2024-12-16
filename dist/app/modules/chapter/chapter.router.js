"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChapterRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const chapter_controller_1 = require("./chapter.controller");
const chapter_validation_1 = require("./chapter.validation");
const router = express_1.default.Router();
router.get('/', chapter_controller_1.ChapterController.getAllChapter);
router.get('/:id', chapter_controller_1.ChapterController.getSingleChapter);
router.post('/', (0, validateRequest_1.default)(chapter_validation_1.ChapterValidation.createValidation), chapter_controller_1.ChapterController.createChapter);
router.patch('/:id', (0, validateRequest_1.default)(chapter_validation_1.ChapterValidation.updateValidation), chapter_controller_1.ChapterController.updateChapter);
router.delete('/:id', chapter_controller_1.ChapterController.deleteChapter);
exports.ChapterRoutes = router;
