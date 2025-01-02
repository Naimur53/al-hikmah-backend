"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const uploadImage_1 = __importStar(require("../../middlewares/uploadImage"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(client_1.EUserRole.ADMIN, client_1.EUserRole.SUPER_ADMIN), user_controller_1.UserController.getAllUser);
router.get('/admin/overview', 
// auth(EUserRole.ADMIN, EUserRole.SUPER_ADMIN),
user_controller_1.UserController.getAdminOverview);
router.get('/:id', (0, auth_1.default)(client_1.EUserRole.ADMIN, client_1.EUserRole.SUPER_ADMIN, client_1.EUserRole.USER), user_controller_1.UserController.getSingleUser);
// router.post(
//   '/',
//   validateRequest(UserValidation.createValidation),
//   UserController.createUser,
// );
router.post('/image-upload', uploadImage_1.uploadMulter.single('image'), uploadImage_1.default, user_controller_1.UserController.uploadSingleFile);
router.patch('/:id', (0, auth_1.default)(client_1.EUserRole.ADMIN, client_1.EUserRole.SUPER_ADMIN, client_1.EUserRole.USER), (0, validateRequest_1.default)(user_validation_1.UserValidation.updateValidation), user_controller_1.UserController.updateUser);
router.delete('/:id', (0, auth_1.default)(client_1.EUserRole.SUPER_ADMIN), user_controller_1.UserController.deleteUser);
exports.UserRoutes = router;
