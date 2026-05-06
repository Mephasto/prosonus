import { logoutAction } from "./login/actions";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="border-b bg-muted/40">
        <div className="container flex h-12 items-center justify-between px-4 md:px-6">
          <span className="text-sm font-medium text-muted-foreground">
            Panel de administración
          </span>
          <form action={logoutAction}>
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </Button>
          </form>
        </div>
      </div>
      {children}
    </div>
  );
}
