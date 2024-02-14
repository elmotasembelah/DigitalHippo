"use client";

import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface PaymentStatusProps {
  orderEmail: string;
  orderId: string;
  isPaid: boolean;
}

const PaymentStatus = ({ orderEmail, orderId, isPaid }: PaymentStatusProps) => {
  const { data } = trpc.payment.pollOrderStatus.useQuery(
    { orderId },
    {
      enabled: isPaid === false, // control wether the query is enabled and can be used or not
      refetchInterval: (data) => (data?.isPaid ? false : 1000), // control how often do we query (data is the same return from the query at the endpoint {isPaid: boolean})
    }
  );

  const router = useRouter();

  useEffect(() => {
    if (data?.isPaid === true) {
      router.refresh();
    }
  }, [data?.isPaid, router]);

  return (
    <div className="mt-16 grid gap-y-4 text-sm text-gray-600 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-0">
      <div>
        <p className=" font-medium text-gray-900">Shipping To</p>
        <p>{orderEmail}</p>
      </div>

      {/* <div className="">
        <p className="font-medium text-gray-900">Order Status</p>
        <p> {isPaid ? "Payment successful" : "Pending payment"}</p>
      </div> */}
    </div>
  );
};

export default PaymentStatus;
