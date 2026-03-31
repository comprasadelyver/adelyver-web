import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/app/__components/ui/drawer";
import {
  CreateUserFormData,
  createUserSchema,
} from "@/app/__schemas/createClientForm.schema";
import { createClientAction } from "@/features/actions/ClientsController.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import UserForm from "./UserForm";
import { Button } from "@/app/__components/ui/button";
import { useState } from "react";
import { Spinner } from "@/app/__components/ui/spinner";
import { cn } from "@/app/__lib/utils";
import { CheckIcon, ChevronLeft } from "lucide-react";

export default function CreateUserForm({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const queryClient = useQueryClient();
  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      const res = await createClientAction({
        fullName: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });

      if (!res.ok) {
        toast.error(res.error.message);
        return;
      }

      toast.success("Cliente creado correctamente");
      await queryClient.invalidateQueries({ queryKey: ["clients"] });

      setIsDrawerOpen(false);
      form.reset();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      toast.error(`Ocurrió un error inesperado`);
    }
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild className="w-full flex">
        {children}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Crear Usuario</DrawerTitle>
        </DrawerHeader>
        <div className="w-full overflow-auto max-w-lg mx-auto px-6 pb-6">
          <form id="create-user-form" onSubmit={form.handleSubmit(onSubmit)}>
            <UserForm form={form} />
          </form>
        </div>
        <DrawerFooter>
          <Button
            type="submit"
            form="create-user-form"
            className="w-full"
            disabled={form.formState.isSubmitting || !form.formState.isDirty}
          >
            {form.formState.isSubmitting ? (
              <Spinner data-icon="inline-start" className="size-4" />
            ) : (
              <CheckIcon className="size-4 shrink-0" />
            )}

            {form.formState.isSubmitting ? "Guardando..." : "Guardar Usuario"}
          </Button>
          <DrawerClose asChild>
            <Button variant="ghost" type="button">
              <ChevronLeft />
              Atrás
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
