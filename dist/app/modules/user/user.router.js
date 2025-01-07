"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(client_1.EUserRole.ADMIN, client_1.EUserRole.SUPER_ADMIN), user_controller_1.UserController.getAllUser);
router.get('/admin/overview', (0, auth_1.default)(client_1.EUserRole.ADMIN, client_1.EUserRole.SUPER_ADMIN), user_controller_1.UserController.getAdminOverview);
router.get('/admin/chart-overview', (0, auth_1.default)(client_1.EUserRole.ADMIN, client_1.EUserRole.SUPER_ADMIN), user_controller_1.UserController.getAdminChartInfo);
router.get('/:id', (0, auth_1.default)(client_1.EUserRole.ADMIN, client_1.EUserRole.SUPER_ADMIN, client_1.EUserRole.USER), user_controller_1.UserController.getSingleUser);
// router.post(
//   '/',
//   validateRequest(UserValidation.createValidation),
//   UserController.createUser,
// );
// router.post(
//   '/image-upload',
//   uploadMulter.single('image'),
//   uploadImage,
//   UserController.uploadSingleFile,
// );
router.patch('/:id', (0, auth_1.default)(client_1.EUserRole.ADMIN, client_1.EUserRole.SUPER_ADMIN, client_1.EUserRole.USER), (0, validateRequest_1.default)(user_validation_1.UserValidation.updateValidation), user_controller_1.UserController.updateUser);
router.delete('/:id', (0, auth_1.default)(client_1.EUserRole.SUPER_ADMIN), user_controller_1.UserController.deleteUser);
exports.UserRoutes = router;
