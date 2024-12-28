"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const author_controller_1 = require("./author.controller");
const author_validation_1 = require("./author.validation");
const router = express_1.default.Router();
router.get('/', author_controller_1.AuthorController.getAllAuthor);
router.get('/:id', author_controller_1.AuthorController.getSingleAuthor);
router.post('/', (0, auth_1.default)(client_1.EUserRole.ADMIN, client_1.EUserRole.SUPER_ADMIN), (0, validateRequest_1.default)(author_validation_1.AuthorValidation.createValidation), author_controller_1.AuthorController.createAuthor);
router.patch('/:id', (0, auth_1.default)(client_1.EUserRole.ADMIN, client_1.EUserRole.SUPER_ADMIN), (0, validateRequest_1.default)(author_validation_1.AuthorValidation.updateValidation), author_controller_1.AuthorController.updateAuthor);
router.delete('/:id', (0, auth_1.default)(client_1.EUserRole.ADMIN, client_1.EUserRole.SUPER_ADMIN), author_controller_1.AuthorController.deleteAuthor);
exports.AuthorRoutes = router;
