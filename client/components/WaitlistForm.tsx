import { useState } from "react";
import { ArrowRight, Check, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";

interface WaitlistFormProps {
    variant?: "default" | "minimal";
    className?: string;
}

export default function WaitlistForm({ variant = "default", className }: WaitlistFormProps) {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error" | "duplicate">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        setStatus("idle");

        try {
            const { error } = await supabase
                .from('waitlist')
                .insert([{ email }]);

            if (error) {
                if (error.code === '23505') {
                    setStatus("duplicate");
                    setErrorMessage("You're already on the list!");
                } else {
                    console.error('Supabase error:', error);
                    setStatus("error");
                    setErrorMessage("Something went wrong. Please try again.");
                }
                return;
            }

            setStatus("success");
            setEmail("");
        } catch (error) {
            console.error('Submission error:', error);
            setStatus("error");
            setErrorMessage("Connection failed. Check your internet.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn("relative", className)}>
            <AnimatePresence mode="wait">
                {status === "success" ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="flex items-center gap-4 p-5 bg-[#f2f0ec] border border-[#e4e2dd] rounded-full"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 15 }}
                            className="w-10 h-10 rounded-full bg-[#2b5e54] flex items-center justify-center flex-shrink-0"
                        >
                            <Check className="w-5 h-5 text-white" strokeWidth={3} />
                        </motion.div>
                        <div>
                            <motion.p
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, duration: 0.4 }}
                                className="text-sm font-semibold text-[#1a1a17]"
                            >
                                You're on the list.
                            </motion.p>
                            <motion.p
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4, duration: 0.4 }}
                                className="text-xs text-[#6b6b63]"
                            >
                                We'll reach out when it's time.
                            </motion.p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.form
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onSubmit={handleSubmit}
                    >
                        <div className="relative flex items-center">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (status === "error" || status === "duplicate") setStatus("idle");
                                }}
                                placeholder="Your email address"
                                required
                                disabled={isLoading}
                                className={cn(
                                    "w-full bg-white border rounded-full py-3.5 pl-5 pr-28 text-sm text-[#1a1a17] outline-none transition-all placeholder:text-[#a3a39b] md:text-[0.9375rem] md:py-4 md:pl-6 md:pr-48 disabled:opacity-60",
                                    "focus:border-[#c8c6c0] focus:ring-2 focus:ring-[#e4e2dd]",
                                    variant === "minimal" && "bg-[#f2f0ec] border-transparent",
                                    (status === "error" || status === "duplicate")
                                        ? "border-red-300 focus:ring-red-100 focus:border-red-400"
                                        : "border-[#e4e2dd]"
                                )}
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="absolute right-1.5 top-1.5 bottom-1.5 rounded-full px-4 md:right-2 md:top-2 md:bottom-2 md:px-6 bg-[#1a1a17] text-white font-semibold hover:bg-[#333330] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                            >
                                {isLoading ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                    >
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    </motion.div>
                                ) : (
                                    <>
                                        <span className="hidden md:inline">Join Waitlist</span>
                                        <span className="inline md:hidden">Join</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Inline error message */}
                        <AnimatePresence>
                            {(status === "error" || status === "duplicate") && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8, height: 0 }}
                                    animate={{ opacity: 1, y: 0, height: "auto" }}
                                    exit={{ opacity: 0, y: -8, height: 0 }}
                                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                    className="overflow-hidden"
                                >
                                    <div className={cn(
                                        "flex items-center gap-2 mt-3 px-4 py-2.5 rounded-xl text-xs font-medium",
                                        status === "duplicate"
                                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                                            : "bg-red-50 text-red-600 border border-red-200"
                                    )}>
                                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                        {errorMessage}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    );
}
