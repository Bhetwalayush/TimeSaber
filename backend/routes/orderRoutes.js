const express = require("express");
const router = express.Router();
const { saveOrder, findAll, findByUserId, deleteById } = require("../controller/orderController");
const { createOrder, verifyPayment } = require("../controller/esewaController");
const { authorization } = require("../security/auth");

router.post("/", saveOrder);
router.get("/", authorization, findAll);
router.get("/user/:userId", authorization, findByUserId);
router.delete("/:id", authorization, deleteById);
router.post("/create/:id", createOrder);
router.get("/success", verifyPayment);

module.exports = router;