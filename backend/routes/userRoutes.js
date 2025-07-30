const express = require('express');
const { signUp, login, logout, uploadImage,getuser,getProfile, updateProfile,forgotPassword,resetPassword,verifyOtp } = require('../controller/userController');
const router = express.Router();
const upload = require("../middleware/uploads");
const { authorization } = require('../security/auth');
const { logLogin, logLogout } = require('../middleware/auditLogger');


// const uploadImage = require("../controller/creadController");


router.post('/login', logLogin, login);
router.post('/logout', authorization, logLogout, logout);
router.post('/signup', signUp);
router.post('/uploadImage', upload, uploadImage);
router.get('/getuser', authorization, getuser);
router.post('/verify-otp', verifyOtp);
router.get('/profile', authorization, getProfile); // New route to get profile
router.put('/profile', authorization, updateProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
module.exports = router;
