import { BeforeChangeHook } from "payload/dist/collections/config/types";
import { User } from "../payload.types";
import { Access, CollectionConfig } from "payload/types";

const addUser: BeforeChangeHook = ({ req, data }) => {
  const user = req.user as User | null;
  return { ...data, user: user?.id };
};

const youOwnAndPurchesed: Access = async ({ req }) => {
  const user = req.user as User | null;

  if (user?.role === "admin") return true;
  if (!user) return false;
  //   products the seller has put for sale

  const { docs: products } = await req.payload.find({
    collection: "products",
    depth: 0,
    where: {
      user: {
        equals: user.id,
      },
    },
  });

  //   products_files from the products the seller has put for sale
  const ownProductFilesIds = products.map((product) => {
    product.product_files;
  });

  //   all the orders made by the user
  const { docs: orders } = await req.payload.find({
    collection: "orders",
    depth: 2, // depth doc https://payloadcms.com/docs/getting-started/concepts#depth
    where: {
      user: {
        equals: user.id,
      },
    },
  });

  //   products_files the user bought
  const purchasedProductFilesIds = orders.map((order) => {
    return order.products.map((product) => {
      if (typeof product === "string")
        return req.payload.logger.error(
          "Search depth not sufficient to find purchased files iDs"
        );
      return typeof product.product_files === "string"
        ? product.product_files
        : product.product_files.id;
    });
  });

  // if the id of the product_file is in this array, return it
  return {
    id: {
      in: [...ownProductFilesIds, ...purchasedProductFilesIds], // we mix the two arrays so it has all the ids we want to check
    },
  };
};

export const ProductFiles: CollectionConfig = {
  slug: "product_files",
  admin: {
    hidden: ({ user }) => {
      return user.role !== "admin";
    },
  },
  hooks: {
    beforeChange: [addUser],
  },
  access: {
    read: youOwnAndPurchesed,
    // sellers can't change or delete the product_files they have uploaded, only through admins they can
    update: ({ req }) => req.user.role === "admin",
    delete: ({ req }) => req.user.role === "admin",
  },
  upload: {
    staticDir: "product_files",
    staticURL: "/product_files",
    mimeTypes: ["image/*", "font/", "application/postscrupt"],
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      admin: {
        condition: () => false,
      },
      required: true,
    },
  ],
};
