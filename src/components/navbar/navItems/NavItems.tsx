"use client";
import { PRODUCT_CATEGORIES } from "@/config";
import { useState, useRef, useEffect } from "react";
import NavItem from "./navItem/NavItem";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";

const NavItems = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const isAnyOpen = activeIndex !== null;

  const navRef = useRef<HTMLDivElement | null>(null);

  useOnClickOutside(navRef, () => {
    setActiveIndex(null);
  });

  useEffect(() => {
    const closeOnPressingEscapeHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveIndex(null);
      }
    };

    document.addEventListener("keydown", closeOnPressingEscapeHandler);

    // clean up, we remove the evenet listner when the component is removed
    return () => {
      document.removeEventListener("keydown", closeOnPressingEscapeHandler);
    };
  }, []);

  return (
    <div className="flex gap-4 h-full" ref={navRef}>
      {PRODUCT_CATEGORIES.map((category, i) => {
        const handleOpen = () => {
          // if it is the open category, set active to null cause it will close
          if (activeIndex === i) {
            setActiveIndex(null);
          } else [setActiveIndex(i)];
        };

        const isOpen = i === activeIndex;

        return (
          <NavItem
            key={category.label}
            category={category}
            handleOpen={handleOpen}
            isOpen={isOpen}
            isAnyOpen={isAnyOpen}
          />
        );
      })}
    </div>
  );
};

export default NavItems;
