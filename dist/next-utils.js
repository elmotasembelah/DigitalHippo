"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextHandler = exports.nextApp = void 0;
// Responsible for making next run in a nodejs environment so we can deploy whereever we want
var next_1 = __importDefault(require("next"));
var PORT = Number(process.env.PORT) || 3000;
exports.nextApp = (0, next_1.default)({
    dev: process.env.NODE_ENV !== "production",
    port: PORT,
});
exports.nextHandler = exports.nextApp.getRequestHandler();
