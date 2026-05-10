import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (location.pathname !== "/") {
      window.location.href = `/#${id}`;
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  const navLinks = [
    { label: "Story", id: "story" },
    { label: "How It Works", id: "how-it-works" },
    { label: "Traction", id: "traction" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled
          ? "bg-[#fafaf8]/90 backdrop-blur-xl border-b border-[#e4e2dd] shadow-[0_1px_6px_rgba(0,0,0,0.04)]"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src="/tacto-website-logo.png"
            alt="Project TACTO"
            className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="text-[0.8125rem] font-medium text-[#6b6b63] hover:text-[#1a1a17] transition-colors duration-200"
            >
              {link.label}
            </button>
          ))}
          <Link
            to="/whitepaper"
            className="text-[0.8125rem] font-medium text-[#6b6b63] hover:text-[#1a1a17] transition-colors duration-200"
          >
            Research
          </Link>
        </div>

        <div className="hidden md:flex items-center">
          <Link
            to="/playground"
            className="text-[0.8125rem] font-semibold text-white bg-[#1a1a17] px-5 py-2 rounded-full hover:bg-[#333330] transition-all duration-200"
          >
            Try Playground
          </Link>
        </div>

        {/* Mobile */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-[#1a1a17]"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
            className="md:hidden border-t border-[#e4e2dd] bg-[#fafaf8]/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-6 py-6 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="block w-full text-left px-4 py-3 text-sm font-medium text-[#6b6b63] hover:text-[#1a1a17] hover:bg-[#f2f0ec] rounded-xl transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <Link
                to="/whitepaper"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-left px-4 py-3 text-sm font-medium text-[#6b6b63] hover:text-[#1a1a17] hover:bg-[#f2f0ec] rounded-xl transition-colors"
              >
                Research
              </Link>
              <div className="pt-3">
                <Link
                  to="/playground"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-center px-4 py-3 text-sm font-semibold bg-[#1a1a17] text-white rounded-xl"
                >
                  Try Playground
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
