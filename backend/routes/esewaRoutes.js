var express = require("express");
const {
  createOrder,
  verifyPayment,
} = require("../controllers/esewaController");
const { logActivity } = require('../middleware/auditLogger');
var router = express.Router();
 
// Route to handle the successful payment from Esewa
router.get("/success", logActivity('ESEWA_VERIFY_PAYMENT'), verifyPayment);
 
// Route to create a new order and initiate the payment process
router.post("/create/:id", logActivity('ESEWA_CREATE_ORDER_PAYMENT'), createOrder);
 
// Route to handle the failed payment from Esewa
// router.get("/failure", handleEsewaFailure);
 
module.exports = router; 