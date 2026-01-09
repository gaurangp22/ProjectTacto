import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Heart, ArrowRight } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-background border-t border-border/40 pt-20 pb-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-6 group">
                            <h3 className="text-2xl font-bold tracking-tighter">Project TACTO</h3>
                        </Link>
                        <p className="text-muted-foreground leading-relaxed mb-6">
                            Exploring tactile and auditory approaches to computational thinking for visually impaired learners.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-foreground mb-6">Project</h4>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/whitepaper" className="text-muted-foreground hover:text-primary transition-colors">Research</Link>
                            </li>
                            <li>
                                <Link to="/whitepaper" className="text-muted-foreground hover:text-primary transition-colors">White Paper</Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-foreground mb-6">Resources</h4>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/whitepaper#pedagogical-framework" className="text-muted-foreground hover:text-primary transition-colors">For Educators</Link>
                            </li>
                            <li>
                                <Link to="/whitepaper#introduction" className="text-muted-foreground hover:text-primary transition-colors">Accessibility by Design</Link>
                            </li>
                            <li>
                                <Link to="/whitepaper#feasibility" className="text-muted-foreground hover:text-primary transition-colors">Open-Source Vision</Link>
                            </li>
                            <li>
                                <Link to="/whitepaper#future-work" className="text-muted-foreground hover:text-primary transition-colors">Community</Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-foreground mb-6">Stay Updated</h4>
                        <p className="text-muted-foreground mb-4">Follow Project TACTO as it develops.</p>
                        <button
                            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all hover:scale-105 shadow-md hover:shadow-lg"
                        >
                            Get Project Updates <ArrowRight size={16} />
                        </button>
                    </div>
                </div>

                <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col md:flex-row gap-2 md:gap-8 items-center">
                        <p className="text-muted-foreground text-sm">
                            © {new Date().getFullYear()} Project TACTO
                        </p>
                        <p className="text-muted-foreground text-sm flex items-center gap-1">
                            A student-led research and design initiative focused on inclusive education.
                        </p>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
