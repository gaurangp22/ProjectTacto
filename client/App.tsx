import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";

const Simulator = lazy(() => import("./pages/Simulator"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const NotFound = lazy(() => import("./pages/NotFound"));

const TITLES: Record<string, string> = {
  "/": "Project TACTO | Code you can feel",
  "/privacy": "Privacy | Project TACTO",
  "/terms": "Terms | Project TACTO",
};

function Shell() {
  const { pathname, hash } = useLocation();
  const app = pathname.startsWith("/simulator");

  useEffect(() => {
    document.title = TITLES[pathname] ?? (app ? "Simulator | Project TACTO" : "Project TACTO");
    if (hash) setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" }), 50);
    else window.scrollTo(0, 0);
  }, [pathname, hash, app]);

  return (
    <div className="flex min-h-screen flex-col">
      {!app && <Header />}
      <main id="main" className="flex-grow">
        <Suspense fallback={<div className="grid min-h-[60vh] place-items-center text-[#a3a39b]">Loading…</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/simulator/:lessonId" element={<Simulator />} />
            <Route path="/playground" element={<Navigate to="/simulator" replace />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {!app && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
      <Toaster position="bottom-center" />
    </BrowserRouter>
  );
}
