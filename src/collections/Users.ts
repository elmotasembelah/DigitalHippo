import { text } from "body-parser";
import { PrimaryActionEmailHtml } from "../components/emails/PrimaryActionEmail";
import { User } from "payload/dist/auth";
import { Access, CollectionConfig } from "payload/types";

const adminsAndUser: Access = ({ req: { user } }) => {
  if (user.role === "admin") {
    return true;
  }

  return {
    id: {
      equals: user.id,
    },
  };
};

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    verify: {
      generateEmailHTML: ({ token }) => {
        return PrimaryActionEmailHtml({
          actionLabel: "verify your account",
          buttonText: "Verify Account",
          href: `${process.env.NEXT_PUBLIC_SERVER}`,
        });
      },
    },
  },
  access: {
    read: adminsAndUser,
    create: () => true,
    update: adminsAndUser,
    delete: ({ req: { user } }) => user.role === "admin", // same as req.user.role
  },
  admin: {
    hidden: ({ user }) => user.role !== "admin",
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
        condition: () => true,
      },
    },

    {
      name: "products",
      label: "Products",
      type: "relationship",
      relationTo: "products",
      admin: {
        condition: () => false,
      },
      hasMany: true,
    },
    {
      name: "product_files",
      label: "Product Files",
      type: "relationship",
      relationTo: "product_files",
      admin: {
        condition: () => false,
      },
      hasMany: true,
    },
  ],
};
