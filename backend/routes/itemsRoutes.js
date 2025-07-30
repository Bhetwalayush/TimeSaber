const express = require("express");
const router = express.Router();
const { findAll, save, findById, deleteById, updateById, searchItems } = require("../controller/itemController");
const { authorization } = require("../security/auth");
const { logActivity } = require('../middleware/auditLogger');
const { validate, validateQuery, createItemSchema, updateItemSchema, searchItemsSchema } = require('../validation/userValidation');
const { uploadItemImage, handleUploadError } = require('../middleware/uploads');

// Item routes with validation and secure file uploads
router.get("/", findAll);
router.post("/", authorization, validate(createItemSchema), logActivity('CREATE_ITEM'), uploadItemImage, handleUploadError, save);
router.get('/search', validateQuery(searchItemsSchema), logActivity('SEARCH'), searchItems);
router.get('/:id', authorization, logActivity('VIEW_ITEM'), findById);
router.delete("/:id", authorization, logActivity('DELETE_ITEM'), deleteById);
router.put("/:id", authorization, validate(updateItemSchema), logActivity('UPDATE_ITEM'), uploadItemImage, handleUploadError, updateById);

module.exports = router;
