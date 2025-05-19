"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const errorHandler_1 = require("./middlewares/errorHandler");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Database
const database_1 = require("./config/database");
(0, database_1.connectDB)();
// Routes
const user_routes_1 = __importDefault(require("./routes/user.routes"));
app.use('/api/v1/auth', user_routes_1.default);
// Error Handler
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map