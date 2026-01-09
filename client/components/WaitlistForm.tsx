import { useState } from "react";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface WaitlistFormProps {
    variant?: "default" | "minimal";
    className?: string;
}

export default function WaitlistForm({ variant = "default", className }: WaitlistFormProps) {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setIsLoading(false);
        setIsSuccess(true);
        toast.success("You've been added to the waitlist!");
        setEmail("");
    };

    if (isSuccess) {
        return (
            <div className={cn("flex items-center gap-2 text-primary font-medium p-4 bg-primary/10 rounded-xl animate-in fade-in zoom-in duration-300", className)}>
                <CheckCircle className="w-5 h-5" />
                <span>You're on the list! We'll be in touch.</span>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className={cn("relative group", className)}>
            <div className="relative flex items-center">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className={cn(
                        "w-full bg-background border border-input rounded-full py-3 pl-5 pr-40 text-sm outline-none transition-all placeholder:text-muted-foreground/60 md:text-base md:py-4 md:pl-6 md:pr-48",
                        "focus:border-primary/50 focus:ring-4 focus:ring-primary/10",
                        variant === "minimal" && "bg-secondary/50 border-transparent focus:bg-background"
                    )}
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="absolute right-1.5 top-1.5 bottom-1.5 rounded-full px-4 md:right-2 md:top-2 md:bottom-2 md:px-6 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 text-sm md:text-base"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            Join Waitlist
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </div>
            <p className="mt-3 text-sm text-muted-foreground pl-4">
                <span className="text-primary font-medium">370+</span> people joined this week.
            </p>
        </form>
    );
}
