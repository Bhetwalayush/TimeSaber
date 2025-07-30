const express = require('express');
const router = express.Router();
const wishlistController = require('../controller/wishlistController');
const { logActivity } = require('../middleware/auditLogger');

router.post('/', logActivity('ADD_TO_WISHLIST'), wishlistController.addToWishlist);
router.delete('/:productId', logActivity('REMOVE_FROM_WISHLIST'), wishlistController.removeFromWishlist);
router.get('/', logActivity('GET_WISHLIST'), wishlistController.getWishlist);

module.exports = router;