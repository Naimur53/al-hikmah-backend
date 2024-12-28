"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const wishlist_controller_1 = require("./wishlist.controller");
const wishlist_validation_1 = require("./wishlist.validation");
const router = express_1.default.Router();
router.get('/', wishlist_controller_1.WishlistController.getAllWishlist);
router.get('/:id', wishlist_controller_1.WishlistController.getSingleWishlist);
router.post('/', (0, auth_1.default)(client_1.EUserRole.ADMIN, client_1.EUserRole.SUPER_ADMIN, client_1.EUserRole.USER), (0, validateRequest_1.default)(wishlist_validation_1.WishlistValidation.createValidation), wishlist_controller_1.WishlistController.createWishlist);
router.patch('/:id', (0, auth_1.default)(client_1.EUserRole.ADMIN, client_1.EUserRole.SUPER_ADMIN, client_1.EUserRole.USER), (0, validateRequest_1.default)(wishlist_validation_1.WishlistValidation.updateValidation), wishlist_controller_1.WishlistController.updateWishlist);
router.delete('/:id', (0, auth_1.default)(client_1.EUserRole.ADMIN, client_1.EUserRole.SUPER_ADMIN), wishlist_controller_1.WishlistController.deleteWishlist);
exports.WishlistRoutes = router;
