export const PRODUCT_CATEGORIES = [
  {
    label: "Ui Kits",
    value: "ui_kits" as const,
    featured: [
      {
        name: "Editor Picks",
        href: "/products?category=ui_kits&sort=desc",
        imageSrc: "/nav/ui-kits/mixed.jpg",
      },
      {
        name: "New Arrivals",
        href: "/products?category=ui_kits&sort=desc",
        imageSrc: "/nav/ui-kits/blue.jpg",
      },
      {
        name: "Bestsellers",
        href: "/products?category=ui_kits&sort=desc",
        imageSrc: "/nav/ui-kits/purple.jpg",
      },
    ],
  },
  {
    label: "Icons",
    value: "icons" as const,
    featured: [
      {
        name: "Favorite Icon Picks",
        href: "/products?category=icons&sort=desc",
        imageSrc: "/nav/icons/picks.jpg",
      },
      {
        name: "New Arrivals",
        href: "/products?category=icons&sort=desc",
        imageSrc: "/nav/icons/new.jpg",
      },
      {
        name: "Bestsellering Icons",
        href: "/products?category=icons&sort=desc",
        imageSrc: "/nav/icons/bestsellers.jpg",
      },
    ],
  },
];
