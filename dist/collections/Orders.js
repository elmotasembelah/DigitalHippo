"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orders = void 0;
var yourOwn = function (_a) {
    var req = _a.req;
    var user = req.user;
    if (user.role.admin === "admin")
        return true;
    return {
        user: {
            equals: user === null || user === void 0 ? void 0 : user.id,
        },
    };
};
exports.orders = {
    slug: "orders",
    admin: {
        useAsTitle: "Your Orders", // use this as the title of this collection in the admin dashboard
        description: " A summary of all your orders on DigitalHippo",
    },
    access: {
        read: yourOwn,
        create: function (_a) {
            var req = _a.req;
            return req.user.role === "admin";
        },
        update: function (_a) {
            var req = _a.req;
            return req.user.role === "admin";
        },
        delete: function (_a) {
            var req = _a.req;
            return req.user.role === "admin";
        },
    },
    fields: [
        {
            name: "_isPaid", // the _ at the start means an intenal value
            type: "checkbox", // checkbox is the same as boolean
            access: {
                read: function (_a) {
                    var req = _a.req;
                    return req.user.role === "admin";
                },
                create: function () { return false; },
                update: function () { return false; },
            },
            hidden: true,
            required: true,
        },
        {
            name: "user",
            type: "relationship",
            relationTo: "users",
            admin: {
                hidden: true,
            },
            required: true,
        },
        {
            name: "products",
            type: "relationship",
            relationTo: "products",
            required: true,
            hasMany: true,
        },
    ],
};
