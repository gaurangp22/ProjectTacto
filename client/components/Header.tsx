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
        </div>

        {/* CTA Button - Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => scrollToSection("contact")}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Get Started
          </button>
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
            <button
              onClick={() => scrollToSection("contact")}
              className="block w-full px-4 py-2 mt-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
