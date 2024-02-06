"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { buttonVariants } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from ".././ui/sheet";
import { Separator } from "@radix-ui/react-separator";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import CartItem from "./cart-item/CartItem";
import { ScrollArea } from "@radix-ui/react-scroll-area";

const Cart = () => {
  const items = useCart((state) => state.items);
  const itemsCount = items.length;
  const cartTotal = items.reduce((total, { product }) => {
    return total + product.price;
  }, 0);

  const arr = new Array(50).fill(123);

  const transactionFee = 1;
  return (
    <Sheet>
      <SheetTrigger className=" group -m-2 flex items-center p-2">
        <ShoppingCart
          aria-hidden="true"
          className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
        />
        <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
          {itemsCount}
        </span>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg  ">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle>Cart ({itemsCount})</SheetTitle>
        </SheetHeader>
        {itemsCount > 0 ? (
          <>
            <div className="flex flex-col pr-6 w-full ">
              <ScrollArea className="">
                {items.map(({ product }) => (
                  <CartItem key={product.id} product={product} />
                ))}
              </ScrollArea>
            </div>
            <div className="space-y-2.5 pr-6 ">
              <Separator />
              <div className="space-y-1.5 text-sm ">
                <div className="flex">
                  <span className="flex-1">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex">
                  <span className="flex-1">Transaction Fee</span>
                  <span>{formatPrice(transactionFee)}</span>
                </div>
                <div className="flex">
                  <span className="flex-1">Total</span>
                  <span>{formatPrice(cartTotal + transactionFee)}</span>
                </div>
              </div>
              <SheetFooter>
                <SheetTrigger asChild>
                  <Link
                    href="/cart"
                    className={buttonVariants({
                      className: "w-full",
                    })}
                  >
                    Continuo to Checkout
                  </Link>
                </SheetTrigger>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center space-y-1 ">
            <div className="relative h-60 w-60  mb-4 " aria-hidden="true">
              <Image
                src="/hippo-empty-cart.png"
                fill
                alt="hippo holding empty cart"
              ></Image>
            </div>
            <p className="text-xl font-semibold">Your cart is empty</p>
            <SheetTrigger
              asChild
              className={buttonVariants({ variant: "link" })}
            >
              <Link href="/products"> Add items to your cart to checkout</Link>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
