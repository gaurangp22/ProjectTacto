import { useState } from "react";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

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

        try {
            const { error } = await supabase
                .from('waitlist')
                .insert([{ email }]);

            if (error) {
                if (error.code === '23505') {
                    toast.error("This email is already on the waitlist!");
                } else {
                    console.error('Supabase error:', error);
                    toast.error("Failed to join waitlist. Please try again.");
                }
                return;
            }

            setIsSuccess(true);
            toast.success("You've been added to the waitlist!");
            setEmail("");
        } catch (error) {
            console.error('Submission error:', error);
            toast.error("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className={cn(
                "flex items-center gap-3 font-medium p-5 bg-[#f2f0ec] border border-[#e4e2dd] rounded-2xl text-[#1a1a17]",
                className
            )}>
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>You're on the list. We'll be in touch soon.</span>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className={cn("relative", className)}>
            <div className="relative flex items-center">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className={cn(
                        "w-full bg-white border border-[#e4e2dd] rounded-full py-3.5 pl-5 pr-28 text-sm text-[#1a1a17] outline-none transition-all placeholder:text-[#a3a39b] md:text-[0.9375rem] md:py-4 md:pl-6 md:pr-48",
                        "focus:border-[#c8c6c0] focus:ring-2 focus:ring-[#e4e2dd]",
                        variant === "minimal" && "bg-[#f2f0ec] border-transparent"
                    )}
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="absolute right-1.5 top-1.5 bottom-1.5 rounded-full px-4 md:right-2 md:top-2 md:bottom-2 md:px-6 bg-[#1a1a17] text-white font-semibold hover:bg-[#333330] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <>
                            <span className="hidden md:inline">Join Waitlist</span>
                            <span className="inline md:hidden">Join</span>
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
