import { motion } from "framer-motion";
import { ShieldCheck, Mail } from "lucide-react";

export default function Privacy() {
  const sections = [
    {
      id: "information-we-collect",
      title: "1. Information We Collect",
      content: (
        <>
          <p className="mb-4">
            We collect information from you when you join our waitlist, fill out a contact form, or otherwise communicate with us. The personal information that we collect depends on the context of your interactions with us and the Website. The personal information we collect may include:
          </p>
          <ul className="list-none space-y-4">
            <li className="flex gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#5227FF] mt-2 flex-shrink-0" />
              <p><strong>Names and Contact Data:</strong> We collect your first and last name, email address, and other similar contact data.</p>
            </li>
            <li className="flex gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#5227FF] mt-2 flex-shrink-0" />
              <p><strong>Professional Details:</strong> If you specify your role (e.g., Educator, Manufacturer, Researcher) in our contact forms, we store this to better tailor our communications.</p>
            </li>
          </ul>
        </>
      )
    },
    {
      id: "how-we-use",
      title: "2. How We Use Your Information",
      content: (
        <>
          <p className="mb-4">
            We use the information we collect or receive to:
          </p>
          <ul className="list-none space-y-4">
            <li className="flex gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a17] mt-2 flex-shrink-0" />
              <p>Send you updates regarding Project TACTO's development and prototype availability.</p>
            </li>
            <li className="flex gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a17] mt-2 flex-shrink-0" />
              <p>Respond to your inquiries and offer support.</p>
            </li>
            <li className="flex gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a17] mt-2 flex-shrink-0" />
              <p>Request feedback and contact you about your use of our Website.</p>
            </li>
          </ul>
        </>
      )
    },
    {
      id: "sharing",
      title: "3. Sharing Your Information",
      content: (
        <p>
          We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We do not sell your personal information to third parties under any circumstances.
        </p>
      )
    },
    {
      id: "security",
      title: "4. Data Security",
      content: (
        <p>
          We aim to protect your personal information through a system of organizational and technical security measures. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure.
        </p>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafaf8] pt-32 pb-32">
      <div className="mx-auto max-w-[1200px] px-6">
        
        {/* Header Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e4e2dd]/50 border border-[#c8c6c0]/50 text-xs font-bold tracking-widest uppercase text-[#6b6b63] mb-8">
            Legal
          </div>
          <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-[#1a1a17] mb-6" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
            Privacy Policy
          </h1>
          <p className="text-lg text-[#6b6b63] max-w-xl">
            We believe in transparency and building trust with our community. Here's a clear breakdown of how we handle your data.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_2.5fr] gap-16 lg:gap-24 items-start">
          
          {/* Sticky Sidebar */}
          <div className="hidden lg:block sticky top-32">
            <p className="text-xs font-bold tracking-[0.15em] uppercase text-[#a3a39b] mb-6">Contents</p>
            <ul className="space-y-4 border-l border-[#e4e2dd]">
              {sections.map((sec, i) => (
                <li key={i}>
                  <a href={`#${sec.id}`} className="block pl-4 text-sm font-medium text-[#6b6b63] hover:text-[#1a1a17] hover:border-l-2 hover:border-[#1a1a17] -ml-[1px] transition-all">
                    {sec.title}
                  </a>
                </li>
              ))}
            </ul>
            
            <div className="mt-12 p-6 rounded-2xl bg-[#f2f0ec] border border-[#e4e2dd]">
              <h4 className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#a3a39b] mb-2">Have questions?</h4>
              <a href="mailto:hello@projecttacto.org" className="text-sm font-medium text-[#1a1a17] hover:text-[#5227FF] transition-colors flex items-center gap-2">
                <Mail size={14} /> hello@projecttacto.org
              </a>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <p className="text-xl text-[#1a1a17] font-medium leading-relaxed mb-12 pb-12 border-b border-[#e4e2dd]">
                Project TACTO ("we," "our," or "us") is committed to protecting your privacy. This policy explains how your personal information is collected, used, and disclosed when you interact with our initiative.
              </p>

              <div className="space-y-16">
                {sections.map((sec, i) => (
                  <div key={i} id={sec.id} className="scroll-mt-32 group">
                    <h2 className="text-2xl font-medium text-[#1a1a17] mb-6 group-hover:text-[#5227FF] transition-colors" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                      {sec.title}
                    </h2>
                    <div className="text-[#6b6b63] text-lg leading-relaxed">
                      {sec.content}
                    </div>
                  </div>
                ))}
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
