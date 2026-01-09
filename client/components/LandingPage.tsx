import { ArrowRight, CheckCircle, Lightbulb, Zap, Code, Shield, Layers, Users, Heart, Nfc, AudioLines } from "lucide-react";
import { cn } from "@/lib/utils";
import FallingText from "./FallingText";
import WaitlistForm from "./WaitlistForm";
import ScrollReveal from "./ScrollReveal";
import Ballpit from "./Ballpit";
import DotGrid from "./DotGrid";
import Hyperspeed from "./Hyperspeed";
import { hyperspeedPresets } from "./HyperSpeedPresets";

export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans selection:bg-primary/30">

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background/95 to-secondary/30">
        {/* Abstract Background Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] animate-pulse-glow" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px] animate-pulse-glow delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[80px]" />
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-soft-light"></div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center pt-20 md:pt-28 pb-12">
          <div className="space-y-6 animate-float">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-6">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              <span className="text-sm font-semibold text-primary tracking-wide uppercase">Coming Soon • Join the Waitlist</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-foreground leading-[1.1]">
              Every child can <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500">Code</span> <br />
              If we design it <span className="italic font-serif text-foreground/80">Right.</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
              Tacto enables visually impaired children to learn programming concepts through physical blocks and real-time audio feedback.
            </p>

            <div className="pt-10 max-w-md mx-auto relative z-20">
              <WaitlistForm />
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group flex items-center gap-2 text-sm font-semibold text-foreground/80 hover:text-primary transition-all px-6 py-3 rounded-full bg-background/50 border border-foreground/10 hover:bg-background hover:shadow-md"
                >
                  See our story <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Visual/Mockup Placeholder */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent z-20 pointer-events-none" />
      </section>

      {/* Storytelling Section with ScrollReveal */}
      <section id="story" className="py-40 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-20 space-y-32">
            <ScrollReveal
              baseOpacity={0}
              enableBlur={true}
              baseRotation={5}
              blurStrength={15}
              containerClassName="mb-12"
            >
              Every app you use, every website you visit, is built on a foundation of code. It is the literacy of the 21st century.
            </ScrollReveal>

            <ScrollReveal
              baseOpacity={0.1}
              enableBlur={true}
              baseRotation={-3}
              blurStrength={10}
              textClassName="text-muted-foreground"
            >
              Yet the very tools designed to make coding easier rely almost entirely on vision — colors, shapes, screens, drag-and-drop interfaces — leaving 285 million learners locked out from the start.
            </ScrollReveal>

            <ScrollReveal
              baseOpacity={0}
              enableBlur={true}
              baseRotation={3}
              blurStrength={12}
            >
                For visually impaired students, this creates a silent message: you can consume technology, but you cannot create it.
            </ScrollReveal>

            <ScrollReveal
              baseOpacity={0.1}
              enableBlur={true}
              baseRotation={-2}
              blurStrength={10}
              textClassName="text-muted-foreground"
            >
              We refused to accept that. What if code wasn't just text on a screen? What if it was something you could hold? Something you could feel?
            </ScrollReveal>

            <ScrollReveal
              baseOpacity={0}
              enableBlur={true}
              baseRotation={0}
              blurStrength={20}
              textClassName="text-primary font-bold text-5xl md:text-7xl leading-tight"
            >
              Enter Tacto. A revolutionary tangible coding interface that speaks back.
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Problem Section with Falling Text */}
      <section id="problem" className="py-24 relative overflow-hidden bg-secondary/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="relative h-[80vh] min-h-[600px] w-full bg-background rounded-[2rem] border border-border/50 overflow-hidden shadow-2xl group flex flex-col items-center justify-center">

            {/* Text Content Overlay (Static) */}
            <div className="relative z-20 text-center pointer-events-none px-4 -mt-20">
              <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-4 animate-fade-in">The Reality</h2>
              <h3 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
                Traditional methods <br />
                <span className="text-destructive inline-block transform hover:rotate-2 transition-transform duration-300">are falling apart.</span>
              </h3>
              <div className="text-xl md:text-2xl font-medium text-muted-foreground/80 max-w-2xl mx-auto backdrop-blur-sm bg-background/30 rounded-full py-2 px-6 border border-white/5">
                For <span className="text-foreground font-bold">visually impaired students</span>, standard tools are broken.
              </div>
            </div>

            {/* Physics Container (Background Layer) */}
            <div className="absolute inset-0 z-10">
              <FallingText
                text="Visuals Syntax Screens Drag-and-Drop Mice Textbooks Blackboards Color-Coding"
                highlightWords={["Visuals", "Screens", "Syntax"]}
                highlightClass="text-destructive font-bold text-5xl md:text-6xl"
                trigger="scroll"
                gravity={0.4} // Slower fall for better effect
                fontSize="2rem"
                mouseConstraintStiffness={0.9}
                className="font-bold text-muted-foreground/20 w-full h-full"
              />
            </div>

            {/* Gradient Overlay for Bottom */}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none z-20" />
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {[
              { title: "Inaccessible", desc: "Block-based coding apps rely entirely on sight." },
              { title: "Complex", desc: "Text-based syntax is daunting and error-prone." },
              { title: "Exclusive", desc: "Students are reduced to passive listeners, not creators." }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white/5 border border-border/50 text-center hover:bg-white/10 transition-colors backdrop-blur-sm">
                <h4 className="text-xl font-bold mb-3 text-foreground">{item.title}</h4>
                <p className="text-lg text-muted-foreground leading-relaxed">"{item.desc}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-32 bg-background relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <h2 className="text-sm font-bold tracking-widest text-primary uppercase">The Innovation</h2>
            <h3 className="text-5xl md:text-6xl font-bold text-foreground">
              Code you can <span className="text-gradient">touch</span> and <span className="text-gradient">hear</span>.
            </h3>
            <p className="text-xl text-muted-foreground">
              Tacto transforms abstract programming logic into tangible blocks. It's safe, intuitive, and designed for independent learning.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Nfc className="w-8 h-8 text-white" />,
                title: "Tactile Blocks",
                desc: "Low-cost NFC blocks with distinct shapes and textures representing real programming structures.",
                color: "bg-blue-500"
              },
              {
                icon: <AudioLines className="w-8 h-8 text-white" />,
                title: "Reader Grid & Audio Engine",
                desc: "A central hub interprets block sequences and explains code through speech and sound.",
                color: "bg-purple-500"
              },
              {
                icon: <Code className="w-8 h-8 text-white" />,
                title: "Real Computational Thinking",
                desc: "Students learn algorithms, loops, conditionals, and abstraction — not just play patterns.",
                color: "bg-pink-500"
              }
            ].map((card, i) => (
              <div key={i} className="group relative p-8 rounded-[2rem] bg-secondary/30 border border-border shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-md transition-transform group-hover:scale-110 relative z-10", card.color)}>
                  {card.icon}
                </div>
                <h4 className="text-2xl font-bold mb-3 relative z-10">{card.title}</h4>
                <p className="text-muted-foreground text-lg leading-relaxed relative z-10">{card.desc}</p>
              </div>
            ))}
          </div>


          {/* Hyperspeed / Fast Lane Section */}
          <div className="mt-20 rounded-[2rem] overflow-hidden relative shadow-2xl border border-white/10 h-screen group">
            {/* Background Effect */}
            <div className="absolute inset-0 z-0">
              <Hyperspeed effectOptions={hyperspeedPresets.one} />
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center p-12 text-center pointer-events-none z-10">
              <div className="max-w-4xl space-y-8">
                <h3 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 animate-pulse-glow">
                  ACCELERATE <br /> YOUR FUTURE
                </h3>
                <p className="text-2xl md:text-3xl font-medium text-white/90 leading-relaxed shadow-lg">
                  "Tacto is not just a tool. It's the <span className="text-purple-400 font-bold italic">fast lane</span> to digital literacy."
                </p>
                <div className="flex justify-center gap-4 pt-4">
                  <span className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full text-sm font-bold text-white uppercase tracking-widest">
                    Zero Latency Learning
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      {/* How It Works - Tactile Pipeline */}
      <section id="how-it-works" className="py-32 bg-secondary/5 relative overflow-hidden">
        {/* Abstract Background Trace */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-border -translate-y-1/2 hidden md:block" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-4">How It Works</h2>
            <h3 className="text-4xl md:text-6xl font-black mb-6">From Touch to Logic</h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A seamless journey from physical play to digital creation. No screens needed to start.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {[
              {
                step: "01",
                title: "Snap",
                desc: "Connect tactile blocks to build code physically.",
                icon: <Layers className="w-8 h-8" />
              },
              {
                step: "02",
                title: "Bridge",
                desc: "Plug the Tacto Base into any device via USB.",
                icon: <Zap className="w-8 h-8" />
              },
              {
                step: "03",
                title: "Listen",
                desc: "Hear your code explained and debugged instantly.",
                icon: <Users className="w-8 h-8" /> // Using Users/Headphones metaphor
              },
              {
                step: "04",
                title: "Run",
                desc: "Watch the magic happen in the real world.",
                icon: <Code className="w-8 h-8" />
              }
            ].map((item, i) => (
              <div key={i} className="group relative bg-background border border-border/50 rounded-3xl p-8 hover:border-primary/50 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-2 duration-300 flex flex-col items-center text-center z-20">
                {/* Step Badge */}
                <div className="absolute -top-6 bg-background border border-border p-2 rounded-xl shadow-sm text-sm font-bold font-mono text-muted-foreground group-hover:text-primary group-hover:border-primary transition-colors">
                  {item.step}
                </div>

                <div className="w-16 h-16 rounded-2xl bg-secondary mb-6 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  {item.icon}
                </div>

                <h4 className="text-2xl font-bold mb-3">{item.title}</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DotGrid Connection Section */}
      <section className="relative h-[80vh] min-h-[600px] w-full bg-background overflow-hidden flex items-center justify-center">
        {/* Background */}
        <div className="absolute inset-0">
          <DotGrid
            dotSize={12}
            gap={24}
            baseColor="#d1d5db" // gray-300
            activeColor="#5227FF" // Primary brand color
            proximity={200}
            speedTrigger={50}
            shockRadius={300}
            shockStrength={8}
          />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 max-w-4xl px-6 text-center pointer-events-none mix-blend-multiply dark:mix-blend-normal">
          <h2 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter text-foreground">
            CONNECT <br /> THE DOTS
          </h2>
          <p className="text-2xl md:text-3xl font-medium text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            From a single tactile point to a world of infinite logic. <br />
            <span className="text-primary font-bold">We bridge the gap</span> between imagination and reality.
          </p>
        </div>
      </section>

      {/* Impact/Stats */}
      <section className="py-32 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        {/* Light burst effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-16">Empowering the Next Generation</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { val: "285M", label: "Visually Impaired People" },
              { val: "<1%", label: "Can Read Braille Code" },
              { val: "100%", label: "Tactile Engagement" },
              { val: "∞", label: "Possibilities" }
            ].map((stat, i) => (
              <div key={i} className="p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 hover:bg-white/15 transition-colors">
                <div className="text-5xl md:text-6xl font-bold mb-2 font-heading">{stat.val}</div>
                <div className="text-lg opacity-80 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section id="contact" className="py-32 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-50"></div>

        {/* Ballpit Background */}
        <div className="absolute inset-0 z-0 opacity-60">
          <Ballpit
            count={50}
            gravity={0.5}
            friction={0.9975}
            wallBounce={0.95}
            followCursor={true}
            colors={["#5227FF", "#7cff67", "#ff6b6b"]}
          />
        </div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative z-10 pointer-events-none">
          <Heart className="w-20 h-20 text-red-500 mx-auto mb-8 animate-pulse" fill="currentColor" />
          <h2 className="text-5xl md:text-7xl font-bold mb-8">Join the Movement</h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Help us build a world where every child can create, invent, and dream without barriers.
          </p>
          <div className="max-w-md mx-auto pointer-events-auto">
            <WaitlistForm />
          </div>
        </div>
      </section>

    </div>
  );
}
