import OrderItemStatus from "./OrderItemStatus";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

export default function OrderStatusView() {
  return (
    <>
      <div className="px-6 w-full max-w-2xl">
        <h1 className="mb-5">Tus pedidos</h1>
        <OrderItemStatus
          orderStatus="cancelled"
          createdAt={new Date()}
          products={[
            { name: "camiseta" },
            { name: "redstone" },
            { name: "manzana" },
          ]}
        />
        <OrderItemStatus
          orderStatus="confirmed"
          createdAt={new Date()}
          products={[
            { name: "camiseta" },
            { name: "redstone" },
            { name: "manzana" },
          ]}
        />
        <OrderItemStatus
          orderStatus="pending_review"
          createdAt={new Date()}
          products={[
            { name: "camiseta" },
            { name: "redstone" },
            { name: "manzana" },
          ]}
        />
      </div>
      <Button variant="outline" size="lg" className="p-6 rounded-full ml-auto mr-6">
        <Plus size={24} />
      </Button>
    </>
  );
}
