// the config file for payload
import { webpackBundler } from "@payloadcms/bundler-webpack";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { slateEditor } from "@payloadcms/richtext-slate";
import path from "path";
import { buildConfig } from "payload/config";
import { Users } from "./collections/Users";
import dotenv from "dotenv";
import { Products } from "./collections/products/Products";
import { Media } from "./collections/Media";
import { ProductFiles } from "./collections/productFiles";
import { orders } from "./collections/Orders";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "",
  collections: [Users, Products, ProductFiles, Media, orders],
  routes: {
    admin: "/sell",
  },
  admin: {
    user: "users",
    bundler: webpackBundler(),
    meta: {
      titleSuffix: "- DigitalHippo",
      favicon: "/favicon.ico",
      ogImage: "/thumbnail.jpg",
    },
  },
  editor: slateEditor({}),
  db: mongooseAdapter({ url: process.env.MONGODB_URL! }),
  // by default paylaod sets rateLimit to 500 which can be low for dev, we can decrease it after deployment if needed
  rateLimit: {
    max: 2000,
  },
  // exports the types of the collections [e.g. user, customer, product] in this file so we can use them around our application
  typescript: {
    outputFile: path.resolve(__dirname, "payload.types.ts"),
  },
});
