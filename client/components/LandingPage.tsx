import { ArrowRight, CheckCircle, Lightbulb, Zap, Code, Shield, Layers, Users, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans selection:bg-primary/30">

      {/* Hero Section */}
      <section className="relative min-h-[110vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background/95 to-secondary/30">
        {/* Abstract Background Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] animate-pulse-glow" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px] animate-pulse-glow delay-1000" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center pt-20">
          <div className="space-y-8 animate-float">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-8">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              <span className="text-sm font-semibold text-primary tracking-wide uppercase">Revolutionizing Accessibility</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-foreground leading-[1.1]">
              Code with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500">Touch.</span> <br />
              Build with <span className="italic font-serif text-foreground/80">Feeling.</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
              Tacto enables visually impaired children to learn programming concepts through physical blocks and real-time audio feedback.
            </p>

            <div className="pt-10 flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={() => document.getElementById('solution')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative px-8 py-4 bg-primary text-primary-foreground text-lg rounded-full font-semibold hover:bg-primary/90 transition-all shadow-[0_0_40px_-10px_rgba(var(--primary),0.5)] hover:shadow-[0_0_60px_-15px_rgba(var(--primary),0.6)] flex items-center gap-3"
              >
                Discover Tacto
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-secondary/50 backdrop-blur-sm border border-border text-foreground text-lg rounded-full font-semibold hover:bg-secondary transition-all flex items-center gap-3"
              >
                See How It Works
              </button>
            </div>
          </div>
        </div>

        {/* Hero Visual/Mockup Placeholder */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-20 pointer-events-none" />
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-32 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-sm font-bold tracking-widest text-primary uppercase">The Challenge</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                Millions are locked out of the digital future.
              </h3>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Modern coding tools rely heavily on screens and drag-and-drop visuals. For millions of visually impaired students, this creates an almost insurmountable barrier to STEM education.
              </p>

              <div className="space-y-4 pt-4">
                {[
                  "Inaccessible visual programming environments",
                  "Heavy reliance on sighted assistance",
                  "Exclusion from computational thinking",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 border border-border/50">
                    <div className="p-2 rounded-lg bg-destructive/10 text-destructive">
                      <Shield className="w-5 h-5" />
                    </div>
                    <span className="text-lg font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-purple-600/30 rounded-[2rem] blur-3xl transform rotate-3" />
              <div className="relative glass-card p-10 rounded-[2rem] border border-white/10">
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <span className="text-6xl">🚫</span>
                    <div>
                      <h4 className="text-2xl font-bold mb-2">Screen Barrier</h4>
                      <p className="text-muted-foreground">Standard block-based coding apps are completely unusable for blind students.</p>
                    </div>
                  </div>
                  <div className="h-px bg-border/50" />
                  <div className="flex items-start gap-4">
                    <span className="text-6xl">📉</span>
                    <div>
                      <h4 className="text-2xl font-bold mb-2">Confidence Gap</h4>
                      <p className="text-muted-foreground">Without accessible tools, students internalize that "tech isn't for them."</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-32 bg-secondary/20 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

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
                icon: <Layers className="w-8 h-8 text-white" />,
                title: "Tactile Blocks",
                desc: "Distinct shapes for loops, conditions, and actions that are instantly recognizable by touch.",
                color: "bg-blue-500"
              },
              {
                icon: <Zap className="w-8 h-8 text-white" />,
                title: "Instant Feedback",
                desc: "Connects via USB to provide immediate audio explanations of the code structure.",
                color: "bg-purple-500"
              },
              {
                icon: <Code className="w-8 h-8 text-white" />,
                title: "Real Logic",
                desc: "Teaches standard programming concepts like loops and variables, not just games.",
                color: "bg-pink-500"
              }
            ].map((card, i) => (
              <div key={i} className="group relative p-8 rounded-[2rem] bg-background border border-border shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-md transition-transform group-hover:scale-110", card.color)}>
                  {card.icon}
                </div>
                <h4 className="text-2xl font-bold mb-3">{card.title}</h4>
                <p className="text-muted-foreground text-lg leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 rounded-[2rem] overflow-hidden relative shadow-2xl border border-white/10 h-[500px]">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F462fdc1538bd468b99eec373dc088499%2F819b6a3564b745d49eb26f960092f150?format=webp&width=1600"
              alt="Tacto Product Demo"
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-10">
              <p className="text-white text-2xl font-medium max-w-2xl">
                "With Tacto, I wrote my first program without anyone's help. I finally felt like a creator."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-8">How It Works</h2>
              <h3 className="text-4xl md:text-5xl font-bold mb-10">Simple steps to <br />complex logic.</h3>

              <div className="space-y-12">
                {[
                  { step: "01", title: "Build", desc: "Snap tactile blocks together to form logic chains." },
                  { step: "02", title: "Connect", desc: "Plug into any standard tablet or phone via USB." },
                  { step: "03", title: "Listen", desc: "Hear the code read aloud and debug with audio cues." },
                  { step: "04", title: "Execute", desc: "Watch (or hear) your program control robots or games." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 group">
                    <span className="text-5xl font-bold text-muted-foreground/20 group-hover:text-primary/30 transition-colors font-heading">{item.step}</span>
                    <div>
                      <h4 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{item.title}</h4>
                      <p className="text-lg text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] rounded-[2rem] bg-gradient-to-br from-gray-900 to-gray-800 border-4 border-gray-700 shadow-2xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516110833967-0b5716ca1387?q=80&w=1000&auto=format&fit=crop')] bg-cover opacity-20 mix-blend-overlay"></div>
                <div className="text-center p-10 relative z-10 text-white space-y-4">
                  <Code className="w-24 h-24 mx-auto text-primary opacity-50 mb-4" />
                  <p className="text-2xl font-mono text-primary">if (button.pressed) {`{`}</p>
                  <p className="text-2xl font-mono pl-8 text-blue-400">play(sound);</p>
                  <p className="text-2xl font-mono text-primary">{`}`}</p>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-10 -left-10 bg-white dark:bg-card p-6 rounded-2xl shadow-xl border border-border animate-float">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full text-green-600 dark:text-green-400">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Screen-Free</p>
                    <p className="text-muted-foreground">100% Tactile Interface</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact/Stats */}
      <section className="py-32 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-16">Empowering the Next Generation</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { val: "285M", label: "Visually Impaired People" },
              { val: "<1%", label: "Can Read Braille Code" },
              { val: "100%", label: "Tactile Engagement" },
              { val: "∞", label: "Possibilities" }
            ].map((stat, i) => (
              <div key={i} className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <div className="text-5xl md:text-6xl font-bold mb-2 font-heading">{stat.val}</div>
                <div className="text-lg opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section id="contact" className="py-32 bg-background relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Heart className="w-16 h-16 text-red-500 mx-auto mb-8 animate-pulse" fill="currentColor" />
          <h2 className="text-5xl md:text-7xl font-bold mb-8">Join the Movement</h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Help us build a world where every child can create, invent, and dream without barriers.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="px-10 py-5 bg-foreground text-background text-xl rounded-full font-bold hover:bg-foreground/80 transition-all shadow-xl hover:shadow-2xl hover:scale-105">
              Partner With Us
            </button>
            <button className="px-10 py-5 bg-transparent border-2 border-foreground/10 text-foreground text-xl rounded-full font-bold hover:bg-secondary transition-all">
              Donate Kits
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
