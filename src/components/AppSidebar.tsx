import { Gamepad2, Home, Wallet as WalletIcon, Gift, ScrollText, ChevronDown } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "Wallet", url: "/wallet", icon: WalletIcon },
  { title: "Redeem", url: "/redeem", icon: Gift },
  { title: "Terms", url: "/terms", icon: ScrollText },
];

const gameItems = [
  { title: "Mines", url: "/games/mines" },
  { title: "Crash", url: "/games/crash" },
  { title: "Coinflip", url: "/games/coinflip" },
  { title: "Blackjack", url: "/games/blackjack" },
];

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-muted text-primary font-medium" : "hover:bg-muted/50";

  const [gamesOpen, setGamesOpen] = useState(currentPath.startsWith("/games"));
  useEffect(() => {
    setGamesOpen(currentPath.startsWith("/games"));
  }, [currentPath]);
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>FunStake</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <NavLink to={item.url} end className={getNavCls}>
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Games</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {/* Collapsible trigger */}
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setGamesOpen((v) => !v)}
                className={currentPath.startsWith("/games") ? "bg-muted text-primary font-medium" : "hover:bg-muted/50"}
              >
                <Gamepad2 className="mr-2 h-4 w-4" />
                <span>Games</span>
                <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${gamesOpen ? "rotate-180" : ""}`} />
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Collapsible content */}
            {gamesOpen &&
              gameItems.map((g) => (
                <SidebarMenuItem key={g.title}>
                  <SidebarMenuButton asChild className="pl-6">
                    <NavLink to={g.url} end className={getNavCls}>
                      <span>{g.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
