const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads';
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generate secure filename with timestamp and random string
        const timestamp = Date.now();
        const randomString = crypto.randomBytes(8).toString('hex');
        const fileExtension = path.extname(file.originalname).toLowerCase();
        
        // Validate file extension
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        if (!allowedExtensions.includes(fileExtension)) {
            return cb(new Error('Invalid file type. Only image files are allowed.'), null);
        }
        
        const secureFilename = `${timestamp}-${randomString}${fileExtension}`;
        cb(null, secureFilename);
    }
});

// File filter function
const fileFilter = (req, file, cb) => {
    // Check file type
    const allowedMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp'
    ];
    
    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new Error('Invalid file type. Only image files are allowed.'), false);
    }
    
    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        return cb(new Error('File too large. Maximum size is 5MB.'), false);
    }
    
    // Check file extension
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
        return cb(new Error('Invalid file extension. Only image files are allowed.'), false);
    }
    
    // Additional security checks
    const dangerousPatterns = [
        /\.(php|php3|php4|php5|phtml|pl|py|jsp|asp|sh|cgi)$/i,
        /\.(exe|bat|cmd|com|pif|scr|vbs|js)$/i
    ];
    
    for (let pattern of dangerousPatterns) {
        if (pattern.test(file.originalname)) {
            return cb(new Error('Dangerous file type detected.'), false);
        }
    }
    
    cb(null, true);
};

// Configure multer with security settings
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 1 // Only allow 1 file per request
    }
});

// Error handling middleware for multer
const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                message: 'File too large',
                error: 'File size exceeds 5MB limit'
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                message: 'Too many files',
                error: 'Only one file is allowed per request'
            });
        }
        return res.status(400).json({
            message: 'File upload error',
            error: err.message
        });
    }
    
    if (err) {
        return res.status(400).json({
            message: 'File validation error',
            error: err.message
        });
    }
    
    next();
};

// Flexible upload middleware that can handle different field names
const uploadFlexible = (fieldName) => {
    return upload.single(fieldName);
};

// Profile picture upload middleware - accepts multiple field names
const uploadProfilePicture = upload.single('image'); // Changed from 'profile_picture' to 'image'

// Alternative profile picture upload for different field names
const uploadProfilePictureAlt = upload.single('profile_picture');

// Item image upload middleware
const uploadItemImage = upload.single('image');

// Multiple file upload middleware (if needed)
const uploadMultiple = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB per file
        files: 5 // Allow up to 5 files
    }
}).array('images', 5);

module.exports = {
    upload,
    uploadProfilePicture,
    uploadProfilePictureAlt,
    uploadItemImage,
    uploadMultiple,
    uploadFlexible,
    handleUploadError
};
