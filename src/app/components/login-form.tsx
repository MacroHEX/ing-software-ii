import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import Image from 'next/image'
import {ComponentProps} from "react";

export function LoginForm({
                            className,
                            imageUrl,
                            ...props
                          }: ComponentProps<"div"> & {
  imageUrl?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-6 h-full", className)} {...props}>
      <Card className="overflow-hidden p-0 h-full">
        <CardContent className="grid p-0 md:grid-cols-2 h-full">
          <form className="p-6 md:p-8 h-full flex flex-col justify-between">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Bienvenido</h1>
                <p className="text-muted-foreground text-balance">
                  Inicia Sesión
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Usuario o Correo</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Contraseña</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <Input id="password" type="password" required/>
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>

              <div className="text-center text-sm">
                ¿No tienes una cuenta?&nbsp;
                <a href="#" className="underline underline-offset-4">
                   Registrate
                </a>
              </div>
            </div>
          </form>
          <div className="bg-primary/50 relative hidden md:block">
            {imageUrl && (
              <Image
                fill
                src={imageUrl}
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}