"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const dotenv_1 = __importDefault(require("dotenv"));
const errorHandler_1 = require("./middlewares/errorHandler");
const db_1 = require("./config/db");
const security_middleware_1 = require("./middlewares/security.middleware");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cookie_session_1 = __importDefault(require("cookie-session"));
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, db_1.connectDB)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use((0, express_rate_limit_1.default)({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(security_middleware_1.enforceHttps);
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use((0, cookie_session_1.default)({
    secret: process.env.JWT_SECRET,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
}));
// Mount routes with prefix /api/v1/auth
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const profile_routes_1 = __importDefault(require("./routes/profile.routes"));
app.use('/api/v1/auth', users_routes_1.default);
app.use('/api/v1/profile', profile_routes_1.default);
// Global error handler
app.use(errorHandler_1.errorHandler);
exports.default = app;
