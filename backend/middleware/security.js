const crypto = require('crypto');

// Additional XSS prevention middleware
const additionalXssProtection = (req, res, next) => {
    // Sanitize headers
    const sanitizeHeader = (value) => {
        if (typeof value !== 'string') return value;
        return value
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+=/gi, '')
            .replace(/<[^>]*>/g, '');
    };

    // Sanitize common headers
    if (req.headers['user-agent']) {
        req.headers['user-agent'] = sanitizeHeader(req.headers['user-agent']);
    }
    if (req.headers['referer']) {
        req.headers['referer'] = sanitizeHeader(req.headers['referer']);
    }

    next();
};

// SQL Injection prevention middleware
const sqlInjectionProtection = (req, res, next) => {
    const sqlPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|DECLARE)\b)/i,
        /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/i,
        /(\b(OR|AND)\b\s+['"]\w+['"]\s*=\s*['"]\w+['"])/i,
        /(\b(OR|AND)\b\s+\d+\s*=\s*['"]\w+['"])/i,
        /(\b(OR|AND)\b\s+['"]\w+['"]\s*=\s*\d+)/i,
        /(--)/,
        /(\/\*)/,
        /(\*\/)/,
        /(\b(WAITFOR|DELAY)\b)/i,
        /(\b(SLEEP)\b)/i,
        /(\b(BENCHMARK)\b)/i,
        /(\b(LOAD_FILE)\b)/i,
        /(\b(INTO\s+OUTFILE)\b)/i,
        /(\b(INTO\s+DUMPFILE)\b)/i
    ];

    const checkForSqlInjection = (obj) => {
        for (let key in obj) {
            if (typeof obj[key] === 'string') {
                for (let pattern of sqlPatterns) {
                    if (pattern.test(obj[key])) {
                        return true;
                    }
                }
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                if (checkForSqlInjection(obj[key])) {
                    return true;
                }
            }
        }
        return false;
    };

    if (checkForSqlInjection(req.body) || checkForSqlInjection(req.query) || checkForSqlInjection(req.params)) {
        return res.status(403).json({
            message: 'Suspicious input detected',
            error: 'Security violation'
        });
    }

    next();
};

// NoSQL Injection prevention middleware
const noSqlInjectionProtection = (req, res, next) => {
    const noSqlPatterns = [
        /\$where/i,
        /\$ne/i,
        /\$gt/i,
        /\$lt/i,
        /\$gte/i,
        /\$lte/i,
        /\$in/i,
        /\$nin/i,
        /\$regex/i,
        /\$options/i,
        /\$exists/i,
        /\$type/i,
        /\$mod/i,
        /\$all/i,
        /\$elemMatch/i,
        /\$size/i,
        /\$or/i,
        /\$and/i,
        /\$not/i,
        /\$nor/i
    ];

    const checkForNoSqlInjection = (obj) => {
        for (let key in obj) {
            if (typeof obj[key] === 'string') {
                for (let pattern of noSqlPatterns) {
                    if (pattern.test(obj[key])) {
                        return true;
                    }
                }
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                if (checkForNoSqlInjection(obj[key])) {
                    return true;
                }
            }
        }
        return false;
    };

    if (checkForNoSqlInjection(req.body) || checkForNoSqlInjection(req.query) || checkForNoSqlInjection(req.params)) {
        return res.status(403).json({
            message: 'Suspicious input detected',
            error: 'Security violation'
        });
    }

    next();
};

// Request size limiting middleware
const requestSizeLimit = (req, res, next) => {
    const contentLength = parseInt(req.headers['content-length'] || '0');
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (contentLength > maxSize) {
        return res.status(413).json({
            message: 'Request entity too large',
            error: 'Request size exceeds limit'
        });
    }

    next();
};

// File upload security middleware
const fileUploadSecurity = (req, res, next) => {
    if (!req.file) return next();

    const allowedMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp'
    ];

    const maxFileSize = 5 * 1024 * 1024; // 5MB

    // Check file type
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
            message: 'Invalid file type',
            error: 'Only image files are allowed'
        });
    }

    // Check file size
    if (req.file.size > maxFileSize) {
        return res.status(400).json({
            message: 'File too large',
            error: 'File size exceeds 5MB limit'
        });
    }

    // Check file extension
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const fileExtension = req.file.originalname.toLowerCase().substring(req.file.originalname.lastIndexOf('.'));
    
    if (!allowedExtensions.includes(fileExtension)) {
        return res.status(400).json({
            message: 'Invalid file extension',
            error: 'Only image files are allowed'
        });
    }

    // Generate secure filename
    const secureFilename = crypto.randomBytes(16).toString('hex') + fileExtension;
    req.file.filename = secureFilename;

    next();
};

// CSRF protection middleware (basic implementation)
const csrfProtection = (req, res, next) => {
    // Skip CSRF check for GET requests
    if (req.method === 'GET') {
        return next();
    }

    // Check for CSRF token in headers
    const csrfToken = req.headers['x-csrf-token'] || req.headers['csrf-token'];
    
    if (!csrfToken) {
        return res.status(403).json({
            message: 'CSRF token missing',
            error: 'Security violation'
        });
    }

    // In a real implementation, you would validate the token against a session
    // For now, we'll just check if it exists
    next();
};

// Security headers middleware
const securityHeaders = (req, res, next) => {
    // Additional security headers
    res.setHeader('X-DNS-Prefetch-Control', 'off');
    res.setHeader('X-Download-Options', 'noopen');
    res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
    res.setHeader('X-Datadog-Trace-Id', 'disabled');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    
    next();
};

// Request logging for security monitoring
const securityLogging = (req, res, next) => {
    const startTime = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const logData = {
            timestamp: new Date().toISOString(),
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            duration: duration,
            userAgent: req.headers['user-agent'],
            ip: req.ip || req.connection.remoteAddress,
            contentLength: req.headers['content-length'] || 0
        };

        // Log suspicious activities
        if (res.statusCode >= 400) {
            console.warn('Security Warning:', logData);
        }

        // Log all requests for monitoring
        console.log('Request Log:', logData);
    });

    next();
};

module.exports = {
    additionalXssProtection,
    sqlInjectionProtection,
    noSqlInjectionProtection,
    requestSizeLimit,
    fileUploadSecurity,
    csrfProtection,
    securityHeaders,
    securityLogging
}; 