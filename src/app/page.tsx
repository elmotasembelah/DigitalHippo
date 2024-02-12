import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductReel from "@/components/ProductReel";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowDownToLine, CheckCircle, Leaf } from "lucide-react";
import Link from "next/link";

const perks = [
  {
    name: "Instant Delivery",
    icon: ArrowDownToLine,
    discription:
      "Get you assets deliverd to your email in seconds and download them right away.",
  },
  {
    name: "Guaranteed Quality",
    icon: CheckCircle,
    discription:
      "Every asset on our platform is verified byour team to ensure our highest quality standerds. Not happy? We offer 30-day refund guarantee.",
  },
  {
    name: "For the Planet",
    icon: Leaf,
    discription:
      "We've Pledged 10% of sales to the preservation and restoration of the natural environment",
  },
];

export default function Home() {
  return (
    <>
      {/* hero section */}
      <MaxWidthWrapper className="">
        <div className="py-20 flex flex-col mx-auto text-center items-center max-w-3xl ">
          <h1 className="text-4xl capitalize text-gray-900 font-bold tracking-tight sm:text-6xl ">
            Your marketplace for high-quality{" "}
            <span className="text-blue-600">digital assets</span>
          </h1>
          <p className="mt-6 text-lg max-w-prose text-muted-foreground">
            Welcome to DigitalHippo. Every asset on our platform is verified by
            our team to ensure our highest quality standards
          </p>
          <div className="flex flex-col mt-6">
            <Link href="/products" className={buttonVariants()}>
              Browse Trending
            </Link>
          </div>
        </div>
        {/* products */}
        <ProductReel
          title="Products"
          subtitle="These are some of the available products"
          href="/products"
          query={{ sort: "asc", limit: 12 }}
        />
        {/* perks section */}
      </MaxWidthWrapper>
      <section className="border-t border-gray-200 bg-gray-50">
        <MaxWidthWrapper className="py-20">
          <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0 mx-14">
            {perks.map((perk) => (
              <div
                key={perk.name}
                className="text-center md:flex md:items-start md:text-left lg:block lg:text-center"
              >
                <div className="md:flex-shrink-0 flex justify-center">
                  <div className="h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-900">
                    {<perk.icon className="width-1/3 height-1/3 " />}
                  </div>
                </div>

                <div>
                  <div className="mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6 ">
                    <h3 className="text-base font-medium text-gray-900">
                      {perk.name}
                    </h3>
                    <p className="mt-3 text-muted-foreground text-sm ">
                      {perk.discription}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>
      </section>
    </>
  );
}
