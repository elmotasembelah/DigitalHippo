"use client";

import { PRODUCT_CATEGORIES } from "@/config";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import UserOptions from "./userOptions/UserOptions";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const mobileNavRef = useRef<HTMLDivElement | null>(null);

  // to close the menu when we click outside the menu
  useOnClickOutside(mobileNavRef, () => {
    closeMenu();
  });

  const openMenu = () => {
    setIsOpen(true);
    document.body.classList.add("overflow-hidden");
  };
  const closeMenu = () => {
    setIsOpen(false);
    document.body.classList.remove("overflow-hidden");
  };

  if (!isOpen)
    return (
      <button
        type="button"
        onClick={openMenu}
        className="lg:hidden relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 "
      >
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>
    );

  return (
    <div>
      <div className="relative z-40 lg:hidden">
        <div className="fixed inset-0 bg-black bg-opacity-25" />
      </div>

      <div className="fixed overflow-y-scroll overscroll-y-none inset-0 z-40 flex lg:hidden  ">
        <div className="w-4/5">
          <div
            className="relative flex w-full max-w-sm flex-col overflow-y-auto bg-white pb-12 shadow-xl"
            ref={mobileNavRef}
          >
            <div className="flex justify-between px-4 pb-2 pt-5">
              <button
                type="button"
                onClick={closeMenu}
                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div>
              <UserOptions closeMenu={closeMenu} />
            </div>

            <div className="mt-2">
              <ul>
                {PRODUCT_CATEGORIES.map((category) => (
                  <li
                    key={category.label}
                    className="space-y-10 px-4 pb-8 pt-10 border-b border-gray-200"
                  >
                    <div className="">
                      <div className="-mb-px flex">
                        <p className="border-transparent text-gray-900 flex-1 whitespace-nowrap border-b-2 py-4 text-base font-medium text-center">
                          {category.label}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-y-10 gap-x-4">
                      {category.featured.map((item) => (
                        <div key={item.name} className="group relative text-sm">
                          <Link
                            onClick={closeMenu}
                            href={item.href}
                            className=" block font-medium text-gray-900 text-center"
                          >
                            <div className="mb-4 relative aspect-square overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75 ">
                              <Image
                                fill
                                src={item.imageSrc}
                                alt="product category image"
                                className="object-cover object-center"
                              />
                            </div>
                            {item.name}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
