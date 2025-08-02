const express = require('express')
const connectDB = require("./config/db")
const UserRouter = require("./routes/userRoutes")
const ItemRouter = require("./routes/itemsRoutes")
const CartRouter= require("./routes/cartRoutes")
const orderRoutes = require("./routes/orderRoutes");
const dashboardRoutes = require('./routes/dashboardRoutes');
const wishlistRoutes = require('./routes/wishlist');
const auditRoutes = require('./routes/auditRoutes');
const fs= require("fs")
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });
const app = express();

// CORS setup (must be before any routes or middleware)
const cors = require('cors');
const corsOptions = {
    origin: ['https://localhost:5000'],
    credentials: true
};
app.use(cors(corsOptions));

// Enable cookie parsing for all routes
app.use(cookieParser());
const path = require('path');
const https=require("https");

//Apply CSRF protection
app.use('/api', csrfProtection);
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});
// Security middleware imports
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');

// Import additional security middleware
const {
    additionalXssProtection,
    sqlInjectionProtection,
    noSqlInjectionProtection,
    requestSizeLimit,
    fileUploadSecurity,
    securityHeaders,
    securityLogging
} = require('./middleware/security');

connectDB();

// Security middleware setup
// 1. Helmet - Set security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 2. XSS Protection
app.use(xss());

// 3. Additional XSS Protection
app.use(additionalXssProtection);

// 4. SQL Injection Protection
app.use(sqlInjectionProtection);

app.use(fileUploadSecurity);

// 5. NoSQL Injection Protection
app.use(noSqlInjectionProtection);

// 6. Request Size Limiting
app.use(requestSizeLimit);

// 7. Security Headers
app.use(securityHeaders);

// 8. Security Logging
app.use(securityLogging);

// 9. Rate limiting

// Increase rate limit for development
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // allow 1000 requests per 15 minutes per IP
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs for auth
    message: 'Too many authentication attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/users/login', authLimiter);
app.use('/api/users/signup', authLimiter);

// 10. Prevent HTTP Parameter Pollution
app.use(hpp());

// 11. MongoDB query sanitization
app.use(mongoSanitize());

// 12. Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 13. Additional security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    next();
});



// Routes
app.use("/api/users", UserRouter);
app.use("/api/items", ItemRouter)
app.use("/api/cart",CartRouter)
app.use("/api/order", orderRoutes);
app.use('/api/admin', dashboardRoutes);
app.use('/api/admin/audit', auditRoutes);
app.use('/profile', express.static('profile'));
// Serve uploaded images statically at /profile
app.use('/profile', express.static(path.join(__dirname, 'uploads')));
// Existing static file serving
app.use('/uploads', express.static('uploads'));
app.use('/api/wishlist', wishlistRoutes);

// Global error handler for security
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const port = 3000;

// HTTPS setup
const dirname = __dirname;

try {
    const privateKey = fs.readFileSync(path.resolve(dirname, '.cert/key.pem'), 'utf8');
    const certificate = fs.readFileSync(path.resolve(dirname, '.cert/cert.pem'), 'utf8');
    const credentials = { key: privateKey, cert: certificate };

    https.createServer(credentials, app).listen(port, () => {
        //console.log(`Server is running on https://localhost:${port}`);
        //console.log('Security middleware enabled: Helmet, XSS-Clean, Rate Limiting, HPP, Mongo Sanitize');
    });
} catch (error) {
    console.error('Error loading certificates:', error);
    process.exit(1);
}

module.exports=app;