import { ChevronRightIcon } from "lucide-react";
import CircularProgress from "./CircularProgress";
import {
  ORDER_STATUSES,
  OrderStatus,
  OrderStatusValues,
} from "@/features/models/OrderModel";
import Link from "next/link";
import { getOrderStatusInfo } from "@/features/models/OrderModel";

type OrderItemStatusProps = {
  orderStatus: OrderStatus;
  createdAt: Date;
  products: {
    name: string;
  }[];
};
export default function OrderItemStatus({
  orderStatus,
  createdAt,
  products,
}: OrderItemStatusProps) {
  const { label, progress, color } = getOrderStatusInfo(orderStatus);

  return (
    <div className="mr-auto grid grid-cols-[auto_1fr_auto] gap-y-1 gap-x-4 py-4">
      <div className="row-span-3 h-fit place-self-center">
        <CircularProgress size={64} progress={progress} color={color}></CircularProgress>
      </div>
      <h3 className="text-xl">{label}</h3>
      <Link
        href={"#"}
        className="row-span-3 text-gray-400 hover:text-primary transition-colors self-start"
      >
        <ChevronRightIcon size={32} className=" "></ChevronRightIcon>
      </Link>
      <p className="font-light text-sm">
        creado el{" "}
        {createdAt.toLocaleDateString("es-ES", {
          day: "numeric",
          month: "numeric",
          year: "2-digit",
        })}
      </p>
      <p className="font-light text-sm line-clamp-1">
        {products.map((p) => p.name).join(", ")}
      </p>
    </div>
  );
}
