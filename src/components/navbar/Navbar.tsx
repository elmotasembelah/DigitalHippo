import Link from "next/link";
import { Icons } from "../Icons";
import MaxWidthWrapper from "../MaxWidthWrapper";
import NavItems from "./navItems/NavItems";
import { buttonVariants } from "../ui/button";
import Cart from "../cart/Cart";
import { cookies } from "next/headers";
import { getServerSideUser } from "@/lib/getServerSideUser";
import UserAccountNav from "./userAccountNav/UserAccountNav";
import MobileNav from "./mobileNav/MobileNav";

const Navbar = async () => {
  const nextCookies = cookies();
  const { user } = await getServerSideUser(nextCookies);

  return (
    <div className="bg-white sticky z-50 top-0 inset-x-0 h-16">
      <header className="relative bg-white">
        <MaxWidthWrapper>
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center justify-between lg:justify-start ">
              <MobileNav />
              <div className="ml-4 flex lg:ml-0">
                <Link href="/">{<Icons.logo className="w-10 h-10" />} </Link>
              </div>
              <div className="hidden z-50 lg:ml-8 lg:block lg:self-stretch ">
                <NavItems />
              </div>
              <div className="ml-auto hidden lg:flex items-center ">
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  {/* if there is no user logged in*/}
                  {user ? null : (
                    <Link
                      href="/sign-in"
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      Sign in
                    </Link>
                  )}

                  {user ? null : (
                    <span
                      className="h-6 w-px bg-gray-200"
                      aria-hidden="true"
                    ></span>
                  )}

                  {user !== null ? (
                    <UserAccountNav user={user} />
                  ) : (
                    <Link
                      href="sign-up"
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      Create account
                    </Link>
                  )}

                  {/* if there is a user logged in */}

                  {user ? (
                    <span
                      className="h-6 w-px bg-gray-200"
                      aria-hidden="true"
                    ></span>
                  ) : null}

                  {user ? null : (
                    <div className="flex lg-ml-6">
                      <span
                        className="h-6 w-px bg-gray-200"
                        aria-hidden="true"
                      ></span>
                    </div>
                  )}
                  <div className="ml-4 flow-root lg:ml-6">
                    <Cart />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  );
};

export default Navbar;
