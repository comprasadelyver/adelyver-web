import { eq, sql, desc, exists, and, ilike } from "drizzle-orm";
import IOrdersController, {
  ClientOrderDto,
  FindOrdersRequest,
  CreateOrderByClientRequest,
  CreateOrderByAdminRequest,
  UpdateOrderByAdminRequest,
  CreateProductRequest,
  UpdateProductRequest,
  UpdateOrderByClientRequest,
} from "../abstractions/IOrderController";
import { Result } from "../shared/Result";
import { ProductModel } from "../models/ProductModel";
import { OrderModel } from "../models/OrderModel";
import { randomUUID } from "crypto";
import { orders, products, userSearch } from "./db/schema";
import { db, TransactionType } from "./db";

export const createSupabaseOrdersController = (
  tx: TransactionType
): IOrdersController => {
  return {
    getClientOrderById: async (
      orderId: string
    ): Promise<Result<ClientOrderDto>> => {
      const data = await tx.query.orders.findFirst({
        where: eq(orders.id, orderId),
      });

      if (!data)
        return Result.err({
          code: "NOT_FOUND",
          message: "Pedido no encontrado",
        });

      return Result.ok({
        id: data.id,
        clientId: data.clientId,
        status: data.status,
        packagePrice: data.packageCost,
        deliveryPrice: data.shippingCost,
        spentMoney: data.investedAmount,
        moneyPaidByClient: data.paidAmount,
        shopCartUrl: data.shopCartUrl,
        createdAt: data.createdAt,
        updatedAt: data.createdAt,
      });
    },

    getClientAllOrders: async (): Promise<Result<ClientOrderDto[]>> => {
      const data = await tx.query.orders.findMany({
        orderBy: orders.updatedAt,
      });

      return Result.ok(
        data.map((d) => ({
          id: d.id,
          clientId: d.clientId,
          status: d.status,
          packagePrice: d.packageCost,
          deliveryPrice: d.shippingCost,
          spentMoney: d.investedAmount,
          moneyPaidByClient: d.paidAmount,
          shopCartUrl: d.shopCartUrl,
          createdAt: d.createdAt,
          updatedAt: d.createdAt,
        }))
      );
    },

    getClientOrderProducts: async (
      orderId: string
    ): Promise<Result<ProductModel[]>> => {
      const data = await tx.query.products.findMany({
        where: eq(products.orderId, orderId),
      });

      return Result.ok(
        data.map((p) => ({
          id: p.id,
          orderId: p.orderId,
          idFromShop: p.storeProductId,
          name: p.name,
          url: p.url,
          trackingNumber: p.trackingNumber,
          createdAt: p.createdAt,
          updatedAt: p.createdAt,
        }))
      );
    },

    findOrders: async (
      req: FindOrdersRequest
    ): Promise<Result<OrderModel[]>> => {
      console.log("req", req);
      const query = tx.query.orders.findMany({
        where: () => {
          const conditions = [];

          if (req.trackingNumber) {
            conditions.push(
              exists(
                tx
                  .select()
                  .from(products)
                  .where(
                    and(
                      eq(products.orderId, orders.id),
                      ilike(products.trackingNumber, `%${req.trackingNumber}%`)
                    )
                  )
              )
            );
          }

          if (req.storeProductId) {
            conditions.push(
              exists(
                tx
                  .select()
                  .from(products)
                  .where(
                    and(
                      eq(products.orderId, orders.id),
                      ilike(products.storeProductId, `%${req.storeProductId}%`)
                    )
                  )
              )
            );
          }

          if (req.clientNumber) {
            conditions.push(
              exists(
                db
                  .select()
                  .from(userSearch)
                  .where(
                    and(
                      eq(userSearch.id, orders.clientId),
                      ilike(userSearch.phone, `%${req.clientNumber}%`)
                    )
                  )
              )
            );
          }

          if (req.clientName) {
            conditions.push(
              exists(
                db
                  .select({ id: userSearch.id })
                  .from(userSearch)
                  .where(
                    and(
                      eq(userSearch.id, orders.clientId),
                      ilike(userSearch.fullName, `%${req.clientName}%`)
                    )
                  )
              )
            );
          }

          // if (req.createdAfter) {
          //   conditions.push(gte(row.createdAt, req.createdAfter));
          // }
          // if (req.createdBefore) {
          //   conditions.push(lte(row.createdAt, req.createdBefore));
          // }

          // if (req.ignoreCancelled) conditions.push(ne(row.status, "cancelled"));
          // if (req.ignoreDelievered)
          //   conditions.push(ne(row.status, "delivered"));

          console.log("conditions", conditions);
          return and(...conditions);
        },
        orderBy: desc(orders.updatedAt),
      });

      console.log("query", query.toSQL());
      const data = await query;

      return Result.ok(
        data.map(
          (i) =>
            ({
              id: i.id,
              clientId: i.clientId,
              status: i.status,
              packagePrice: i.packageCost,
              deliveryPrice: i.shippingCost,
              spentMoney: i.investedAmount,
              moneyPaidByClient: i.paidAmount,
              createdAt: i.createdAt,
              updatedAt: i.createdAt,
              shopCartUrl: i.shopCartUrl,
            } satisfies OrderModel)
        )
      );
    },

    createOrderByClient: async (
      req: CreateOrderByClientRequest
    ): Promise<Result<void>> => {
      await tx.insert(orders).values({
        id: randomUUID(),
        status: "pending_review",
        clientId: sql`(current_setting('request.jwt.claims', true)::jsonb ->> 'sub')::uuid`,
        shopCartUrl: req.shopCartUrl,
      });
      return Result.ok(undefined);
    },

    createOrderByAdmin: async (
      req: CreateOrderByAdminRequest
    ): Promise<Result<{ id: string }>> => {
      const id = randomUUID();
      await tx.insert(orders).values({
        id,
        clientId: req.clientId,
        status: req.status,
        packageCost: req.packagePrice ?? 0,
        shippingCost: req.deliveryPrice ?? 0,
        shopCartUrl: "//created-by-admin//",
      });
      return Result.ok({ id });
    },

    updateOrderByClient: async (
      req: UpdateOrderByClientRequest
    ): Promise<Result<void>> => {
      const data = await tx.query.orders.findFirst({
        where: eq(orders.id, req.orderId),
      });

      if (!data)
        return Result.err({
          code: "NOT_FOUND",
          message: "Pedido no encontrado",
        });

      if (data.status !== "pending_review")
        return Result.err({
          code: "UNAUTHORIZED",
          message: "No tienes permisos",
        });

      await tx
        .update(orders)
        .set({
          shopCartUrl: req.shopCartUrl,
          updatedAt: new Date(),
        })
        .where(eq(orders.id, req.orderId));

      return Result.ok(undefined);
    },

    updateOrderByAdmin: async (
      req: UpdateOrderByAdminRequest
    ): Promise<Result<void>> => {
      await tx
        .update(orders)
        .set({
          status: req.status,
          packageCost: req.packagePrice,
          shippingCost: req.deliveryPrice,
          investedAmount: req.spentMoney,
          paidAmount: req.moneyPaidByClient,
          updatedAt: new Date(),
        })
        .where(eq(orders.id, req.orderId));

      return Result.ok(undefined);
    },

    createProductByAdmin: async (
      req: CreateProductRequest
    ): Promise<Result<void>> => {
      await tx.insert(products).values({
        id: randomUUID(),
        orderId: req.orderId,
        storeProductId: req.idFromShop,
        url: req.url,
        name: req.name,
        trackingNumber: req.trackingNumber,
      });
      return Result.ok(undefined);
    },

    updateProductByAdmin: async (
      req: UpdateProductRequest
    ): Promise<Result<void>> => {
      await tx
        .update(products)
        .set({
          trackingNumber: req.trackingNumber,
          name: req.name,
          storeProductId: req.idFromShop,
          url: req.url,
          updatedAt: new Date(),
        })
        .where(eq(products.id, req.id));
      return Result.ok(undefined);
    },

    deleteProductByAdmin: async (id: string): Promise<Result<void>> => {
      await tx.delete(products).where(eq(products.id, id));
      return Result.ok(undefined);
    },
  };
};
