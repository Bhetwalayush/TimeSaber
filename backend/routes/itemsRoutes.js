const express = require("express");
const router = express.Router();
const { findAll, save, findById, deleteById, updateById, searchItems } = require("../controller/itemController");
const { authorization } = require("../security/auth");

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
const upload = multer({ storage });

router.get("/", findAll);
router.post("/", authorization, upload.single('image'), save);
router.get('/search', searchItems);
router.get("/:id", authorization, findById);
router.delete("/:id", authorization, deleteById);
router.put("/:id", authorization, upload.single('image'), updateById);

module.exports = router;
