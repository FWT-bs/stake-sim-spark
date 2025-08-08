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
import { WalletProvider } from "./context/WalletContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <WalletProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/games" element={<Games />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/redeem" element={<Redeem />} />
                <Route path="/terms" element={<Terms />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<Index />} />
              </Routes>
            </AppLayout>
          </BrowserRouter>
        </TooltipProvider>
      </WalletProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
