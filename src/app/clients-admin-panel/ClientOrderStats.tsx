import {
  getClientStats,
  OrderStatus,
  OrderStatusValues,
} from "@/features/models/OrderModel";
import { Field, FieldLabel } from "../__components/ui/field";
import { Input } from "../__components/ui/input";
import { Button } from "../__components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../__components/ui/drawer";
import useFindOrdersQuery from "@/queries/useFindOrdersQuery";
import { Spinner } from "../__components/ui/spinner";

type ClientOrderStatsProps = {
  initialName: string;
  clientNumber: string;
};

export default function ClientOrderStats({
  initialName,
  clientNumber,
}: ClientOrderStatsProps) {
  const ordersQuery = useFindOrdersQuery({
    ignoreCancelled: false,
    ignoreDelievered: false,
    clientNumber,
  });

  if (ordersQuery.isError) {
    return <p>Ha ocurrido un error de tipo: {ordersQuery.error.message}</p>;
  }

  if (ordersQuery.isLoading || !ordersQuery.data) {
    return (
      <span className="flex gap-4 items-center">
        <Spinner />
        <span>Cargando estadísticas...</span>
      </span>
    );
  }

  const stats = getClientStats(ordersQuery.data);

  return (
    <div>
      <Field>
        <FieldLabel className="text-muted-foreground">
          Nombre del cliente
        </FieldLabel>
        <Input type="text" defaultValue={initialName}></Input>
      </Field>
      <div className="flex flex-col pt-6">
        <h4 className="bg-">Pedidos:</h4>
        {(Object.keys(OrderStatusValues) as OrderStatus[]).map((key) => (
          <div key={key}>
            <span>- {OrderStatusValues[key]}:</span>
            <span className="ml-2">{stats[key] || 0}</span>
          </div>
        ))}
      </div>
      <Button variant={"default"} className="w-[100%] mt-6">
        Ver Pedidos
      </Button>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant={"secondary"} className="w-[100%] mt-6">
            Eliminar Cliente
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Eliminar Cliente</DrawerTitle>
            <DrawerDescription>
              Está seguro que desea eliminar este cliente? Esta acción no se
              puede deshacer
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button variant={"destructive"}>Eliminar</Button>
            <DrawerClose asChild>
              <Button variant="secondary">Atrás</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
