import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PropsWithChildren } from "react";
import { useWallet } from "@/context/WalletContext";
import { Separator } from "@/components/ui/separator";

export default function AppLayout({ children }: PropsWithChildren) {
  const { fc, rc } = useWallet();
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar collapsible="offcanvas">
          <AppSidebar />
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-20 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="container h-14 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                <span className="font-semibold tracking-tight">FunStake</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2"><span className="text-muted-foreground">FC</span><span className="font-semibold">{fc.toLocaleString()}</span></div>
                <Separator orientation="vertical" className="h-5" />
                <div className="flex items-center gap-2"><span className="text-muted-foreground">RC</span><span className="font-semibold">{rc}</span></div>
              </div>
            </div>
          </header>
          <div className="flex-1">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
