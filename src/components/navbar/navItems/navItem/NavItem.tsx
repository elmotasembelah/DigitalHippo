"use client";
import { ChevronDown } from "lucide-react";
import { Button } from "../../../ui/button";
import { PRODUCT_CATEGORIES } from "@/config";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

// we generate the new type by using the var as the template, since the var has is an array we don't want caregory to alos be array, so we use the [number] to signel that we only want one
type Category = (typeof PRODUCT_CATEGORIES)[number];

interface NavItemProps {
  category: Category;
  handleOpen: () => void;
  isOpen: boolean;
  isAnyOpen: boolean;
}

const NavItem = ({ category, handleOpen, isOpen, isAnyOpen }: NavItemProps) => {
  return (
    <div className="flex">
      <div className="relative flex items-center">
        <Button
          className="gap-1.5"
          onClick={handleOpen}
          variant={isOpen ? "secondary" : "ghost"}
        >
          {category.label}{" "}
          <ChevronDown
            className={cn("h-4 w-4 transition-all text-muted-foreground", {
              "-rotate-180": isOpen,
            })}
          />
        </Button>
      </div>
      {isOpen ? (
        // outer container
        <div
          className={cn(
            "absolute inset-x-0 top-full text-sm text-muted-foreground",
            { "animate-in fade-in-10 slide-in-from-top-5": isAnyOpen }
          )}
        >
          {/* container bottom shadow */}
          <div
            className="absolute inset-0 top-1/2 bg-white shadow"
            aria-hidden="true"
          />
          <div className="relative bg-white">
            {/* inner container */}
            <div className="mx-auto max-w-7xl px-8">
              <div className="grid grid-cols-4 gap-x-8 gap-y-10 py-16">
                <div className="col-span-4 col-start-1 grid grid-cols-3 gap-x-8">
                  {category.featured.map((item) => (
                    <div
                      key={item.name}
                      className="group relative text-base sm:text-sm"
                    >
                      <Link
                        href={item.href}
                        className=" block font-medium text-gray-900 text-center"
                      >
                        {/* image container */}
                        <div className="relative mb-6 aspect-video overflow-hidden rounded-lg bg-gray-100 group-hover: opacity-75 ">
                          <Image
                            src={item.imageSrc}
                            alt="product category"
                            fill
                            className="object-cover object-center"
                          />
                        </div>

                        {item.name}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default NavItem;
