// this is where we will create the endpoint of our backend
"use client";
import { getPayloadClient } from "../get-payload";
import { QueryValidator } from "../lib/validators/query-validator";
import { authRouter } from "./authRouter";
import { paymentRouter } from "./payment-router";
import { publicProcedure, router } from "./trpc";
import { z } from "zod";

export const appRouter = router({
  auth: authRouter,
  payment: paymentRouter,

  getInfiniteProducts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        cursor: z.number().nullish(), // using cursor keyword allows us to use useInfiniteQuery in trpc/tanstack query
        query: QueryValidator,
      })
    )
    .query(async ({ input }) => {
      const { query, cursor } = input;
      const { limit, sort, ...queryOptions } = query; // ...queryOptions mean put the rest in an object called queryOptions which makes the query extednable for the future (reverse destructure)

      // this is defing the object that will contain all the options in a payload ready shape
      const parsedQueryOptions: Record<string, { equals: string }> = {};

      // we are putting all the options into payload ready shape so we can put them dynamicly into the payload request
      Object.entries(queryOptions).forEach(([key, value]) => {
        parsedQueryOptions[key] = {
          equals: value,
        };
      });

      const page = cursor || 1; // works as the skip in normal apis (mongoose)

      const payload = await getPayloadClient();

      // pagination docs https://payloadcms.com/docs/queries/pagination#pagination (check the example response)
      const {
        docs: products,
        hasNextPage,
        nextPage,
      } = await payload.find({
        collection: "products",
        where: {
          approvedForSale: {
            equals: "approved",
          },
          ...parsedQueryOptions,
        },
        sort,
        depth: 1,
        limit,
        page,
      });

      return { products, nextPage: hasNextPage ? nextPage : null };
    }),

  greet: publicProcedure
    .input((val: unknown) => {
      if (typeof val === "string") return val;
      throw new Error(`invalid input: ${typeof val}`);
    })
    .query(({ input }) => {
      return { greeding: `hello ${input}` };
    }),
});

export type AppRouter = typeof appRouter;
