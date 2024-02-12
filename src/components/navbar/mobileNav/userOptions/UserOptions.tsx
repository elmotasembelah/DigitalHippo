import { trpc } from "@/trpc/client";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/use-Auth";
import { Loader2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface UserOptionsProps {
  closeMenu: () => void;
}

const UserOptions = ({ closeMenu }: UserOptionsProps) => {
  const { data, error, isLoading } = trpc.auth.getUser.useQuery();
  const { signOut } = useAuth();

  if (isLoading) {
    return (
      <div className="h-32 flex justify-center items-center">
        {" "}
        <Loader2 className="animate-spin " />
      </div>
    );
  }

  if (error) {
    if (error.data?.code !== "UNAUTHORIZED") {
      throw error;
    }
  }

  const resetUser = () => {
    if (data?.email) {
      data.email = "";
    }
  };

  return (
    <div className="space-y-6 px-4">
      {data?.email ? (
        <div className="flex flex-col justify-between   ">
          <Accordion type="single" collapsible>
            <AccordionItem value="my Account">
              <AccordionTrigger>My Account</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col">
                  <p className="p-2  text-muted-foreground">
                    {data.email.split("@")[0]}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex flex-col gap-2 mt-10">
            <Link
              href={"/sell"}
              className={buttonVariants()}
              onClick={closeMenu}
            >
              Seller Dashboard
            </Link>
            <Button
              variant={"outline"}
              className="py-2 font-medium text-gray-900 "
              onClick={() => {
                signOut().then(({ success }) => {
                  if (success) {
                    resetUser();
                    closeMenu();
                  }
                });
              }}
            >
              Sign Out
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col mt-10">
          <Link
            href="/sign-up"
            className={buttonVariants()}
            onClick={closeMenu}
          >
            Sign Up
          </Link>
          <Link
            href="/sign-in"
            className={buttonVariants({
              variant: "outline",
              className: "mt-2",
            })}
            onClick={closeMenu}
          >
            Sign In
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserOptions;
