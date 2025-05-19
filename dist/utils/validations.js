"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PASSWORD_ERROR_MESSAGE = exports.PASSWORD_REGEX = void 0;
exports.PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
exports.PASSWORD_ERROR_MESSAGE = "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character";
//# sourceMappingURL=validations.js.map