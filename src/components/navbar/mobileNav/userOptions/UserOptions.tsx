import { trpc } from "@/trpc/client";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/use-Auth";
import { Loader2 } from "lucide-react";

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
    <div className="space-y-6 border-b border-gray-200 px-4 py-6">
      {data?.email ? (
        <div className="flex flex-col ">
          <p className="p-2 text-center font-medium">{data.email}</p>

          <Link
            href={"/sell"}
            className={buttonVariants({ variant: "ghost" })}
            onClick={closeMenu}
          >
            Seller Dashboard
          </Link>

          <Button
            variant={"ghost"}
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
            Sign out
          </Button>
        </div>
      ) : (
        <div className="flex flex-col">
          <Link
            href="/sign-in"
            className={buttonVariants({ variant: "ghost" })}
            onClick={closeMenu}
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className={buttonVariants({ variant: "ghost" })}
            onClick={closeMenu}
          >
            Sign up
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserOptions;
