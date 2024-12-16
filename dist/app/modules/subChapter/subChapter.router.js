"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubChapterRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const subChapter_controller_1 = require("./subChapter.controller");
const subChapter_validation_1 = require("./subChapter.validation");
const router = express_1.default.Router();
router.get('/', subChapter_controller_1.SubChapterController.getAllSubChapter);
router.get('/:id', subChapter_controller_1.SubChapterController.getSingleSubChapter);
router.post('/', (0, validateRequest_1.default)(subChapter_validation_1.SubChapterValidation.createValidation), subChapter_controller_1.SubChapterController.createSubChapter);
router.patch('/:id', (0, validateRequest_1.default)(subChapter_validation_1.SubChapterValidation.updateValidation), subChapter_controller_1.SubChapterController.updateSubChapter);
router.delete('/:id', subChapter_controller_1.SubChapterController.deleteSubChapter);
exports.SubChapterRoutes = router;
