import {
  ProductFormValues,
  productFormValuesSchema,
} from "@/app/__schemas/productFormValuesSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ProductForm from "./ProductForm";
import {
  createProductByAdminAction,
  updateProductByAdminAction,
} from "@/features/actions/OrdersController.actions";
import { toast } from "sonner";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/app/__components/ui/drawer";
import { Button } from "@/app/__components/ui/button";
import { Spinner } from "@/app/__components/ui/spinner";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ProductModel } from "@/features/models/ProductModel";

type EditProductFormProps = {
  orderId: string;
  product: ProductModel;
  children: React.ReactElement;
};

export default function EditProductForm({
  orderId,
  product,
  children,
}: EditProductFormProps) {
  const queryClient = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormValuesSchema),
    defaultValues: {
      trackingNumber: product.trackingNumber,
      name: product.name,
      idFromShop: product.idFromShop,
      url: product.url,
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    const res = await updateProductByAdminAction({ ...data, id: product.id });
    if (!res.ok) {
      toast.error(res.error.message);
      return;
    }

    await queryClient.invalidateQueries({ queryKey: ["orders"] });
    toast.success("Producto editado correctamente");

    setIsDrawerOpen(false);
    form.reset(data);
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Editar producto</DrawerTitle>
        </DrawerHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          id={`new-product-form-${orderId}`}
          className="w-full overflow-auto max-w-lg mx-auto px-6 pb-6"
        >
          <ProductForm id={`new-product-form-${orderId}`} form={form} />
        </form>
        <DrawerFooter className="grid gap-2">
          <Button
            type="submit"
            form={`new-product-form-${orderId}`}
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && <Spinner className="mr-2" />}
            Editar
          </Button>
          <DrawerClose asChild>
            <Button variant="link">Atrás</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
