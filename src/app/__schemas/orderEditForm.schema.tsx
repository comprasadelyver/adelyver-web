import { z } from "zod";
const statusOption = [
  "pending_review",
  "confirmed",
  "waiting_for_payment",
  "ready_for_pickup",
  "delivered",
  "cancelled",
] as const;

export const orderEditFormSchema = z.object({
  status: z.enum(statusOption, "Selecciona un estado para el pedido"),
  packagePrice: z
    .number("Debe ser un número")
    .min(0, "El precio no puede ser negativo"),

  shippingPrice: z
    .number("Debe ser un número")
    .min(0, "El envío no puede ser negativo"),

  investedMoney: z
    .number("Debe ser un número")
    .min(0, "La inversión no puede ser negativa"),

  amountPaidByClient: z
    .number("Debe ser un número")
    .min(0, "El pago no puede ser negativo"),
});
export type OrderEditFormData = z.infer<typeof orderEditFormSchema>;
