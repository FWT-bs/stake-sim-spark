import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import AppLayout from "./layouts/AppLayout";
import Index from "./pages/Index";
import Games from "./pages/Games";
import Wallet from "./pages/Wallet";
import Redeem from "./pages/Redeem";
import Terms from "./pages/Terms";
import MinesPage from "./pages/games/MinesPage";
import CrashPage from "./pages/games/CrashPage";
import CoinflipPage from "./pages/games/CoinflipPage";
import BlackjackPage from "./pages/games/BlackjackPage";
import CupsPage from "./pages/games/CupsPage";
import { WalletProvider } from "./context/WalletContext";
import { AuthProvider } from "./context/AuthContext";
// import { GeoProvider } from "./context/GeoContext";
// import GeoGate from "./components/GeoGate";
// import AgeGate from "./components/AgeGate";
import { ProvablyFairProvider } from "./context/ProvablyFairContext";
import RequireAuth from "./components/RequireAuth";
import AuthPage from "./pages/Auth";
import Profile from "./pages/Profile";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <AuthProvider>
        {/* <GeoProvider> */}
          <WalletProvider>
            <ProvablyFairProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <AppLayout>
                    {/* <AgeGate /> */}
                    {/* <GeoGate> */}
                    <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<AuthPage />} />

                  {/* Protected routes */}
                  <Route path="/games" element={<RequireAuth><Games /></RequireAuth>} />
                  <Route path="/games/mines" element={<RequireAuth><MinesPage /></RequireAuth>} />
                  <Route path="/games/crash" element={<RequireAuth><CrashPage /></RequireAuth>} />
                  <Route path="/games/coinflip" element={<RequireAuth><CoinflipPage /></RequireAuth>} />
                  <Route path="/games/blackjack" element={<RequireAuth><BlackjackPage /></RequireAuth>} />
                  <Route path="/games/cups" element={<RequireAuth><CupsPage /></RequireAuth>} />
                  <Route path="/wallet" element={<RequireAuth><Wallet /></RequireAuth>} />
                  <Route path="/redeem" element={<RequireAuth><Redeem /></RequireAuth>} />
                  <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />

                  <Route path="/terms" element={<Terms />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<Index />} />
                  </Routes>
                  {/* </GeoGate> */}
                </AppLayout>
              </BrowserRouter>
            </TooltipProvider>
            </ProvablyFairProvider>
          </WalletProvider>
        {/* </GeoProvider> */}
      </AuthProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
