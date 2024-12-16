"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const wishlist_controller_1 = require("./wishlist.controller");
const wishlist_validation_1 = require("./wishlist.validation");
const router = express_1.default.Router();
router.get('/', wishlist_controller_1.WishlistController.getAllWishlist);
router.get('/:id', wishlist_controller_1.WishlistController.getSingleWishlist);
router.post('/', (0, validateRequest_1.default)(wishlist_validation_1.WishlistValidation.createValidation), wishlist_controller_1.WishlistController.createWishlist);
router.patch('/:id', (0, validateRequest_1.default)(wishlist_validation_1.WishlistValidation.updateValidation), wishlist_controller_1.WishlistController.updateWishlist);
router.delete('/:id', wishlist_controller_1.WishlistController.deleteWishlist);
exports.WishlistRoutes = router;
