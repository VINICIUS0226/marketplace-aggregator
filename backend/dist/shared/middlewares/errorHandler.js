"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const AppError_1 = require("../errors/AppError");
function errorHandler(error, request, response, next) {
    if (error instanceof AppError_1.AppError) {
        return response.status(error.statusCode).json({
            message: error.message
        });
    }
    console.error(error);
    return response.status(500).json({
        message: "Internal Server Error"
    });
}
