const express = require("express");
const router = express.Router();
const { findAll, save, findById, deleteById, updateById, findByUserId, getCartById, deleteItemFromCart,updateItemQuantity } = require("../controller/cartController");
const { authorization } = require("../security/auth");
const { logCartOperation } = require('../middleware/auditLogger');

// const multer = require('multer');
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads')
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname)
//     }
// });
// const upload = multer({ storage });

router.get("/", findAll);
router.post("/", authorization, logCartOperation('ADD_TO_CART'), save);
router.get("/:id", findById);
router.get("/user/:id", findByUserId);
router.delete("/:id", deleteById);
router.put("/:id", updateById);
router.get("/item/:cartId", getCartById);
router.delete("/:cartId/item/:itemId", authorization, logCartOperation('REMOVE_FROM_CART'), deleteItemFromCart);
router.put("/:cartId/item/:itemId", authorization, logCartOperation('UPDATE_CART'), updateItemQuantity); // New route for updating item quantity
module.exports = router;