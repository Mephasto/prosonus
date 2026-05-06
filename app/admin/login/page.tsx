import { loginAction } from "./actions";
import { AlertCircle, Headphones } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Headphones className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Admin</CardTitle>
          <CardDescription>
            Ingresá tus credenciales para continuar
          </CardDescription>
        </CardHeader>

        <form action={loginAction}>
          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Usuario o contraseña incorrectos.</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="user">Usuario</Label>
              <Input
                id="user"
                name="user"
                type="text"
                autoComplete="username"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pass">Contraseña</Label>
              <Input
                id="pass"
                name="pass"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full">
              Iniciar sesión
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
