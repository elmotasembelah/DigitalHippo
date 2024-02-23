"use client";
import { Button } from "@/components/ui/button";
import { PRODUCT_CATEGORIES } from "@/config";
import { useCart } from "@/hooks/use-cart";
import { cn, formatPrice } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { error } from "console";
import { Check, ImageIcon, Loader2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const CartPage = () => {
  const transactionFee = 1;
  const items = useCart((state) => state.items);
  const removeItem = useCart((state) => state.removeItem);

  const cartTotal = items.reduce(
    (total, { product }) => total + product.price,
    0
  );

  const productIds = items.map(({ product }) => product.id);

  const router = useRouter();

  const { mutate: createCheckoutSession, isLoading } =
    trpc.payment.createSesstion.useMutation({
      onSuccess: ({ url }) => {
        if (url) {
          router.push(url);
        }
      },
      onError: (error) => {
        if (error.data?.code === "UNAUTHORIZED") {
          toast.error("You need to be signed in to checkout");

          router.push("/sign-in?origin=cart");
        }
      },
    });

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Shopping Cart
        </h1>

        {/* inner ocntainer */}
        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16 ">
          {/* cart grid container */}
          <div
            className={cn("lg:col-span-7", {
              "rounded-lg border-2 border-dashed border-zinz-200 p-12 ":
                items.length === 0,
            })}
          >
            <h2 className="sr-only">Items in your shopping cart</h2>

            {/* empty cart case */}
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center space-y-1 ">
                <div
                  aria-hidden="true"
                  className="relative mb-4 h-40 w-40 text-muted-foreground"
                >
                  <Image
                    src="/hippo-empty-cart.png"
                    alt="empty shopping cart"
                    fill
                    loading="eager"
                  />
                </div>
                <h3 className="font-semibold text-xl">Your cart is empty</h3>
                <p className="text-muted-foreground text-center">
                  Whoops! Nothing to show here yet.
                </p>
              </div>
            ) : null}

            {/* cart has items case */}

            {/* list if products */}
            <ul
              className={cn({
                "divide-y divide-gray-500 border-b border-t border-gray-200":
                  items.length > 0,
              })}
            >
              {/* each product */}
              {items.map(({ product }) => {
                const label = PRODUCT_CATEGORIES.find(
                  (category) => category.value === product.category
                )?.label;

                const { image } = product.images[0];

                return (
                  <li key={product.id} className="flex py-6 sm:py-10">
                    <div className="flex-shrink-0">
                      {/* product image */}
                      <div className="relative h-24 w-24">
                        {typeof image !== "string" && image.url ? (
                          <Image
                            src={image.url}
                            fill
                            alt="product"
                            className="h-full w-full rounded-md object-cover object-center sm:h-48 sm:w-48"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-secondary">
                            <ImageIcon
                              aria-hidden="true"
                              className="h-14 w-14 text-muted-foreground"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    {/* product details */}
                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                          {/* name */}
                          <div className="flex justify-between">
                            <h3 className="text-sm">
                              <Link
                                href={`/product/${product.id}`}
                                className="font-medium text-gray-900 hover:text-gray-800"
                              >
                                {product.name}
                              </Link>
                            </h3>
                          </div>

                          {/* categoy */}
                          <div className="mt-1 flex text-sm">
                            <p className="text-muted-foreground">
                              Category: {label}
                            </p>
                          </div>
                          {/* price */}
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            {formatPrice(product.price)}
                          </p>
                        </div>

                        {/* remove button */}
                        <div className="mt-4 sm:mt-0 smpr- w-20">
                          <div className="absolute right-0 top-0">
                            <Button
                              aria-label="remove product from cart"
                              onClick={() => removeItem(product.id)}
                              variant={"ghost"}
                            >
                              <X className="h-5 w-5" aria-hidden="true" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                        <Check className="h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>Eligible for instant delivery</span>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8 ">
            <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

            {/* subtotal */}
            <div className="mt-6 space-y-4 ">
              <div className="flex items-center justify-between ">
                <p className="text-sm text-gray-600">Subtotal</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatPrice(cartTotal)}
                </p>
              </div>

              {/* flat transaction fee */}
              <div className="flex items-center justify-between border-t border-gray-200">
                <div className="flex items-center text-sm text-muted-foreground">
                  <span className="">Flat Transaction Fee</span>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {formatPrice(transactionFee)}
                </div>
              </div>

              {/* total */}
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="text-base font-medium text-gray-900 ">
                  Order Total
                </div>
                <div className="text-base font-medium text-gray-900">
                  {formatPrice(cartTotal + transactionFee)}
                </div>
              </div>
            </div>

            {/* checkout cart */}
            <div className="mt-6">
              <Button
                onClick={() => createCheckoutSession({ productIds })}
                className="w-full "
                size={"lg"}
                disabled={items.length === 0 || isLoading}
              >
                {isLoading && (
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                )}
                Checkout
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
