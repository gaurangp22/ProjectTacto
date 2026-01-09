import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Heart } from "lucide-react";
import WaitlistForm from "./WaitlistForm";

export default function Footer() {
    return (
        <footer className="bg-background border-t border-border/40 pt-20 pb-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-6 group">
                            <img src="/mock.png" alt="Tacto Logo" className="h-8 w-auto object-contain" />
                        </Link>
                        <p className="text-muted-foreground leading-relaxed mb-6">
                            Empowering visually impaired children to build the future, one block at a time.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all transform hover:scale-110">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-foreground mb-6">Product</h4>
                        <ul className="space-y-4">
                            {["Features", "How it Works", "Pricing", "Case Studies", "Reviews"].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-foreground mb-6">Resources</h4>
                        <ul className="space-y-4">
                            {["Documentation", "For Teachers", "Community", "Blog", "Help Center"].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-foreground mb-6">Stay Updated</h4>
                        <p className="text-muted-foreground mb-4">Join our waitlist for the latest updates.</p>
                        <div className="max-w-xs">
                            <WaitlistForm variant="minimal" />
                        </div>
                    </div>
                </div>

                <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-muted-foreground text-sm">
                        © {new Date().getFullYear()} Tacto Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
                        <span className="flex items-center gap-1">
                            Made with <Heart size={14} className="text-red-500 fill-red-500" /> for accessibility
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
