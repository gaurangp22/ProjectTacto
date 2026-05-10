import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import WhitepaperPage from "./pages/WhitepaperPage";
import Playground from "./pages/Playground";
import PremiumLanding from "./components/landing-v2/PremiumLanding";
import Header from "./components/Header";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

import Footer from "./components/Footer";

interface AppProps {
  queryClient: QueryClient;
}

import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const Layout = () => {
  const location = useLocation();
  const isPlayground = location.pathname === '/playground';
  const isV2 = location.pathname === '/v2';
  const hideChrome = isPlayground || isV2;

  useEffect(() => {
    window.scrollTo(0, 0);

    let title = "Project TACTO | Code you can feel";
    switch (location.pathname) {
      case "/":
        title = "Project TACTO | Code you can feel";
        break;
      case "/whitepaper":
        title = "Research | Project TACTO";
        break;
      case "/hardware":
        title = "The System | Project TACTO";
        break;
      case "/curriculum":
        title = "Curriculum | Project TACTO";
        break;
      case "/mission":
        title = "Our Mission | Project TACTO";
        break;
      case "/playground":
        title = "Simulator | Project TACTO";
        break;
      case "/privacy":
        title = "Privacy | Project TACTO";
        break;
      case "/terms":
        title = "Terms | Project TACTO";
        break;
    }
    document.title = title;

  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      {!hideChrome && <Header />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/v2" element={<PremiumLanding />} />
          <Route path="/whitepaper" element={<WhitepaperPage />} />
          {/* Custom Routes */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/playground" element={<Playground />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!hideChrome && <Footer />}
    </div>
  );
};


const App = ({ queryClient }: AppProps) => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
