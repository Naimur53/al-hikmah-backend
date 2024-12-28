"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const blog_controller_1 = require("./blog.controller");
const blog_validation_1 = require("./blog.validation");
const router = express_1.default.Router();
router.get('/', blog_controller_1.BlogController.getAllBlog);
router.get('/:id', (0, auth_1.default)(client_1.EUserRole.ADMIN, client_1.EUserRole.SUPER_ADMIN, client_1.EUserRole.USER), blog_controller_1.BlogController.getSingleBlog);
router.post('/', (0, auth_1.default)(client_1.EUserRole.ADMIN, client_1.EUserRole.SUPER_ADMIN, client_1.EUserRole.USER), (0, validateRequest_1.default)(blog_validation_1.BlogValidation.createValidation), blog_controller_1.BlogController.createBlog);
router.patch('/:id', (0, auth_1.default)(client_1.EUserRole.ADMIN, client_1.EUserRole.SUPER_ADMIN, client_1.EUserRole.USER), (0, validateRequest_1.default)(blog_validation_1.BlogValidation.updateValidation), blog_controller_1.BlogController.updateBlog);
router.delete('/:id', (0, auth_1.default)(client_1.EUserRole.ADMIN, client_1.EUserRole.SUPER_ADMIN, client_1.EUserRole.USER), blog_controller_1.BlogController.deleteBlog);
exports.BlogRoutes = router;
