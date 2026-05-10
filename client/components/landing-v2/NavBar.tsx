import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const navLinks = [
    { label: "Mission", href: "#mission" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Impact", href: "#impact" },
];

export default function NavBar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollTo = (id: string) => {
        document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
        setMobileOpen(false);
    };

    return (
        <>
            <motion.header
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: EASE }}
                className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
                style={{
                    background: scrolled ? "rgba(245,240,234,0.85)" : "transparent",
                    backdropFilter: scrolled ? "blur(16px) saturate(1.2)" : "none",
                    borderBottom: scrolled ? "1px solid rgba(28,25,23,0.06)" : "1px solid transparent",
                }}
            >
                <nav className="t-container flex items-center justify-between" style={{ height: 72 }}>
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <img
                            src="/mock.png"
                            alt="Tacto"
                            className="h-9 w-auto transition-transform duration-300 group-hover:scale-105"
                        />
                    </Link>

                    {/* Desktop links */}
                    <div className="hidden md:flex items-center gap-10">
                        {navLinks.map((l) => (
                            <button
                                key={l.label}
                                onClick={() => scrollTo(l.href)}
                                className="relative text-sm font-medium transition-colors duration-300 group"
                                style={{ color: "var(--t-warm-gray)", fontFamily: "var(--t-font-body)" }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--t-charcoal)")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--t-warm-gray)")}
                            >
                                {l.label}
                                <span
                                    className="absolute -bottom-1 left-0 h-[1.5px] w-0 group-hover:w-full transition-all duration-300"
                                    style={{ background: "var(--t-coral)" }}
                                />
                            </button>
                        ))}
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link to="/whitepaper" className="text-sm font-medium transition-colors duration-300" style={{ color: "var(--t-warm-gray)" }}>
                            Research
                        </Link>
                        <Link to="/playground" className="t-btn t-btn-dark" style={{ padding: "0.6rem 1.4rem", fontSize: "0.8rem" }}>
                            Try Simulator
                        </Link>
                    </div>

                    {/* Mobile toggle */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2"
                        style={{ color: "var(--t-charcoal)" }}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </nav>
            </motion.header>

            {/* Mobile dropdown */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.25, ease: EASE }}
                        className="fixed inset-x-0 top-[72px] z-40 md:hidden p-6"
                        style={{
                            background: "rgba(245,240,234,0.96)",
                            backdropFilter: "blur(20px)",
                            borderBottom: "1px solid rgba(28,25,23,0.06)",
                        }}
                    >
                        <div className="flex flex-col gap-3">
                            {navLinks.map((l) => (
                                <button
                                    key={l.label}
                                    onClick={() => scrollTo(l.href)}
                                    className="text-left text-lg font-medium py-2 transition-colors"
                                    style={{ color: "var(--t-charcoal)" }}
                                >
                                    {l.label}
                                </button>
                            ))}
                            <hr className="t-rule my-2" />
                            <Link
                                to="/playground"
                                onClick={() => setMobileOpen(false)}
                                className="t-btn t-btn-dark w-full justify-center mt-1"
                            >
                                Try the Simulator
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
