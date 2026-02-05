import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link
          to="/"
          onClick={() => scrollToSection("hero")}
          className="flex items-center gap-2 font-bold text-xl text-primary"
        >
          <img src="/mock.png" alt="Tacto Logo" className="h-16 w-auto object-contain group-hover:scale-105 transition-transform duration-300" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection("problem")}
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            The Problem
          </button>
          <button
            onClick={() => scrollToSection("solution")}
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            The Solution
          </button>
          <button
            onClick={() => scrollToSection("how-it-works")}
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection("story")}
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Our Story
          </button>
          <Link
            to="/playground"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            🎮 Try Simulator
          </Link>
        </div>

        {/* CTA Buttons - Desktop */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/playground"
            className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg"
          >
            🎮 Try Simulator
          </Link>
          <Link
            to="/whitepaper"
            className="px-5 py-2 border border-border text-foreground rounded-lg font-medium hover:bg-secondary transition-colors"
          >
            Whitepaper
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-foreground"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-4 space-y-3">
            <button
              onClick={() => scrollToSection("problem")}
              className="block w-full text-left px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary rounded-lg transition-colors"
            >
              The Problem
            </button>
            <button
              onClick={() => scrollToSection("solution")}
              className="block w-full text-left px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary rounded-lg transition-colors"
            >
              The Solution
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="block w-full text-left px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary rounded-lg transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("story")}
              className="block w-full text-left px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary rounded-lg transition-colors"
            >
              Our Story
            </button>
            <Link
              to="/playground"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full text-center px-4 py-3 mt-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-md"
            >
              🎮 Try Simulator
            </Link>
            <Link
              to="/whitepaper"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full text-center px-4 py-2 mt-2 border border-border text-foreground rounded-lg font-medium hover:bg-secondary transition-colors"
            >
              Whitepaper
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
