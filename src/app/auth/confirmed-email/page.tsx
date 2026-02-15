"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/__components/ui/card";
import Lottie from "lottie-react";

import confetti from "@/app/__assets/lottie/confetti.json";
import Link from "next/link";

export default function ConfirmedEmailPage() {
  return (
    <main className="grid px-10 min-h-dvh place-items-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>¡Todo listo, Bienvenido!</CardTitle>
          <CardDescription>
            Tu cuenta ha sido verificada exitosamente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <span>
            Ya tienes acceso total a todas las funciones. Estamos felices de
            tenerte aquí.
          </span>
          <br />
          <Link
            className="hover:underline underline-offset-2"
            href="/dashboard"
          >
            Haz click aquí para dirigirte a tu panel de control.
          </Link>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Lottie
            className="[&_.secondary]:stroke-foreground [&_.primary]:stroke-ring grid [&>svg]:size-full h-48"
            animationData={confetti}
            loop={false}
          />
        </CardFooter>
      </Card>
    </main>
  );
}
