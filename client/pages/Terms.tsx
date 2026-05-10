import { motion } from "framer-motion";
import { Scale, Mail } from "lucide-react";

export default function Terms() {
  const sections = [
    {
      id: "intellectual-property",
      title: "1. Intellectual Property Rights",
      content: (
        <>
          <p className="mb-6">
            Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein are owned or controlled by us or licensed to us.
          </p>
          <div className="p-6 rounded-2xl bg-[#f2f0ec] border border-[#e4e2dd]">
            <p className="text-[#1a1a17] font-medium">Open Source Commitment</p>
            <p className="text-sm mt-2">Project TACTO is an open-source hardware initiative. Specific hardware schematics, STLs, and software repositories will be released under their respective open-source licenses (e.g., MIT, GPL) upon official publication.</p>
          </div>
        </>
      )
    },
    {
      id: "user-representations",
      title: "2. User Representations",
      content: (
        <p>
          By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary.
        </p>
      )
    },
    {
      id: "prohibited-activities",
      title: "3. Prohibited Activities",
      content: (
        <p>
          You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
        </p>
      )
    },
    {
      id: "modifications",
      title: "4. Modifications",
      content: (
        <p>
          We reserve the right to change, modify, or remove the contents of the Site at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Site.
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
            Terms of Service
          </h1>
          <p className="text-lg text-[#6b6b63] max-w-xl">
            The rules and guidelines for interacting with Project TACTO. By accessing our site, you agree to these terms.
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
              <h4 className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#a3a39b] mb-2">Legal inquiries?</h4>
              <a href="mailto:contact@projecttacto.org" className="text-sm font-medium text-[#1a1a17] hover:text-[#2b5e54] transition-colors flex items-center gap-2">
                <Mail size={14} /> contact@projecttacto.org
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
                Welcome to Project TACTO. By accessing our website, you agree to be bound by these Terms of Service and to use the site in accordance with these Terms, our Privacy Policy, and any additional terms and conditions that may apply.
              </p>

              <div className="space-y-16">
                {sections.map((sec, i) => (
                  <div key={i} id={sec.id} className="scroll-mt-32 group">
                    <h2 className="text-2xl font-medium text-[#1a1a17] mb-6 group-hover:text-[#2b5e54] transition-colors" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
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
