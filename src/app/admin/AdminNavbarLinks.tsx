"use client"
import { usePathname, useRouter } from "next/navigation";
import { ToggleGroup, ToggleGroupItem } from "../__components/ui/toggle-group";
import { BookSearch, UserSearch } from "lucide-react";

export default function AdminNavbarLinks() {
  const pathname = usePathname();
  const router = useRouter();
  const activeValue = pathname.includes("/orders") ? "orders" : "clients";

  const handleNavigation = (value: string) => {
    if (!value) return;

    if (value === "orders") {
      router.push("/admin/orders");
    } else {
      router.push("/admin/clients");
    }
  };

  return (
    <ToggleGroup
      className="ml-auto"
      type="single"
      value={activeValue}
      onValueChange={handleNavigation}
    >
      <ToggleGroupItem value="orders" aria-label="Ver pedidos">
        <BookSearch className="size-6" />
      </ToggleGroupItem>
      <ToggleGroupItem value="clients" aria-label="Ver clientes">
        <UserSearch className="size-6" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
