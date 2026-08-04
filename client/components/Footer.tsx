import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Footer() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  // Stagger children for the big text
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.1
      }
    }
  };

  const letterAnim = {
    hidden: { y: "100%", opacity: 0, rotate: 5 },
    visible: {
      y: "0%",
      opacity: 1,
      rotate: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const text = "PROJECT TACTO";

  return (
    <footer ref={ref} className="bg-[#fafaf8] border-t border-[#e4e2dd] pt-24 pb-8 overflow-hidden relative">
      <div className="mx-auto max-w-[1400px] px-6">

        {/* ─── Top Section ─── */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-16 md:gap-8 mb-24">

          {/* Left: Call to action / Vision */}
          <div className="max-w-md">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-3xl font-medium tracking-tight text-[#1a1a17] mb-6"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            >
              Experience inclusion.
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[#6b6b63] leading-relaxed text-sm"
            >
              A tangible coding system for visually impaired learners.
              Open hardware. Built for everyone.
            </motion.p>
          </div>

          {/* Right: Links Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap gap-10 md:gap-24"
          >
            <div>
              <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-[#1a1a17] mb-6">
                Platform
              </h4>
              <ul className="space-y-4">
                <li>
                  <Link to="/playground" className="text-sm text-[#6b6b63] hover:text-[#1a1a17] transition-all hover:translate-x-1 inline-flex items-center gap-1">
                    Playground <ArrowUpRight size={12} />
                  </Link>
                </li>
                <li>
                  <Link to="/whitepaper" className="text-sm text-[#6b6b63] hover:text-[#1a1a17] transition-all hover:translate-x-1">
                    Research Paper
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-[#1a1a17] mb-6">
                Resources
              </h4>
              <ul className="space-y-4">
                <li>
                  <Link to="/whitepaper#pedagogical-framework" className="text-sm text-[#6b6b63] hover:text-[#1a1a17] transition-all hover:translate-x-1">
                    For Educators
                  </Link>
                </li>
                <li>
                  <Link to="/evaluation-metrics" className="text-sm text-[#6b6b63] hover:text-[#1a1a17] transition-all hover:translate-x-1">
                    Evaluation Metrics
                  </Link>
                </li>
                <li>
                  <Link to="/scalability" className="text-sm text-[#6b6b63] hover:text-[#1a1a17] transition-all hover:translate-x-1">
                    Scale & Sustainability
                  </Link>
                </li>
                <li>
                  <Link to="/whitepaper#feasibility" className="text-sm text-[#6b6b63] hover:text-[#1a1a17] transition-all hover:translate-x-1">
                    Open Source
                  </Link>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* ─── Huge PROJECT TACTO text ─── */}
        <div className="w-full flex justify-center mb-12 overflow-hidden py-4">
          <motion.h1
            variants={container}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="text-[clamp(2.5rem,11.5vw,20rem)] leading-[0.85] tracking-tighter font-bold text-[#1a1a17] cursor-default flex flex-nowrap justify-center whitespace-nowrap"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
          >
            {text.split("").map((char, i) => (
              <motion.span
                key={i}
                variants={letterAnim}
                whileHover={{
                  y: -15,
                  color: ['#1a1a17', '#8b3a2f', '#2b5e54', '#4a3566', '#d97757'][i % 5],
                  rotate: Math.random() * 8 - 4,
                  scale: 1.05
                }}
                className="inline-block transition-colors duration-200"
                style={{ width: char === " " ? "0.3em" : "auto" }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.h1>
        </div>

        {/* ─── Bottom Section ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="border-t border-[#e4e2dd] pt-8 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <div className="flex items-center gap-3 group">
            <img
              src="/tacto-website-logo.png"
              alt="Project TACTO Logo"
              className="h-6 w-auto object-contain opacity-60 group-hover:opacity-100 transition-opacity"
            />
            <span className="text-sm font-semibold tracking-wide text-[#1a1a17]">
              Project TACTO
            </span>
          </div>

          <div className="flex items-center gap-8 text-xs text-[#6b6b63]">
            <Link to="/privacy" className="hover:text-[#1a1a17] transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#1a1a17] hover:after:w-full after:transition-all">Privacy</Link>
            <Link to="/terms" className="hover:text-[#1a1a17] transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#1a1a17] hover:after:w-full after:transition-all">Terms</Link>
            <span className="opacity-50">© {new Date().getFullYear()}</span>
          </div>
        </motion.div>

      </div>
    </footer>
  );
}
