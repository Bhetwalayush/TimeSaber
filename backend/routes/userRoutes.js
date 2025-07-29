const express = require('express');
const { signUp, login, uploadImage,getuser,getProfile, updateProfile,forgotPassword,resetPassword,verifyOtp } = require('../controller/userController');
const router = express.Router();
const upload = require("../middleware/uploads");
const { authorization } = require('../security/auth');


// const uploadImage = require("../controller/creadController");


router.post('/login', login);
router.post("/uploadImage", upload, uploadImage);
router.post('/signup', signUp);
router.get('/getuser',authorization,getuser)
router.post('/verify-otp', verifyOtp);
router.get('/profile', getProfile); // New route to get profile
router.put('/profile', updateProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
module.exports = router;
