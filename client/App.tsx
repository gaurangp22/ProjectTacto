import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import WhitepaperPage from "./pages/WhitepaperPage";
import Playground from "./pages/Playground";
import Header from "./components/Header";

import Footer from "./components/Footer";

interface AppProps {
  queryClient: QueryClient;
}

import { useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  const isPlayground = location.pathname === '/playground';

  return (
    <div className="flex flex-col min-h-screen">
      {!isPlayground && <Header />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/whitepaper" element={<WhitepaperPage />} />
          {/* Custom Routes */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/playground" element={<Playground />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isPlayground && <Footer />}
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
