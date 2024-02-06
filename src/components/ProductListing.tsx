"use client";
import { Product } from "@/payload.types";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import { cn, formatPrice } from "@/lib/utils";
import { PRODUCT_CATEGORIES } from "@/config";
import ImageSlider from "./ImageSlider";

interface ProductListingProps {
  product: Product | null;
  index: number;
}

const ProductPlaceholder = () => (
  <div className="flex flex-col w-full">
    <div className="relative bg-zinc-100 aspect-square w-full overflow-hidden rounded-lg">
      <Skeleton className="w-full h-full" />
    </div>
    <Skeleton className="mt-4 w-2/3 h4 rounded-lg" />
    <Skeleton className="mt-2 w-16 h4 rounded-lg" />
    <Skeleton className="mt-2 w-12 h4 rounded-lg" />
  </div>
);

const ProductListing = ({ product, index }: ProductListingProps) => {
  const [isVisible, setIsVisible] = useState(false); // to create the staggerd animation

  // stagger effect
  useEffect(() => {
    const delayFactorMS = 75;
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * delayFactorMS);

    return () => clearTimeout(timer);
  }, [index]);

  if (!product || !isVisible) return <ProductPlaceholder />;

  // product.category can be ui_kits but we want the ui kits which is the label in product Categories
  const label = PRODUCT_CATEGORIES.find(
    ({ value }) => value === product.category
  )?.label;

  const validUrls = product.images
    .map(({ image }) => (typeof image === "string" ? image : image.url))
    .filter(Boolean) as string[]; // filter(Boolean) is used to remove all null and undefined from the array

  if (product && isVisible)
    return (
      <Link
        className={cn(`invisible w-full h-full group/main`, {
          "visible animate fade-in-5": isVisible,
        })}
        href={`/product/${product.id}`}
      >
        <div className="flex flex-col w-full">
          <ImageSlider urls={validUrls} />
          <h3 className="mt-4 font-medium text-sm text-gray-700">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{label}</p>
          <p className="mt-1 font-medium text-sm text-gray-900">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    );

  return <div></div>;
};

export default ProductListing;
