import { Link } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
        isScrolled ? "bg-background/70 backdrop-blur-lg border-white/10 shadow-sm" : "bg-transparent"
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-2xl tracking-tighter hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-white text-lg font-bold font-heading">T</span>
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">Tacto</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          {["The Problem", "The Solution", "How It Works", "About"].map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item.toLowerCase().replace(/ /g, "-"))}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hover:scale-105 transform duration-200"
            >
              {item}
            </button>
          ))}
        </div>

        {/* CTA Button - Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => scrollToSection("contact")}
            className="group px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 flex items-center gap-2"
          >
            Get Started
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 border-b border-border/50 bg-background/95 backdrop-blur-xl animate-accordion-down shadow-xl">
          <div className="px-4 py-6 space-y-4">
            {["The Problem", "The Solution", "How It Works", "About"].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase().replace(/ /g, "-"))}
                className="block w-full text-left px-4 py-3 text-base font-medium text-foreground hover:bg-secondary/50 rounded-xl transition-colors"
              >
                {item}
              </button>
            ))}
            <button
              onClick={() => scrollToSection("contact")}
              className="w-full mt-4 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
            >
              Get Started
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
