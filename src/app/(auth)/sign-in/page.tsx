"use client";

import Link from "next/link";
import { Icons } from "@/components/Icons";
import React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AuthCredentialsValidator,
  TAuthCredentialsValidator,
} from "@/lib/validators/account-credentials-validator";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { ZodError } from "zod";
import { useRouter, useSearchParams } from "next/navigation";

const SigninPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSeller = searchParams.get("as");
  const origin = searchParams.get("origin"); //  handle getting the user back into the place where he got to this page from (e.g cart)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthCredentialsValidator>({
    resolver: zodResolver(AuthCredentialsValidator),
  });

  const { mutate: signin, isLoading } = trpc.auth.signin.useMutation({
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        toast.error("Invalid email or password.");
        return;
      }
      if (error instanceof ZodError) {
        toast.error("Credentials are not valid, Please try again");
        return;
      }

      toast.error("Something went wrong. Please try again");
    },
    onSuccess: () => {
      toast.success(`Sign in successfully`);

      if (origin) {
        router.push(`${origin}`);
        return;
      }

      if (isSeller) {
        router.push("/sell");
        return;
      }

      router.push("/");
      router.refresh();
    },
  });

  const onSubmit = ({ email, password }: TAuthCredentialsValidator) => {
    signin({ email, password });
  };

  const continuAsSeller = () => {
    router.push("?as=seller");
  };

  const continuoAsBuyer = () => {
    router.replace("/sign-in", undefined);
  };

  return (
    <>
      <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] ">
          <div className="flex flex-col items-center space-y-2 text-center ">
            <Icons.logo className="h-20 w-20" />
            <h1 className="text-2xl font-bold">
              Sign in to your {isSeller ? "seller" : null} account
            </h1>
            <Link
              href={"/sign-up"}
              className={buttonVariants({
                variant: "link",
                className: "gap-1.5",
              })}
            >
              Don&apos;t have an account? Sign up
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {/* sign in form */}
          <div className="grid gap-6 p-2">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-2">
                <div className="grid gap-2 py-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    {...register("email")}
                    className={cn("", {
                      "focus-visible:ring-red-500": errors.email,
                    })}
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <div className="grid gap-2 py-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    {...register("password")}
                    className={cn({
                      "focus-visible:ring-red-500": errors.password,
                    })}
                    type="password"
                    placeholder="Password"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <Button disabled={isLoading}>Sign in</Button>
              </div>
            </form>
            <div className="relative">
              <div className="absolute inset-0 items-center" aria-hidden="true">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  or
                </span>
              </div>
            </div>
            {isSeller ? (
              <Button
                variant={"secondary"}
                disabled={isLoading}
                onClick={continuoAsBuyer}
              >
                {" "}
                Continuo as a Buyer
              </Button>
            ) : (
              <Button
                variant={"secondary"}
                disabled={isLoading}
                onClick={continuAsSeller}
              >
                {" "}
                Continuo as a Seller
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default SigninPage;
