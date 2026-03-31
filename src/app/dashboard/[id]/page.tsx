import OrderDetails from "./OrderDetails";

export default function OrderDetailsPage() {
  return (
    <div className="">
      <header>
        <h1 className="sr-only">Pedido</h1>
      </header>
      <main className="w-full max-w-3xl justify-self-center grid grid-rows-[1fr_auto]">
        <OrderDetails />
      </main>
    </div>
  );
}
