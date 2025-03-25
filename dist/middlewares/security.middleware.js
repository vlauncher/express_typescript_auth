"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enforceHttps = void 0;
// Middleware to enforce HTTPS
const enforceHttps = (req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https' && process.env.NODE_ENV === 'production') {
        return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
};
exports.enforceHttps = enforceHttps;
