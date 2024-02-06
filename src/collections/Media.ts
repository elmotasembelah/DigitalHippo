// this collection works as a database for media to be uploaded to (part of products schema)
import { equal } from "assert";
import { User } from "../payload.types";
import { Access, CollectionConfig } from "payload/types";

const isAdminOrHasAccessToImages: Access = async ({ req }) => {
  const user = req.user as User | undefined;

  if (!user) return false;
  if (user.role === "admin") return true;

  // this query constraint means that if the user field on the image equals the user id in the requesting user then give them acces, other than that don't give them access
  return {
    user: {
      equals: req.user.id,
    },
  };
};

export const Media: CollectionConfig = {
  slug: "media",
  hooks: {
    beforeChange: [
      // this runs on creation and on change (payload docs)
      ({ req, data }) => {
        return { ...data, user: req.user.id };
      },
    ],
  },
  admin: {
    hidden: ({ user }) => {
      // user is destructed from the req
      return user.role !== "admin";
    },
  },
  access: {
    read: async ({ req }) => {
      const referer = req.headers.referer;

      if (!req.user || !referer?.includes("sell")) {
        // is there is no user logged in or the link doesn't include sell, return all images (browsing the website normaly)
        return true;
      }

      return await isAdminOrHasAccessToImages({ req });
    },
    delete: isAdminOrHasAccessToImages,
    update: isAdminOrHasAccessToImages,
  },
  upload: {
    staticURL: "/media",
    staticDir: "media",
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 300,
        position: "centre", // centre === center (payload docs say it's centre not center!)
      },
      {
        name: "card",
        width: 768,
        height: 1024,
        position: "centre",
      },
      {
        name: "tablet",
        width: 1024,
        height: undefined, // will automaticlly calc height according to the aspect ratio of the image
        position: "centre",
      },
    ],
    mimeTypes: ["image/"], // what type of files i can upload
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      hasMany: false,
      admin: {
        // won't show in admin panel
        condition: () => false,
      },
    },
  ],
};
