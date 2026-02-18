import { FindOrdersRequest } from "@/features/abstractions/IOrderController";
import { findOrdersAction } from "@/features/actions/OrdersController.actions";
import { useQuery } from "@tanstack/react-query";

export default function useFindOrdersQuery(req: FindOrdersRequest) {
  return useQuery({
    queryKey: [
      "orders",
      req.trackingNumber,
      req.productId,
      req.clientNumber,
      req.clientName,
      req.createdAfter,
      req.createdBefore,
      req.ignoreCancelled,
      req.ignoreDelievered,
    ],
    queryFn: async () => {
      console.log("req", req);
      const res = await findOrdersAction(req);

      if (res.ok) {
        return res.data;
      }

      switch (res.error.code) {
        default:
          throw new Error(`${res.error.code}: ${res.error.message}`);
      }
    },
  });
}
