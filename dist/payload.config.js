"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// the config file for payload
var bundler_webpack_1 = require("@payloadcms/bundler-webpack");
var db_mongodb_1 = require("@payloadcms/db-mongodb");
var richtext_slate_1 = require("@payloadcms/richtext-slate");
var path_1 = __importDefault(require("path"));
var config_1 = require("payload/config");
var Users_1 = require("./collections/Users");
var dotenv_1 = __importDefault(require("dotenv"));
var Products_1 = require("./collections/products/Products");
var Media_1 = require("./collections/Media");
var productFiles_1 = require("./collections/productFiles");
var Orders_1 = require("./collections/Orders");
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, "../.env"),
});
exports.default = (0, config_1.buildConfig)({
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "",
    collections: [Users_1.Users, Products_1.Products, productFiles_1.ProductFiles, Media_1.Media, Orders_1.orders],
    routes: {
        admin: "/sell",
    },
    admin: {
        user: "users",
        bundler: (0, bundler_webpack_1.webpackBundler)(),
        meta: {
            titleSuffix: "- DigitalHippo",
            favicon: "/favicon.ico",
            ogImage: "/thumbnail.jpg",
        },
    },
    editor: (0, richtext_slate_1.slateEditor)({}),
    db: (0, db_mongodb_1.mongooseAdapter)({ url: process.env.MONGODB_URL }),
    // by default paylaod sets rateLimit to 500 which can be low for dev, we can decrease it after deployment if needed
    rateLimit: {
        max: 2000,
    },
    // exports the types of the collections [e.g. user, customer, product] in this file so we can use them around our application
    typescript: {
        outputFile: path_1.default.resolve(__dirname, "payload.types.ts"),
    },
});
