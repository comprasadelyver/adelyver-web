import { ChevronRightIcon } from "lucide-react";
import CircularProgress from "./CircularProgres";
import { ORDER_STATUSES, OrderStatus } from "@/features/models/OrderModel";
import { ProductModel } from "@/features/models/ProductModel";
import Link from "next/link";

type OrderItemStatusProps = {
  orderStatus: OrderStatus;
  createdAt: Date;
  products: {
    name: string;
  }[];
};

const OrderStatusValues: { [key in OrderStatus]: string } = {
  pending_review: "Pendiente de revisión",
  confirmed: "Confirmado",
  waiting_for_payment: "Esperando pago",
  ready_for_pickup: "Listo para recoger",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

export default function OrderItemStatus({
  orderStatus,
  createdAt,
  products,
}: OrderItemStatusProps) {
  const statusIndex = ORDER_STATUSES.findIndex((s) => s == orderStatus);
  const latestStatusIndex = ORDER_STATUSES.length - 2;
  const statusProgress = Math.min((statusIndex / latestStatusIndex) * 100, 100);

  return (
    <div className="mr-auto grid grid-cols-[auto_1fr_auto] gap-y-1 gap-x-4 py-4">
      <div className="row-span-3 h-fit place-self-center">
        <CircularProgress
          size={64}
          progress={statusProgress}
        ></CircularProgress>
      </div>
      <h3 className="text-xl">{OrderStatusValues[orderStatus]}</h3>
      <Link href={"#"} className="row-span-3 text-gray-400 hover:text-primary transition-colors self-start">
      <ChevronRightIcon
        size={32}
        className=" "
      ></ChevronRightIcon>
      </Link>
      <p className="font-light text-sm">creado el {createdAt.toDateString()}</p>
      <p className="font-light text-sm line-clamp-1">
        {products.reduce(
          (curr, pr, index) =>
            curr + pr.name + (index == products.length - 1 ? "" : ", "),
          ""
        )}
      </p>
    </div>
  );
}
