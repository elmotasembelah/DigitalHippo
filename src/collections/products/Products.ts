import {
  BeforeChangeHook,
  AfterChangeHook,
} from "payload/dist/collections/config/types";
import { PRODUCT_CATEGORIES } from "../../config/";
import { Access, CollectionConfig } from "payload/types";
import { Product, User } from "@/payload.types";
import { stripe } from "../../lib/stripe";

const addUser: BeforeChangeHook<Product> = async ({ req, data }) => {
  const user = req.user;
  return { ...data, user };
};

const onCreateAddStripeIdAndPriceId = async (product: Product) => {
  const createdProduct = await stripe.products.create({
    name: product.name,
    default_price_data: {
      currency: "USD",
      unit_amount: Math.round(product.price * 100), // we need to transform the usd price coming rom the dashbaord to cents
    },
  });
  const updated: Product = {
    ...product,
    stripeId: createdProduct.id,
    priceId: createdProduct.default_price as string,
  };

  return updated;
};

const onUpdateAddStripeAndPriceId = async (product: Product) => {
  const updatedProduct = await stripe.products.update(product.stripeId!, {
    name: product.name,
    default_price: product.priceId!,
  });

  const updated: Product = {
    ...product,
    stripeId: updatedProduct.id,
    priceId: updatedProduct.default_price as string,
  };

  return updated;
};

// add the created product to the user that created it
const syncUser: AfterChangeHook<Product> = async ({ req, doc }) => {
  const fullUser = await req.payload.findByID({
    collection: "users",
    id: req.user.id,
  });

  if (fullUser && typeof fullUser === "object") {
    const { products } = fullUser;

    const allIDs = [
      ...(products?.map((product) =>
        typeof product === "object" ? product.id : product
      ) || []),
    ];

    const createdProductIDs = allIDs.filter(
      (id, index) => allIDs.indexOf(id) === index
    );

    const dataToUpdate = [...createdProductIDs, doc.id];

    await req.payload.update({
      collection: "users",
      id: fullUser.id,
      data: {
        products: dataToUpdate,
      },
    });
  }
};

const isAdminOrHasAccess =
  (): Access =>
  ({ req: { user: _user } }) => {
    const user = _user as User | undefined;

    if (!user) return false;
    if (user.role === "admin") return true;

    const userProductIDs = (user.products || []).reduce<Array<string>>(
      (accumelator, product) => {
        if (!product) return accumelator;
        if (typeof product === "string") {
          accumelator.push(product);
        } else {
          accumelator.push(product.id);
        }

        return accumelator;
      },
      []
    );

    return {
      id: {
        in: userProductIDs,
      },
    };
  };

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
  },
  access: {
    read: isAdminOrHasAccess(),
    update: isAdminOrHasAccess(),
    delete: isAdminOrHasAccess(),
  },
  hooks: {
    beforeChange: [
      addUser,
      async (args) => {
        const product = args.data as Product;

        if (args.operation === "create") {
          return onCreateAddStripeIdAndPriceId(product);
        } else if (args.operation === "update") {
          return onUpdateAddStripeAndPriceId(product);
        }
      },
    ],
    afterChange: [syncUser],
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users", // slug of the colletion with relation to
      required: true,
      hasMany: false,
      admin: {
        condition: () => false, // doesn't appear on the admin dashboard
      },
    },
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
    },
    {
      name: "price",
      type: "number",
      label: "Price in USD",
      min: 0,
      max: 10000,
      required: true,
    },
    {
      name: "category",
      type: "select",
      options: PRODUCT_CATEGORIES.map(({ label, value }) => ({ label, value })),
      label: "Category",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
      label: "Product details",
    },
    {
      name: "product_files",
      type: "relationship",
      relationTo: "product_files",
      label: "Product file(s)",
      required: true,
      hasMany: false,
    },
    {
      name: "approvedForSale",
      type: "select",
      options: [
        {
          label: "pending verification",
          value: "pending",
        },
        {
          label: "Approved",
          value: "approved",
        },
        {
          label: "Denied",
          value: "denied",
        },
      ],
      label: "Product Status",
      defaultValue: "pending",
      access: {
        create: ({ req }) => req.user.role === "admin",
        read: ({ req }) => req.user.role === "admin",
        update: ({ req }) => req.user.role === "admin",
      },
    },
    {
      name: "priceId",
      type: "text",
      access: {
        // no one should be able to change this
        create: () => false,
        read: () => false,
        update: () => false,
      },
      admin: {
        hidden: true, // to not show on the admin paneم
      },
    },
    {
      name: "stripeId",
      type: "text",
      access: {
        // no one should be able to change this
        create: () => false,
        read: () => false,
        update: () => false,
      },
      admin: {
        hidden: true, // to not show on the admin paneم
      },
    },
    {
      name: "images",
      type: "array",
      label: "Product images",
      minRows: 1,
      maxRows: 4,
      required: true,
      labels: {
        //
        singular: "Image",
        plural: "Images",
      },
      fields: [
        // when we make a field an array we have to define fields for each element
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
  ],
};
