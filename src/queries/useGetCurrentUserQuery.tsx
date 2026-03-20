import { getCurrentUserAction } from "@/features/actions/ClientsController.actions";
import { useQuery } from "@tanstack/react-query";

export default function useGetCurrentUserQuery() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await getCurrentUserAction();

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
