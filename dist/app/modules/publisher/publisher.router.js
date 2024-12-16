"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const publisher_controller_1 = require("./publisher.controller");
const publisher_validation_1 = require("./publisher.validation");
const router = express_1.default.Router();
router.get('/', publisher_controller_1.PublisherController.getAllPublisher);
router.get('/:id', publisher_controller_1.PublisherController.getSinglePublisher);
router.post('/', (0, validateRequest_1.default)(publisher_validation_1.PublisherValidation.createValidation), publisher_controller_1.PublisherController.createPublisher);
router.patch('/:id', (0, validateRequest_1.default)(publisher_validation_1.PublisherValidation.updateValidation), publisher_controller_1.PublisherController.updatePublisher);
router.delete('/:id', publisher_controller_1.PublisherController.deletePublisher);
exports.PublisherRoutes = router;
