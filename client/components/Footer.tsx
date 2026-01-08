import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Heart } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-background border-t border-border/40 pt-20 pb-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 font-bold text-2xl mb-6">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white text-sm font-bold font-heading">T</span>
                            </div>
                            <span className="text-foreground">Tacto</span>
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
                        <p className="text-muted-foreground mb-4">Join our newsletter for the latest updates.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 bg-secondary/50 border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                            <button className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                                <Mail size={18} />
                            </button>
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
