"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.NotFoundError = exports.UnauthorizedError = exports.BadRequestError = exports.HttpError = void 0;
class HttpError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.HttpError = HttpError;
class BadRequestError extends HttpError {
    constructor(message) {
        super(message, 400);
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends HttpError {
    constructor(message) {
        super(message, 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class NotFoundError extends HttpError {
    constructor(message) {
        super(message, 404);
    }
}
exports.NotFoundError = NotFoundError;
const errorHandler = (error, req, res, next) => {
    const status = error instanceof HttpError ? error.status : 500;
    const message = error.message || "Internal Server Error";
    res.status(status).json(Object.assign({ status: "error", message }, (process.env.NODE_ENV === "development" && { stack: error.stack })));
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map