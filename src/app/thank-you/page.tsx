import PaymentStatus from "@/components/PaymentStatus";
import { PRODUCT_CATEGORIES } from "@/config";
import { getPayloadClient } from "@/get-payload";
import { getServerSideUser } from "@/lib/getServerSideUser";
import { formatPrice } from "@/lib/utils";
import { Product, ProductFile, User } from "@/payload.types";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

interface pageProps {
  searchParams: { [key: string]: string | string[] | null };
}

const ThankYouPage = async ({ searchParams }: pageProps) => {
  const orderId = searchParams.orderId;
  const nextCookies = cookies();

  const { user } = await getServerSideUser(nextCookies);

  if (!user) {
    redirect(`/sign-in/origin=thank-you?orderId=${orderId}`);
  }

  const payload = await getPayloadClient();
  const { docs: orders } = await payload.find({
    collection: "orders",
    depth: 2,
    where: {
      id: {
        equals: orderId,
      },
    },
  });

  const [order] = orders;

  if (!order) {
    return notFound;
  }

  const orderUserId =
    typeof order.user === "string" ? order.user : order.user.id;

  if (orderUserId !== user?.id) {
    redirect("/");
  }

  const subtotal = (order.products as Product[]).reduce(
    (total, product) => total + product.price,
    0
  );

  return (
    <main className="relative lg:min-h-full ">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 ">
        <div className="mx-auto w-full lg:w-1/2 px-4">
          <p className="text-sm font-medium text-blue-600">Order successful</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Thank you for buying
          </h1>
          {order._isPaid === false ? (
            <p className="mt-2 text-base text-muted-foreground">
              Your order was processed and your assets are available to download
              below. We&apos;ve sent your receipt and order details to{" "}
              {typeof order.user !== "string" && (
                <span className="font-medium text-gray-900">
                  {order.user.email}
                </span>
              )}
            </p>
          ) : (
            <p className="mt-2 text-base text-muted-foreground">
              We appreciate your order, and we &apos; re currently processing
              it. So hand tight and we&apos;ll send you confirmation very soon!
            </p>
          )}

          <div className="mt-16 text-sm font-medium">
            <div className="text-muted-foreground">Order number.</div>
            <div className="mt-2 text-gray-900">{order.id}</div>

            <ul className="mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-muted-foreground">
              {(order.products as Product[]).map((product) => {
                const label = PRODUCT_CATEGORIES.find(
                  ({ value }) => value === product.category
                )?.label;

                const downloadUrl = (product.product_files as ProductFile)
                  .url as string;

                const { image } = product.images[0];

                return (
                  <li key={product.id} className="flex space-x-6 py-6">
                    <div className="relative h-24 w-24">
                      {typeof image !== "string" && image.url ? (
                        <Image
                          src={image.url}
                          alt={product.name}
                          fill
                          className="flex-none rounded-md bg-gray-100 object-cover object-center"
                        />
                      ) : null}
                    </div>

                    <div className="flex-auto flex flex-col justify-between ">
                      <div className="space-y-1">
                        <h3 className="text-gray-900 sm:text-lg">
                          {product.name}
                        </h3>

                        <p className="my-1">Category: {label}</p>
                      </div>

                      {order._isPaid === false ? (
                        <a
                          href={downloadUrl}
                          download={product.name}
                          className="text-blue-600 hover:underline underline-offset-2"
                        >
                          Download asset
                        </a>
                      ) : null}
                    </div>

                    <p className="flex-none font-medium text-gray-900">
                      {formatPrice(product.price)}
                    </p>
                  </li>
                );
              })}
            </ul>

            <div className="space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-muted-foreground ">
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p className="text-gray-900">{formatPrice(subtotal)}</p>
              </div>
              <div className="flex justify-between">
                <p>Transaction fee</p>
                <p className="text-gray-900">{formatPrice(1)}</p>
              </div>

              <div className="flex items-center justify-between border-t border-t-gray-200 pt-6 text-gray-900">
                <p className="text-base">Total</p>
                <p className="text-base">{formatPrice(subtotal + 1)}</p>
              </div>
            </div>

            <PaymentStatus
              isPaid={order._isPaid}
              orderEmail={(order.user as User).email}
              orderId={order.id}
            />

            <div className="mt-16 border-t border-gray-200 py-6 text-center">
              <Link
                href={"/products"}
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Continue Shopping &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ThankYouPage;
