const express = require('express');
const { signUp, login, logout, uploadImage,getuser,getProfile, updateProfile,forgotPassword,resetPassword,verifyOtp } = require('../controller/userController');
const router = express.Router();
const { uploadProfilePicture, uploadProfilePictureAlt, handleUploadError } = require("../middleware/uploads");
const { authorization } = require('../security/auth');
const { logLogin, logLogout } = require('../middleware/auditLogger');
const { 
    validate, 
    signUpSchema, 
    loginSchema, 
    updateProfileSchema, 
    forgotPasswordSchema, 
    resetPasswordSchema, 
    verifyOtpSchema 
} = require('../validation/userValidation');

// User routes with validation and secure file uploads
router.post('/login', validate(loginSchema), logLogin, login);
router.post('/logout', authorization, logLogout, logout);
router.post('/signup', validate(signUpSchema), signUp);

// Upload routes - handle both field names
router.post('/uploadImage', uploadProfilePicture, handleUploadError, uploadImage);
router.post('/uploadProfilePicture', uploadProfilePictureAlt, handleUploadError, uploadImage);

router.get('/getuser', authorization, getuser);
router.post('/verify-otp', validate(verifyOtpSchema), verifyOtp);
router.get('/profile', authorization, getProfile);
router.put('/profile', authorization, validate(updateProfileSchema), updateProfile);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

module.exports = router;
