
import OrderStatusView from "../__components/OrderStatusView";

export default function OrderAdminPanelPage() {
  return (
    <main className="grid px-4 min-h-dvh place-items-center">
        <OrderStatusView  mode="accordion"showAddBooton={false} isAdmin={true}/>
    </main>
  );
}
