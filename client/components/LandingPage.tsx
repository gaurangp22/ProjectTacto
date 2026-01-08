import { ArrowRight, CheckCircle, Lightbulb, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://cdn.builder.io/api/v1/image/assets%2F462fdc1538bd468b99eec373dc088499%2F819b6a3564b745d49eb26f960092f150?format=webp&width=1200')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center py-20">
          <div className="space-y-6">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground">
              Tacto
            </h1>
            <p className="text-xl sm:text-2xl font-semibold text-foreground">
              Learn Coding Through Touch
            </p>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Tacto is a tactile programming system that enables visually impaired children to learn coding using physical blocks and audio feedback — no screens required.
            </p>

            <div className="pt-8 space-y-4 sm:flex sm:flex-col sm:items-center sm:gap-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all hover:scale-105 flex items-center gap-2 text-lg">
                  See the Product
                  <ArrowRight size={20} />
                </button>
                <button className="px-8 py-3 border-2 border-foreground text-foreground rounded-lg font-semibold hover:bg-foreground/10 transition-all flex items-center gap-2 text-lg">
                  How It Works
                  <ArrowRight size={20} />
                </button>
              </div>
              <p className="text-foreground/70 text-sm pt-4">
                Build logic with your hands. Hear your code come alive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section
        id="problem"
        className="py-20 sm:py-32 bg-white"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              🟢 THE PROBLEM
            </h2>
            <h3 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Millions of Children Are Locked Out of Coding Education
            </h3>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Most coding platforms are built around screens, visuals, and drag-and-drop interfaces. For visually impaired students, this creates major barriers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-12">
            {[
              "No access to visual block programming",
              "Heavy dependence on teachers or assistants",
              "Limited exposure to computational thinking",
              "Low confidence in STEM subjects",
            ].map((issue, i) => (
              <div key={i} className="flex items-start gap-4 p-6 bg-slate-50 rounded-lg border border-border">
                <div className="text-2xl">❌</div>
                <p className="text-foreground font-medium">{issue}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-8 bg-primary/5 border-2 border-primary rounded-xl">
            <p className="text-lg text-foreground italic text-center">
              Yet coding is not about seeing — it's about logic, structure, and problem-solving.
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section
        id="solution"
        className="py-20 sm:py-32 bg-gradient-to-br from-primary/5 to-accent/5"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              🟢 THE SOLUTION
            </h2>
            <h3 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Coding That You Can Touch and Hear
            </h3>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Tacto transforms programming into a physical experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="space-y-6">
              <p className="text-lg text-foreground">
                Children arrange tactile hardware blocks that represent programming concepts like:
              </p>
              <div className="space-y-3">
                {[
                  "Events (button pressed)",
                  "Conditions (if / else)",
                  "Actions (move, change value)",
                  "Loops (repeat)",
                ].map((concept, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <p className="text-foreground">{concept}</p>
                  </div>
                ))}
              </div>

              <p className="text-lg text-foreground pt-4">
                These blocks connect to a phone or tablet via USB. The device processes the logic and gives real-time audio feedback, explaining what the program does and whether it works correctly.
              </p>

              <div className="space-y-2 pt-4">
                {[
                  "No screen dependency.",
                  "No memorizing syntax.",
                  "Just real programming logic — physically.",
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-primary text-xl">👉</span>
                    <p className="text-foreground font-medium">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F462fdc1538bd468b99eec373dc088499%2F819b6a3564b745d49eb26f960092f150?format=webp&width=600"
                  alt="Tacto Product"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-20 sm:py-32 bg-white"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              🟢 HOW TACTO WORKS
            </h2>
            <h3 className="text-4xl sm:text-5xl font-bold text-foreground">
              Step-by-Step
            </h3>
          </div>

          <div className="space-y-8">
            {[
              {
                step: 1,
                title: "Build Logic Using Physical Blocks",
                description: "Each block represents a coding instruction. Children arrange blocks in sequence, just like forming sentences. Blocks are designed to be: Easy to recognize by touch, Structured to guide correct order, Safe and child-friendly.",
              },
              {
                step: 2,
                title: "Connect to Phone/Tablet via USB",
                description: "Once the blocks are arranged, the board sends the structure of the program to the phone or tablet using USB communication. No internet required. No complicated setup.",
              },
              {
                step: 3,
                title: "Audio Explains the Program",
                description: "The mobile app reads out the program: 'If the left button is pressed, increase the value by one.' If there is a logical mistake: 'This condition has no action connected. Please add a response block.' This allows children to understand what they built, debug independently, and learn core programming thinking.",
              },
              {
                step: 4,
                title: "See the Result or Control Real Objects (Future)",
                description: "Tacto can be connected to on-screen simulations, small robots, games and puzzles. Children can hear and feel the effect of their programs, making learning engaging and fun.",
              },
            ].map((item) => (
              <div key={item.step} className="grid md:grid-cols-4 gap-6 items-start">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                    {item.step}
                  </div>
                  {item.step < 4 && (
                    <div className="hidden md:block w-1 h-20 bg-gradient-to-b from-primary to-transparent" />
                  )}
                </div>
                <div className="md:col-span-3">
                  <h4 className="text-2xl font-bold text-foreground mb-3">
                    {item.title}
                  </h4>
                  <p className="text-lg text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Children Learn */}
      <section className="py-20 sm:py-32 bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              🟢 WHAT CHILDREN LEARN
            </h2>
            <h3 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Core Programming Concepts
            </h3>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Tacto teaches the same core concepts as modern coding platforms, but in a way that is accessible, physical, and confidence-building.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {[
              "Events and triggers",
              "Conditional logic (if / else)",
              "Variables and values",
              "Loops and repetition",
              "Cause and effect thinking",
              "Problem-solving skills",
            ].map((concept, i) => (
              <div key={i} className="p-6 bg-white rounded-lg border border-border flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <p className="text-foreground font-medium">{concept}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Is Tacto For */}
      <section className="py-20 sm:py-32 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              🟢 WHO IS TACTO FOR
            </h2>
            <h3 className="text-4xl sm:text-5xl font-bold text-foreground">
              Reaching Those Who Need It Most
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            {[
              { icon: "🎒", title: "Schools for visually impaired students" },
              { icon: "🧠", title: "Special education centers" },
              { icon: "🏠", title: "Parents of visually impaired children" },
              { icon: "🤝", title: "NGOs working in inclusive education" },
              { icon: "🧪", title: "Innovation labs and STEM programs" },
              { icon: "👨‍🏫", title: "Educators and instructors" },
            ].map((audience, i) => (
              <div key={i} className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-border">
                <p className="text-4xl mb-3">{audience.icon}</p>
                <p className="text-lg font-medium text-foreground">{audience.title}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-8 bg-primary/5 border-2 border-primary rounded-xl text-center">
            <p className="text-lg text-foreground">
              <span className="font-semibold">Tacto works alongside teachers</span> — it does not replace them. It empowers students to explore independently.
            </p>
          </div>
        </div>
      </section>

      {/* Why Tacto Matters */}
      <section className="py-20 sm:py-32 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              🟢 WHY TACTO MATTERS
            </h2>
            <h3 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Because Accessibility Should Not Be an Afterthought
            </h3>
          </div>

          <div className="max-w-3xl mx-auto">
            <p className="text-xl text-foreground mb-8 leading-relaxed">
              Coding education should not depend on eyesight. With Tacto, we aim to:
            </p>

            <div className="space-y-4 mb-8">
              {[
                "Reduce dependence on constant supervision",
                "Increase confidence in technical subjects",
                "Open future opportunities in STEM",
                "Make classrooms truly inclusive",
              ].map((goal, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-lg border border-border">
                  <Lightbulb className="w-6 h-6 text-primary flex-shrink-0" />
                  <p className="text-lg text-foreground">{goal}</p>
                </div>
              ))}
            </div>

            <p className="text-lg text-muted-foreground italic">
              This directly supports UN Sustainable Development Goal 4: Quality Education for All.
            </p>
          </div>
        </div>
      </section>

      {/* MVP Status */}
      <section className="py-20 sm:py-32 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              🟢 MVP STATUS
            </h2>
            <h3 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Built for Real-World Testing
            </h3>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Tacto is currently in MVP (Minimum Viable Product) stage.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mt-12">
            <div>
              <h4 className="text-2xl font-bold text-foreground mb-6">
                Current Prototype Includes:
              </h4>
              <div className="space-y-4">
                {[
                  "Tactile programming blocks",
                  "USB communication to phone/tablet",
                  "Audio-based code interpretation",
                  "Basic logic validation",
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-primary" />
                    <p className="text-foreground">{feature}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-2xl font-bold text-foreground mb-6">
                Currently Improving:
              </h4>
              <div className="space-y-4">
                {[
                  "Block variety",
                  "Voice explanations",
                  "Learning modules",
                  "User experience refinement",
                ].map((improvement, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-accent" />
                    <p className="text-foreground">{improvement}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Future Roadmap */}
      <section className="py-20 sm:py-32 bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              🟢 FUTURE ROADMAP
            </h2>
            <h3 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Upcoming Features Planned
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { emoji: "🔊", text: "Fully voice-guided lessons" },
              { emoji: "🧲", text: "Magnetic self-aligning blocks" },
              { emoji: "🤖", text: "Robot and IoT integration" },
              { emoji: "📊", text: "Teacher progress dashboard" },
              { emoji: "🌐", text: "Multilingual audio support" },
              { emoji: "🎓", text: "Advanced curriculum modules" },
            ].map((item, i) => (
              <div key={i} className="p-8 bg-white rounded-lg border border-border flex items-start gap-4">
                <span className="text-4xl">{item.emoji}</span>
                <p className="text-lg font-medium text-foreground">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-8 bg-primary/5 border-2 border-primary rounded-xl text-center">
            <p className="text-xl text-foreground font-semibold">
              Our vision is to make Tacto a complete accessible coding ecosystem.
            </p>
          </div>
        </div>
      </section>

      {/* Closing Statement */}
      <section className="py-20 sm:py-32 bg-gradient-to-br from-primary to-accent text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl sm:text-6xl font-bold mb-6">
            Building the Future, One Touch at a Time
          </h2>
          <p className="text-xl sm:text-2xl mb-8 opacity-90 leading-relaxed">
            Tacto is not just a product. It is a step toward equal opportunity in technology education.
          </p>
          <p className="text-lg sm:text-xl opacity-85 leading-relaxed">
            Because every child deserves the chance to learn, build, and dream — no matter how they see the world.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-slate-100 transition-all text-lg">
              Learn More
            </button>
            <button className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all text-lg">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
