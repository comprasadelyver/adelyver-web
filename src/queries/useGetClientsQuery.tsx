import { findClientsAction } from "@/features/actions/ClientsController.actions";
import { useQuery } from "@tanstack/react-query";

type FilterBy = {
  name: string;
  phone: string;
};

export default function useGetClients({ name, phone }: FilterBy) {
  return useQuery({
    queryKey: ["clients", name, phone],
    queryFn: async () => {
      const res = await findClientsAction({
        name,
        phone,
      });

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
