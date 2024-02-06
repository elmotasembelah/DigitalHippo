import { boolean, z } from "zod";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { getPayloadClient } from "../get-payload";
import { Products } from "@/collections/products/Products";
import { stripe } from "../lib/stripe";
import type Stripe from "stripe";

export const paymentRouter = router({
  createSesstion: privateProcedure
    .input(z.object({ productIds: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx; // since we passed the user in the middle ware, we get to use it here in a typesafe manner plus konwing it can't be false
      let { productIds } = input;

      if (productIds.length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const payload = await getPayloadClient();

      const { docs: products } = await payload.find({
        collection: "products",
        where: {
          id: {
            in: productIds,
          },
        },
      });

      const filteredProducts = products.filter((product) =>
        Boolean(product.priceId)
      );

      const order = await payload.create({
        collection: "orders",
        data: {
          _isPaid: false, // this will be true when we are sure that the order has been payed
          products: filteredProducts.map((product) => product.id),
          user: user.id,
        },
      });

      //   we use this to tell stripe what are the items the user is paying for
      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

      filteredProducts.forEach((product) => {
        line_items.push({
          price: product.priceId!,
          quantity: 1,
        });
      });

      line_items.push({
        price: "price_1OfPMWFTPqNRH4gUVNzAbbTn", // this is the price id of the transaction fe from stripe dashboard (9.38.14 video)
        quantity: 1,
        adjustable_quantity: {
          // can i put more than one of this item, in our case no
          enabled: false,
        },
      });

      try {
        const stripeSession = await stripe.checkout.sessions.create({
          success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
          cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
          payment_method_types: ["card"],
          mode: "payment", // only one payment in a subscription
          metadata: {
            // this is given back to us when the session is successful
            userid: user.id,
            orderId: order.id,
          },
          line_items,
        });

        return { url: stripeSession.url }; // success url
      } catch (error) {
        console.log(error);

        return { url: null };
      }
    }),
  pollOrderStatus: privateProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ input }) => {
      const orderId = input;

      const payload = await getPayloadClient();
      const { docs: orders } = await payload.find({
        collection: "orders",
        limit: 1,
        where: {
          id: {
            equals: orderId,
          },
        },
      });

      if (orders.length) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const [order] = orders;

      return { isPaid: order._isPaid };
    }),
});
