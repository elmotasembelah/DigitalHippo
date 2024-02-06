import { User } from "@/payload.types";
import { Access, CollectionConfig } from "payload/types";

const yourOwn: Access = ({ req }) => {
  const { user } = req;

  if (user.role.admin === "admin") return true;

  return {
    user: {
      equals: user?.id,
    },
  };
};

export const orders: CollectionConfig = {
  slug: "orders",
  admin: {
    useAsTitle: "Your Orders", // use this as the title of this collection in the admin dashboard
    description: " A summary of all your orders on DigitalHippo",
  },
  access: {
    read: yourOwn,
    create: ({ req }) => req.user.role === "admin",
    update: ({ req }) => req.user.role === "admin",
    delete: ({ req }) => req.user.role === "admin",
  },
  fields: [
    {
      name: "_isPaid", // the _ at the start means an intenal value
      type: "checkbox", // checkbox is the same as boolean
      access: {
        read: ({ req }) => {
          return req.user.role === "admin";
        },
        create: () => false,
        update: () => false,
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
