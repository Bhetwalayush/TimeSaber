const express = require('express');
const router = express.Router();
const wishlistController = require('../controller/wishlistController');

router.post('/', wishlistController.addToWishlist);
router.delete('/:productId', wishlistController.removeFromWishlist);
router.get('/', wishlistController.getWishlist);

module.exports = router;