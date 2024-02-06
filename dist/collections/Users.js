"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
var PrimaryActionEmail_1 = require("../components/emails/PrimaryActionEmail");
var adminsAndUser = function (_a) {
    var user = _a.req.user;
    if (user.role === "admin") {
        return true;
    }
    return {
        id: {
            equals: user.id,
        },
    };
};
exports.Users = {
    slug: "users",
    auth: {
        verify: {
            generateEmailHTML: function (_a) {
                var token = _a.token;
                return (0, PrimaryActionEmail_1.PrimaryActionEmailHtml)({
                    actionLabel: "verify your account",
                    buttonText: "Verify Account",
                    href: "".concat(process.env.NEXT_PUBLIC_SERVER),
                });
            },
        },
    },
    access: {
        read: adminsAndUser,
        create: function () { return true; },
        update: function (_a) {
            var user = _a.req.user;
            return user.role === true;
        }, // same as req.user.role
        delete: function (_a) {
            var user = _a.req.user;
            return user.role === true;
        }, // same as req.user.role
    },
    admin: {
        hidden: function (_a) {
            var user = _a.user;
            return user.role !== "admin";
        },
        defaultColumns: ["id"],
    },
    fields: [
        {
            name: "role",
            type: "select",
            options: [
                { label: "Admin", value: "admin" },
                { label: "User", value: "user" },
            ],
            defaultValue: "user",
            required: true,
            admin: {
                condition: function () { return true; },
            },
        },
        {
            name: "products",
            label: "Products",
            type: "relationship",
            relationTo: "products",
            admin: {
                condition: function () { return false; },
            },
            hasMany: true,
        },
        {
            name: "product_files",
            label: "Product Files",
            type: "relationship",
            relationTo: "product_files",
            admin: {
                condition: function () { return false; },
            },
            hasMany: true,
        },
    ],
};
