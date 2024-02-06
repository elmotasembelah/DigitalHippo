import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KET ?? "", {
  apiVersion: "2023-10-16", // this is what was should automaticlly as the auto complite
  typescript: true, // this only creates the flag that we are using typescript, but it don't do anything for now
});
