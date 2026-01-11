import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowLeft, Download, FileText, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const WhitepaperPage = () => {
    const [activeSection, setActiveSection] = useState("executive-summary");
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace("#", "");
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        } else {
            window.scrollTo(0, 0);
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: "-20% 0px -35% 0px" } // Adjust threshold to trigger a bit earlier/later
        );

        const sections = document.querySelectorAll("section[id]");
        sections.forEach((section) => observer.observe(section));

        return () => sections.forEach((section) => observer.unobserve(section));
    }, []);

    const sections = [
        { id: "executive-summary", label: "Executive Summary" },
        { id: "introduction", label: "1. Introduction" },
        { id: "related-work", label: "2. Related Work" },
        { id: "pedagogical-framework", label: "3. Pedagogical Framework" },
        { id: "technical-architecture", label: "4. Technical Architecture" },
        { id: "pedagogical-design", label: "5. Pedagogical Design" },
        { id: "feasibility", label: "6. Feasibility & Cost" },
        { id: "limitations", label: "7. Limitations" },
        { id: "future-work", label: "8. Future Work" },
        { id: "conclusion", label: "9. Conclusion" },
    ];

    const handleShare = async () => {
        const shareData = {
            title: 'TACTO: An Open-Source Tactile STEM Ecosystem',
            text: 'Check out the TACTO whitepaper: A framework for inclusive computational thinking.',
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(window.location.href);
                // Optionally add a toast here if "sonner" is available, but basic fallback works.
                alert("Link copied to clipboard!");
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-20 print:pt-0 print:pb-0">
            {/* Hero Header */}
            <div className="bg-secondary/5 border-b border-border/40 py-16 mb-12 print:border-none print:py-0 print:mb-8 print:bg-transparent">
                <div className="container max-w-5xl mx-auto px-6 print:px-0">
                    <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors group print:hidden">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Project
                    </Link>
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8 print:block">
                        <div className="max-w-3xl print:max-w-none">
                            <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest rounded-full mb-6 print:border print:border-black print:text-black print:bg-transparent">
                                White Paper
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6 leading-tight print:text-black">
                                TACTO: An Open-Source Tactile STEM Ecosystem (OSTSE) Framework
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed print:text-black">
                                For Inclusive Computational Thinking
                            </p>
                        </div>
                        <div className="flex gap-3 print:hidden">
                            <Button variant="outline" className="gap-2" onClick={() => window.print()}>
                                <Download className="w-4 h-4" /> PDF
                            </Button>
                            <Button variant="outline" size="icon" onClick={handleShare}>
                                <Share2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 print:block print:px-0">
                {/* Sidebar / TOC */}
                <aside className="lg:col-span-3 hidden lg:block print:hidden">
                    <div className="sticky top-32 space-y-2 text-sm border-l-2 border-border/50 pl-4">
                        <p className="font-bold text-foreground mb-4 uppercase tracking-wider text-xs">Contents</p>
                        {sections.map((section) => (
                            <a
                                key={section.id}
                                href={`#${section.id}`}
                                className={`block transition-all duration-200 ${activeSection === section.id
                                    ? "text-primary font-bold translate-x-1"
                                    : "text-muted-foreground hover:text-foreground hover:translate-x-0.5"
                                    }`}
                            >
                                {section.label}
                            </a>
                        ))}
                    </div>
                </aside>

                {/* Main Content */}
                <article className="lg:col-span-12 xl:col-span-8 prose prose-lg prose-invert max-w-none text-muted-foreground/90 print:col-span-12 print:w-full print:max-w-none print:text-black print:prose-neutral">

                    {/* Executive Summary */}
                    <section id="executive-summary" className="mb-16">
                        <h2 className="text-3xl font-bold text-foreground mb-6">Executive Summary</h2>
                        <p className="mb-6">
                            The democratization of Computer Science (CS) education has emerged as a critical imperative in the 21st-century global economy, yet this movement has systematically excluded a significant demographic: learners with visual impairments (VI). The dominant pedagogical paradigm for introductory programming relies heavily on block-based languages (BBLs) such as Scratch and Blockly. These environments utilize visual metaphors—color-coded blocks, drag-and-drop spatial arrangements, and graphical feedback loops—that fundamentally alienate blind and low-vision students. This exclusion is not merely a matter of inconvenience; it represents a structural "pedagogical paradox" where the very tools designed to lower the barrier to entry for sighted novices simultaneously erect insurmountable walls for the visually impaired, effectively severing the pipeline to STEM careers before students can even engage with the material.
                        </p>
                        <p className="mb-6">
                            Current market solutions, most notably Microsoft’s Code Jumper, have validated the efficacy of Tangible User Interfaces (TUIs) in bridging this gap. By physicalizing code into manipulable objects, TUIs leverage haptic and tactile sensory channels, aligning with theories of Embodied Cognition and Constructionism. However, the existing landscape of assistive technology is marred by prohibitive costs, proprietary "black box" hardware, and a lack of customizability. A single commercial kit can cost upwards of $1,000 USD, rendering it inaccessible to underfunded school districts, developing nations, and informal learning spaces.
                        </p>
                        <p className="mb-6">
                            This white paper proposes <strong>TACTO</strong>, a comprehensive framework developed under the Open-Source Tactile STEM Ecosystem (OSTSE) initiative. TACTO represents a paradigm shift from expensive, active-electronic tokens to a low-cost, passive-NFC (Near Field Communication) architecture. By shifting computational intelligence from the individual block to a central, multiplexed "Reader Grid," TACTO reduces the marginal cost of a code block to mere cents. This architecture enables the decentralized fabrication of programming kits via 3D printing and off-the-shelf electronics, adhering to the principles of the Global Open Science Hardware (GOSH) movement.
                        </p>
                        <p className="mb-6">
                            Grounded in the pedagogical frameworks of Constructionism, Universal Design for Learning (UDL), and Embodied Cognition, TACTO is designed not just as an accommodation, but as a robust medium for epistemic development. This report provides an exhaustive analysis of the accessibility crisis in CS education, a detailed critique of existing interventions, and a comprehensive technical and pedagogical specification for the TACTO framework. It aims to serve as a reproducible blueprint for faculty, researchers, and NGOs committed to dismantling the digital divide and fostering a truly inclusive future for computational thinking.
                        </p>
                    </section>

                    <hr className="border-border/20 my-12" />

                    {/* 1. Introduction */}
                    <section id="introduction" className="mb-16">
                        <h2 className="text-3xl font-bold text-foreground mb-6">1. Introduction</h2>

                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">1.1 The Crisis of Exclusion in Computer Science Education</h3>
                        <p className="mb-6">
                            The integration of computational thinking (CT) into K-12 curricula has transformed from a niche elective to a core educational requirement globally. Governments and educational bodies recognize that literacy in the digital age encompasses the ability to read, write, and debug code. However, as the pedagogical tools for teaching these concepts have evolved to become more "user-friendly" for the sighted majority, they have inadvertently deepened the exclusion of students with visual impairments.
                        </p>
                        <p className="mb-6">
                            The core of this exclusion lies in the dominance of visual programming languages (VPLs). Tools like Scratch, Alice, and Blockly abstract the syntactic complexity of text-based coding (commas, semicolons, rigid indentation) into visual puzzles. For a sighted student, the shape of a block (e.g., a "C" shaped bracket for a loop) intuitively communicates its function as a container for other instructions. Syntax errors are prevented physically; puzzle pieces simply do not fit together if the logic is invalid. For a visually impaired student, however, this information is trapped behind the glass surface of a screen. Screen readers, which linearize two-dimensional visual information into a one-dimensional stream of synthetic speech, struggle to convey the nested, spatial relationships inherent in block-based code.<sup>1</sup> Navigating a complex Scratch project with a screen reader can become a cognitive nightmare, requiring the student to memorize the state of the "canvas" rather than focusing on the logic of the algorithm.
                        </p>
                        <p className="mb-6">
                            The statistics are sobering. Research indicates that while interest in STEM is high among students with disabilities, retention is alarmingly low. At the collegiate level, 32% of undergraduate computer science majors with disabilities report feeling like outsiders in the field. This percentage spikes to nearly 46% for women or underrepresented minorities with disabilities, creating a compounding effect of intersectional exclusion.<sup>2</sup> This sense of alienation often stems from early educational experiences where their primary mode of interaction is accommodation—waiting for a teacher to translate a visual activity into a text description—rather than active participation. The reliance on visual programming creates a pedagogical gatekeeping mechanism: tools designed to democratize coding for the masses simultaneously lock the door for the blind.<sup>2</sup>
                        </p>

                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">1.2 The "Pedagogical Paradox" and the Cognitive Load</h3>
                        <p className="mb-6">
                            The exclusion of VI learners is exacerbated by what researchers term a "pedagogical paradox." The visual affordances that reduce cognitive load for sighted learners—color coding, shape matching, spatial grouping—increase cognitive load for VI learners when translated into audio. A sighted student glances at a screen and instantly recognizes a "Forever Loop" by its yellow color and wrapping shape. A blind student must listen to a screen reader announce, "Control block, Forever, start of container," traverse the contents line by line, and then hear "end of container." This process consumes working memory that should be dedicated to computational problem-solving.<sup>3</sup>
                        </p>
                        <p className="mb-6">
                            Furthermore, the transition from these inaccessible block-based introductory tools to professional text-based languages is abrupt. While text-based languages like Python or Quorum are technically accessible via screen readers, they present a steep learning curve for young children (ages 7-11). Sighted children enjoy a scaffolded journey from blocks to text; blind children are often forced to leap directly into the deep end of syntax errors and abstract logic without the "training wheels" of physical or visual constraints.<sup>4</sup> This gap in the curriculum is where many VI students lose confidence and interest in STEM.
                        </p>

                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">1.3 The Economic and Technical Barriers of Current Solutions</h3>
                        <p className="mb-6">
                            To bridge this gap, the field of Human-Computer Interaction (HCI) has developed Tangible Programming Languages (TPLs). These systems bring the block-based metaphor into the physical world, allowing students to construct code using physical objects. Microsoft’s Project Torino, which was commercialized as Code Jumper, is the most prominent example. By connecting physical pods that represent commands, students can build programs that generate music or stories.
                        </p>
                        <p className="mb-6">
                            While Code Jumper has proven the pedagogical value of TPLs, its commercial implementation has introduced significant economic barriers. A single Code Jumper kit retails for approximately $1,000 to $1,300 USD.<sup>5</sup> For a well-funded private school in North America, this might be a feasible expense. For a resource-constrained public school in the Global South, or even an underfunded district in the US, this price point makes 1:1 deployment impossible. Consequently, tangible coding remains a luxury for the few rather than a standard for the many.
                        </p>
                        <p className="mb-6">
                            Moreover, these commercial devices are "black boxes." They utilize proprietary communication protocols and custom hardware that are impossible for a user to repair or modify. If a pod breaks in a rural school in India, the kit is rendered useless until a replacement can be shipped from the US or Europe. This dependency on centralized, proprietary supply chains violates the principles of sustainable and inclusive design.<sup>7</sup>
                        </p>

                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">1.4 The OSTSE Initiative and the TACTO Framework</h3>
                        <p className="mb-6">
                            The Open-Source Tactile STEM Ecosystem (OSTSE) initiative was conceived to address these intersecting failures of pedagogy, technology, and economics. OSTSE posits that accessibility should not be a premium add-on but a fundamental right, achievable through open collaboration and distributed manufacturing.
                        </p>
                        <p className="mb-6">
                            TACTO is the flagship framework of this initiative. It proposes a radical restructuring of the hardware stack for tangible programming. Instead of embedding expensive microcontrollers, batteries, and active electronics into every single code block (as seen in Code Jumper), TACTO utilizes passive NFC (Near Field Communication) technology. The code blocks are inert, 3D-printed shells containing inexpensive NFC tags (costing roughly $0.20 each). The computational intelligence is shifted to a central "Reader Grid" or "Hub" that detects the sequence and identity of the blocks.
                        </p>
                        <p className="mb-6">
                            This architectural shift achieves three critical goals:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-6 text-muted-foreground">
                            <li><strong>Drastic Cost Reduction:</strong> A classroom set of commands can be printed and tagged for a fraction of the cost of active electronics, bringing the total kit cost under $100 USD.</li>
                            <li><strong>Open-Source Scalability:</strong> The designs can be replicated by local makerspaces, libraries, or universities using standard 3D printers and off-the-shelf components, adhering to GOSH principles.<sup>7</sup></li>
                            <li><strong>Pedagogical Flexibility:</strong> Teachers can create custom blocks by simply programming a generic tag and applying a tactile label, allowing the tool to evolve with the curriculum rather than being constrained by a fixed set of factory-made commands.</li>
                        </ul>
                        <p className="mb-6">
                            This report details the theoretical underpinnings, technical architecture, and pedagogical strategies of TACTO, providing a roadmap for a more inclusive, equitable, and sustainable future for computer science education.
                        </p>
                    </section>

                    <hr className="border-border/20 my-12" />

                    {/* 2. Related Work */}
                    <section id="related-work" className="mb-16">
                        <h2 className="text-3xl font-bold text-foreground mb-6">2. Related Work and Critical Gap Analysis</h2>
                        <p className="mb-6">
                            To situate TACTO within the broader landscape of assistive technology (AT) and computer science education, it is necessary to analyze existing solutions. We can categorize current approaches into three main domains: Auditory/Text-Based Environments, Vision-Based Tangible Interfaces, and Active-Electronic Tangible Interfaces.
                        </p>

                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">2.1 Auditory and Text-Based Environments: The Limits of Serial Processing</h3>
                        <p className="mb-6">
                            Early efforts to make programming accessible focused on sonification. Systems like JavaSpeak attempted to render the structure of code through auditory cues, assigning different tones or voices to different syntactic elements (e.g., loops, conditionals).<sup>2</sup> While these tools assist professional blind programmers who have already developed robust mental models of code structure, they present a steep barrier for novices. Audio is inherently serial; a user must listen to information sequentially. Unlike a visual interface, where a user can glance at a block of code and instantly perceive its nested structure, an auditory interface requires the user to hold the entire structure in working memory while navigating line by line.
                        </p>
                        <p className="mb-6">
                            Text-based languages (TBLs) that are "born accessible," such as Quorum, have made significant strides by simplifying syntax and optimizing for screen readers.<sup>8</sup> However, text-based coding lacks the "discoverability" of block-based languages. In Scratch, a student can browse a palette of available commands; in a text editor, the student faces a blank page and must recall commands from memory. For young learners (ages 7-11), this recall-heavy interaction model can be discouraging and cognitively overwhelming.<sup>9</sup>
                        </p>

                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">2.2 Vision-Based Tangible Interfaces: The Occlusion Problem</h3>
                        <p className="mb-6">
                            Several academic projects have attempted to create low-cost tangible programming languages using computer vision (CV). Projects like T-Scratch or TIP-Toy use passive blocks marked with fiducial markers (like QR codes or TopCodes) which are read by a webcam connected to a computer.<sup>11</sup>
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-6 text-muted-foreground">
                            <li><strong>Mechanism:</strong> The user arranges paper or plastic blocks on a table. A camera, usually mounted overhead or on a stand, captures the scene, identifies the markers, and executes the code.</li>
                            <li><strong>Strengths:</strong> These systems are incredibly cheap to produce. The blocks can often be made of paper.</li>
                            <li><strong>Weaknesses for VI Users:</strong> The reliance on a camera creates a fundamental usability issue for blind users: occlusion and framing. A blind child cannot know if their hand is blocking the camera's view, or if a block has been placed slightly outside the camera's field of vision. This lack of immediate, reliable confirmation breaks the feedback loop essential for independent learning. If the system fails to read a block, the user does not know if it is a code error or a camera error.<sup>2</sup></li>
                        </ul>

                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">2.3 Active-Electronic Tangible Interfaces: The Cost Barrier</h3>
                        <p className="mb-6">
                            The most successful implementations of accessible coding for the blind have been active-electronic TPLs, with Code Jumper being the gold standard.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-6 text-muted-foreground">
                            <li><strong>Mechanism:</strong> Code Jumper consists of large, distinctively shaped plastic pods. Each pod contains a microcontroller, a battery (or power bus), and firmware. The pods connect via physical cables (audio jacks), forming a daisy chain. The shape of the pod indicates its function, and the physical connection establishes the sequence.<sup>4</sup></li>
                            <li><strong>Strengths:</strong> The system is robust and provides excellent tactile feedback. The physical connection is unambiguous; a "click" confirms the link. The audio feedback is immediate.</li>
                            <li><strong>Weaknesses:</strong> The primary drawback is cost. The reliance on custom PCBs, injection-molded plastics with embedded electronics, and complex assembly drives the price to over $1,000 per kit. Furthermore, the system is closed. Educators cannot print a new "pod" if they want to teach a new concept. The proprietary nature of the hardware creates a dependency on a single vendor, which is a significant risk for sustainability in educational contexts.<sup>3</sup></li>
                        </ul>

                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">2.4 Google's Project Bloks: A Precursor</h3>
                        <p className="mb-6">
                            Google’s Project Bloks research offered a middle ground. It proposed an architecture separating the "Puck" (the physical command, which could be passive or simple) from the "Base Board" (the active reader) and the "Brain Board" (the central processor).<sup>15</sup>
                        </p>
                        <p className="mb-6">
                            <strong>Relevance to TACTO:</strong> TACTO adopts this architectural insight—separating the instruction from the processor—but replaces the capacitive sensing and active base boards of Project Bloks with a simpler, passive NFC approach. Project Bloks was a research platform that never saw widespread commercial release or open-source release in a way that allowed easy replication by schools.
                        </p>

                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">2.5 Gap Analysis Table</h3>
                        <p className="mb-6">
                            The following table summarizes the landscape and identifies the specific niche TACTO aims to fill:
                        </p>

                        <div className="overflow-x-auto rounded-xl border border-border/50 bg-secondary/5 my-8">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-secondary/20 text-foreground font-bold">
                                    <tr>
                                        <th className="p-4">Feature</th>
                                        <th className="p-4">Scratch/Blockly (Visual)</th>
                                        <th className="p-4">Code Jumper (Active TUI)</th>
                                        <th className="p-4">Vision-Based TUI</th>
                                        <th className="p-4 bg-primary/10">TACTO (Proposed)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/20">
                                    <tr>
                                        <td className="p-4 font-medium">Primary Modality</td>
                                        <td className="p-4">Visual (Screen)</td>
                                        <td className="p-4">Tactile (Active)</td>
                                        <td className="p-4">Tactile + Visual (Camera)</td>
                                        <td className="p-4 bg-primary/5">Tactile (Passive NFC)</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium">Accessibility (VI)</td>
                                        <td className="p-4">Low (Inaccessible)</td>
                                        <td className="p-4">High</td>
                                        <td className="p-4">Medium (Occlusion)</td>
                                        <td className="p-4 bg-primary/5">High</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium">Cost Profile</td>
                                        <td className="p-4">Free (Software)</td>
                                        <td className="p-4">High ($1,000+)</td>
                                        <td className="p-4">Low (Paper/Plastic)</td>
                                        <td className="p-4 bg-primary/5">Low (&lt;$100)</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium">Reliability</td>
                                        <td className="p-4">High</td>
                                        <td className="p-4">High</td>
                                        <td className="p-4">Low (lighting/framing)</td>
                                        <td className="p-4 bg-primary/5">High (RF Coupling)</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium">Reproducibility</td>
                                        <td className="p-4">N/A</td>
                                        <td className="p-4">Low (Proprietary)</td>
                                        <td className="p-4">High (Printable)</td>
                                        <td className="p-4 bg-primary/5">High (Open Source)</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium">Extensibility</td>
                                        <td className="p-4">High (Software)</td>
                                        <td className="p-4">Low (Hardware locked)</td>
                                        <td className="p-4">Medium (Print markers)</td>
                                        <td className="p-4 bg-primary/5">High (Prog. Tags)</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="text-sm text-muted-foreground italic mb-6">
                            Insight: TACTO creates a unique value proposition by combining the high accessibility and reliability of active systems like Code Jumper with the low cost and reproducibility of passive/vision-based systems. By leveraging NFC, it eliminates the "black box" complexity of active pods and the unreliability of cameras.
                        </p>
                    </section>

                    <hr className="border-border/20 my-12" />

                    {/* 3. Pedagogical Framework */}
                    <section id="pedagogical-framework" className="mb-16">
                        <h2 className="text-3xl font-bold text-foreground mb-6">3. Pedagogical Framework</h2>
                        <p className="mb-6">
                            The design of TACTO is not merely an engineering exercise; it is the physical manifestation of specific learning theories that argue for the necessity of physical engagement in the development of abstract thinking. TACTO synthesizes Constructionism, Embodied Cognition, and Universal Design for Learning (UDL) into a cohesive pedagogical strategy.
                        </p>

                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">3.1 Constructionism and the "Object-to-Think-With"</h3>
                        <p className="mb-6">
                            Seymour Papert’s theory of Constructionism builds upon Jean Piaget's Constructivism. While Piaget argued that learners build knowledge structures inside their heads, Papert added that this happens most effectively when the learner is consciously engaged in constructing a public entity—whether it be a sandcastle, a theory, or a computer program.<sup>17</sup>
                        </p>
                        <p className="mb-6">
                            For visually impaired learners, the material availability of the "construction material" is paramount. In a screen-based environment, the building blocks of code are virtual pixels. The VI learner cannot "hold" a loop or "weigh" a variable. They are alienated from the construction process, forced to interact with the artifact through the mediation of a screen reader.
                        </p>
                        <p className="mb-6">
                            TACTO provides physical "objects-to-think-with".<sup>11</sup> A physical block representing a "Loop" is not just a command; it is an artifact that possesses weight, texture, and dimension. This physical manipulation allows the student to "debug" their logic by feeling the sequence. If a loop structure is not closed, the student feels the gap in the physical chain. This translates an abstract syntactic error (missing closing brace) into a concrete tactile reality (missing physical bridge). This aligns with the constructionist view that knowledge is built through interaction with the world, not just passive absorption of information.
                        </p>

                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">3.2 Embodied Cognition: Syntax as Space and Time</h3>
                        <p className="mb-6">
                            Embodied Cognition theory suggests that cognitive processes are deeply rooted in the body's interactions with the environment.<sup>17</sup> For blind individuals, who rely on haptic and auditory feedback to construct their mental models of the world, embodiment is the primary channel for information acquisition.
                        </p>
                        <p className="mb-6">
                            Traditional CS education is often disembodied; code exists in a virtual space that has no physical coordinates. TACTO re-embodies code by mapping the abstract concepts of programming onto physical space and bodily movement.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-6 text-muted-foreground">
                            <li><strong>Time is Space:</strong> Research into the "TIME IS SPACE" conceptual metaphor demonstrates that embodied interventions can enhance comprehension of abstract concepts.<sup>19</sup> TACTO leverages this by mapping the temporal flow of program execution to the spatial arrangement of blocks. The student "reads" the future execution of the program by tracing the physical path of the blocks from left to right.</li>
                            <li><strong>Logic as Path:</strong> Conditionals (If/Then) become branching paths on a board. The student must physically trace the divergence, enacting the decision-making process of the computer.</li>
                            <li><strong>Containment:</strong> Variables or nested loops are represented as containers. Placing a "Note" block inside a "Loop" frame physically demonstrates the concept of scope and containment, which are notoriously difficult to grasp in text-based coding.<sup>10</sup></li>
                        </ul>

                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">3.3 Universal Design for Learning (UDL)</h3>
                        <p className="mb-6">
                            Universal Design for Learning (UDL) mandates that educational tools should be designed to meet the needs of all learners from the start, rather than retrofitting accessibility for a few.<sup>13</sup> While TACTO is designed with VI learners in mind, its tangible nature benefits all students, particularly those with kinesthetic learning styles, attention deficits, or cognitive challenges who struggle with screen-based abstraction.
                        </p>
                        <p className="mb-6">
                            TACTO adheres to the three principles of UDL:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-6 text-muted-foreground">
                            <li><strong>Multiple Means of Representation:</strong> Information is presented tactually (texture/shape), auditorily (speech/music), and visually (high-contrast colors/LEDs).</li>
                            <li><strong>Multiple Means of Action and Expression:</strong> Students can construct code by placing blocks, turning dials, or even using "unplugged" body movements that map to the blocks.</li>
                            <li><strong>Multiple Means of Engagement:</strong> The collaborative nature of the physical blocks fosters social learning. A blind student and a sighted student can work together on the same physical code—one reading the Braille, the other seeing the colors—breaking down the social isolation often experienced by VI students in integrated classrooms.<sup>2</sup></li>
                        </ul>
                    </section>

                    <hr className="border-border/20 my-12" />

                    {/* 4. Technical Architecture */}
                    <section id="technical-architecture" className="mb-16">
                        <h2 className="text-3xl font-bold text-foreground mb-6">4. The TACTO Framework: Technical Architecture</h2>
                        <p className="mb-6">
                            The TACTO system is designed to be modular, hackable, and affordable. It consists of three primary hardware layers: The Passive Tactile Blocks (Data Layer), The Reader Grid (Input Layer), and The Brain (Processing Layer).
                        </p>

                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">4.1 Layer 1: The Passive Tactile Blocks (Data Layer)</h3>
                        <p className="mb-6">
                            The fundamental innovation of TACTO is the removal of active electronics from the code blocks. Unlike Code Jumper pods, which contain microcontrollers and require power, TACTO blocks are inert, 3D-printed shells containing a passive NFC tag.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-6 text-muted-foreground">
                            <li><strong>NFC Technology:</strong> We utilize ISO 14443A compliant tags, specifically the NTAG213 or MIFARE Classic 1K.</li>
                            <li><strong>Cost & Availability:</strong> These tags are ubiquitous, often costing between $0.10 and $0.30 USD when purchased in bulk.<sup>21</sup> They are widely available from electronics suppliers like Mouser, DigiKey, and even general retailers like Amazon or AliExpress.</li>
                            <li><strong>Durability:</strong> Being passive, they have no battery to replace and are water-resistant. They can be embedded directly into the 3D printed plastic during the printing process (by pausing the print and inserting the tag), rendering them completely sealed and tamper-proof.</li>
                            <li><strong>Data Structure:</strong> The tag stores a unique identifier (UID) and a small amount of user memory (NDEF records). TACTO uses the UID to identify the block type (e.g., UID 04:A3:... maps to "Play Sound"). This allows for infinite extensibility; a new block can be "registered" in the software without needing new hardware.<sup>24</sup></li>
                        </ul>
                        <p className="mt-6 mb-4 font-semibold text-foreground">Tactile Interaction Design</p>
                        <p className="mb-4">The blocks use a strict tactile hierarchy to convey information <sup>25</sup>:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-6 text-muted-foreground">
                            <li><strong>Shape (Macro-Affordance):</strong> Defines the class of command.
                                <ul className="list-[circle] pl-6 mt-2 space-y-1">
                                    <li><em>Command Blocks:</em> Square/Cubic.</li>
                                    <li><em>Control Blocks (Loops):</em> C-shaped or U-shaped frames that physically encompass other blocks.<sup>10</sup></li>
                                    <li><em>Parameter Tokens:</em> Circular "coins" or "pucks" that fit into depressions on command blocks to modify values (e.g., changing pitch or duration).</li>
                                </ul>
                            </li>
                            <li><strong>Texture (Micro-Affordance):</strong> Defines the specific function.
                                <ul className="list-[circle] pl-6 mt-2 space-y-1">
                                    <li><em>Movement:</em> Arrows or directional ridges.</li>
                                    <li><em>Sound:</em> A speaker grille texture (bumps).</li>
                                    <li><em>Logic:</em> Smooth or geometric patterns.</li>
                                </ul>
                            </li>
                            <li><strong>Braille and High-Contrast Labels:</strong> Every block features a recessed area for a label that includes both Braille (for blind users) and high-contrast large print (for low-vision users), ensuring compliance with accessibility standards.<sup>27</sup></li>
                        </ul>

                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">4.2 Layer 2: The Reader Grid (Input Layer)</h3>
                        <p className="mb-6">
                            The challenge with NFC in a programming context is sequencing. Standard readers typically read one tag at a time. To read a sequence of code, TACTO employs a multiplexed reader architecture embedded in a "Hub" or "Grid."
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-6 text-muted-foreground">
                            <li><strong>Multiplexing Architecture:</strong> Instead of using expensive individual readers for each slot, TACTO uses a single high-performance NFC reader chip—such as the NXP PN532 or ST Microelectronics ST25R3916—connected to an RF multiplexer circuit.</li>
                            <li><strong>The Mux:</strong> An analog multiplexer (e.g., 74HC4052 or dedicated RF switches) routes the RF signal from the single reader chip to one of several PCB coil antennas arranged in a grid or line.<sup>30</sup></li>
                            <li><strong>Operation:</strong> The microcontroller cycles through the antennas (Slot 1, Slot 2, Slot 3...) at high speed (e.g., 10-20Hz). This creates the illusion of simultaneous detection. The system builds a virtual map of which block is in which slot.</li>
                            <li><strong>Topology Options:</strong>
                                <ul className="list-[circle] pl-6 mt-2 space-y-1">
                                    <li><em>The Train:</em> A modular system where "carriages" snap together. This requires a bus system (I2C) and is more complex.</li>
                                    <li><em>The Grid (Preferred):</em> A fixed board (e.g., 1x8 or 4x4) with embedded antennas. This is more robust and cheaper to manufacture as a single PCB. It eliminates the need for expensive electromechanical connectors between blocks, which are often points of failure.<sup>30</sup></li>
                                </ul>
                            </li>
                        </ul>

                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">4.3 Layer 3: The Brain (Processing Layer)</h3>
                        <p className="mb-6">
                            The central intelligence of the system is the ESP32 microcontroller.
                        </p>
                        <p className="mb-4 font-semibold text-foreground">Why ESP32?</p>
                        <ul className="list-disc pl-6 space-y-2 mb-6 text-muted-foreground">
                            <li><strong>Cost-Performance:</strong> At ~$5 USD, the ESP32 is significantly cheaper than a Raspberry Pi but offers a dual-core 240 MHz processor capable of handling the multiplexing logic and audio synthesis.<sup>33</sup></li>
                            <li><strong>Connectivity:</strong> Integrated WiFi and Bluetooth (BLE) allow TACTO to connect to companion apps, update firmware, or send code to a PC (bridging to screen-based languages).</li>
                            <li><strong>Audio Capabilities:</strong> The ESP32 supports I2S (Inter-IC Sound) protocol, allowing high-quality digital audio output via a low-cost amplifier (e.g., MAX98357A) and a standard 3W speaker.<sup>35</sup></li>
                        </ul>
                        <p className="mt-6 mb-4 font-semibold text-foreground">Firmware Logic:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-6 text-muted-foreground">
                            <li><strong>Scan Loop:</strong> The ESP32 drives the Mux to poll antennas 1 through N.</li>
                            <li><strong>Detection:</strong> It reads the UIDs of detected tags.</li>
                            <li><strong>Parsing:</strong> It compares the sequence of UIDs against a lookup table (e.g., UID X = "Loop Start", UID Y = "Note C").</li>
                            <li><strong>Execution:</strong> It builds an Abstract Syntax Tree (AST) and executes the logic. If a syntax error is detected (e.g., a Loop Start with no Loop End), it triggers an auditory error message.</li>
                        </ul>

                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">4.4 The "Open Grid" PCB Design</h3>
                        <p className="mb-6">
                            To facilitate open-source reproduction, the PCB design for the Reader Grid is optimized for low-cost manufacturing. It uses standard FR4 material and 2-layer traces. The antenna coils are etched directly onto the PCB, eliminating the need for winding copper wire coils. This allows services like JLCPCB or PCBWay to manufacture the boards for less than $5 per unit at scale. The design files (KiCad/Eagle) are made available under an open hardware license (CERN OHL or similar), empowering local makerspaces to fabricate the boards independently.<sup>36</sup>
                        </p>
                    </section>

                    <hr className="border-border/20 my-12" />

                    {/* 5. Pedagogical Design */}
                    <section id="pedagogical-design" className="mb-16">
                        <h2 className="text-3xl font-bold text-foreground mb-6">5. Pedagogical Design: Instruction through Interaction</h2>
                        <p className="mb-6">
                            TACTO’s hardware serves as the scaffolding for a rich pedagogical strategy dubbed "Compose & Code." This curriculum prioritizes musical composition as the entry point for computational thinking, leveraging the natural link between musical notation and algorithmic sequencing.
                        </p>

                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">5.1 The "Unplugged" Phase: Embodiment Before Technology</h3>
                        <p className="mb-6">
                            Before introducing the TACTO hardware, the curriculum begins with "unplugged" activities that use the body as the coding medium.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-6 text-muted-foreground">
                            <li><strong>Activity: "Robot Student."</strong> One student acts as the "Programmer," tapping tactile commands onto the back or shoulder of another student, the "Robot."</li>
                            <li><strong>Connection:</strong> The tactile cues used in this phase (e.g., a double tap for "Jump," a slide for "Move Forward") are identical to the tactile textures found on the TACTO blocks. This creates a seamless transition from body-syntonic knowledge to tool-mediated knowledge.<sup>8</sup></li>
                        </ul>

                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">5.2 Musical Thinking as Computational Thinking</h3>
                        <p className="mb-6">
                            Music is inherently algorithmic; it consists of sequences, patterns (loops), and tempo changes (variables).
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-6 text-muted-foreground">
                            <li><strong>Motivation:</strong> Visually impaired students often exhibit heightened auditory engagement. Music provides immediate, aesthetically rewarding feedback that reinforces learning.<sup>39</sup></li>
                            <li><strong>Synesthetic Mapping:</strong> TACTO uses "Earcons" (auditory icons) to represent code structures.
                                <ul className="list-[circle] pl-6 mt-2 space-y-1">
                                    <li><em>Sequencing:</em> Placing note blocks creates a melody.</li>
                                    <li><em>Loops:</em> A "Repeat" block is associated with a rising "winding up" sound effect.</li>
                                    <li><em>Conditionals:</em> An "If" block might have a questioning, upward-inflected tone.</li>
                                    <li><em>Error Handling:</em> Syntax errors (like an open loop) generate a distinct, low-frequency "thud" or discordant sound, prompting immediate tactile debugging.<sup>40</sup></li>
                                </ul>
                            </li>
                        </ul>

                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">5.3 Collaborative Learning and Social Inclusion</h3>
                        <p className="mb-6">
                            A core tenet of TACTO is to foster mixed-ability collaboration.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-6 text-muted-foreground">
                            <li><strong>Shared Mental Model:</strong> In a mixed group, a sighted student can refer to blocks by their high-contrast colors ("Hand me the yellow block"), while a blind student refers to them by texture ("Hand me the bumpy block"). The TACTO hub bridges these distinct sensory inputs into a shared digital output.</li>
                            <li><strong>Joint Attention:</strong> When a block is placed, the Hub speaks its name ("Piano C"). This auditory confirmation ensures that all students in the group, regardless of visual ability, are synchronized on the state of the program.<sup>41</sup></li>
                        </ul>

                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">5.4 The Curriculum Arc</h3>
                        <ul className="list-disc pl-6 space-y-2 mb-6 text-muted-foreground">
                            <li><strong>Exploration:</strong> Students freely place blocks to explore sounds and textures. (Concept: Cause and Effect).</li>
                            <li><strong>Sequencing:</strong> Students build linear stories or songs. (Concept: Algorithms).</li>
                            <li><strong>Iteration:</strong> Students use "Loop" blocks to repeat rhythms. (Concept: Efficiency/Loops).</li>
                            <li><strong>Selection:</strong> Students use "If/Else" blocks to create interactive stories that branch based on sensor input (e.g., a light sensor token). (Concept: Conditionals).</li>
                            <li><strong>Abstraction:</strong> Students assign a sequence to a "Function Block" token, reusing that code later. (Concept: Functions/Subroutines).<sup>41</sup></li>
                        </ul>
                    </section>

                    <hr className="border-border/20 my-12" />

                    {/* 6. Feasibility */}
                    <section id="feasibility" className="mb-16">
                        <h2 className="text-3xl font-bold text-foreground mb-6">6. Feasibility and Cost Analysis</h2>
                        <p className="mb-6">
                            The central argument for TACTO is its economic viability compared to proprietary alternatives.
                        </p>

                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">6.1 Bill of Materials (BOM) Comparison</h3>
                        <p className="mb-6">
                            The following table contrasts the estimated production costs of a TACTO kit versus the retail cost of a Code Jumper kit.
                        </p>
                        <div className="overflow-x-auto rounded-xl border border-border/50 bg-secondary/5 my-8">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-secondary/20 text-foreground font-bold">
                                    <tr>
                                        <th className="p-4">Component</th>
                                        <th className="p-4">Code Jumper (Commercial)</th>
                                        <th className="p-4 bg-primary/10">TACTO (Open Source DIY)</th>
                                        <th className="p-4">Notes</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/20">
                                    <tr>
                                        <td className="p-4 font-medium">Command Pod/Block</td>
                                        <td className="p-4">~$50 - $70 USD (Est.)</td>
                                        <td className="p-4 bg-primary/5">~$0.70 USD</td>
                                        <td className="p-4 text-xs text-muted-foreground">CJ uses microcontroller + audio jack. TACTO uses 3D printed PLA ($0.50) + NFC Tag ($0.20).<sup>21</sup></td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium">Hub / Brain</td>
                                        <td className="p-4">~$200 USD (Est.)</td>
                                        <td className="p-4 bg-primary/5">~$30 USD</td>
                                        <td className="p-4 text-xs text-muted-foreground">TACTO uses ESP32 ($5) + Custom PCB ($5) + PN532 Reader ($5) + Mux ($5) + Components.<sup>33</sup></td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium">Connectivity</td>
                                        <td className="p-4">Proprietary Cables</td>
                                        <td className="p-4 bg-primary/5">Wireless / Physical Grid</td>
                                        <td className="p-4 text-xs text-muted-foreground">TACTO eliminates expensive, breakable cabling.</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium">Expansion</td>
                                        <td className="p-4">$100s for extra pods</td>
                                        <td className="p-4 bg-primary/5">Cents</td>
                                        <td className="p-4 text-xs text-muted-foreground">Teacher prints more blocks as needed.</td>
                                    </tr>
                                    <tr className="bg-primary/5 font-bold">
                                        <td className="p-4">Total Kit Cost</td>
                                        <td className="p-4">~$1,000+ USD</td>
                                        <td className="p-4 text-primary">~$40 - $60 USD</td>
                                        <td className="p-4 text-xs text-muted-foreground">TACTO represents a 95% cost reduction.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">6.2 Supply Chain and Sustainability</h3>
                        <p className="mb-6">
                            TACTO leverages the global supply chain of generic electronics.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-6 text-muted-foreground">
                            <li><strong>Availability:</strong> ESP32s and NFC tags are commodity items available worldwide. There is no reliance on a single specialized vendor.</li>
                            <li><strong>Repairability:</strong> If a TACTO hub breaks, it can be opened with a standard screwdriver. Components are through-hole or large SMT, allowing for local repair by electronics technicians. This contrasts with the glued, potted internals of many commercial AT devices.<sup>42</sup></li>
                            <li><strong>Scalability:</strong> The transition from a single DIY prototype to small-batch production is smoothed by the use of standard PCB fabrication services. An NGO could order 1,000 PCBs and distribute them to schools, where students assemble the kits as a vocational training exercise, further integrating STEM education.</li>
                        </ul>
                    </section>

                    <hr className="border-border/20 my-12" />

                    {/* 7. Limitations */}
                    <section id="limitations" className="mb-16">
                        <h2 className="text-3xl font-bold text-foreground mb-6">7. Limitations and Challenges</h2>

                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">7.1 Technical Challenges of Passive NFC</h3>
                        <ul className="list-disc pl-6 space-y-2 mb-6 text-muted-foreground">
                            <li><strong>Collision and Crosstalk:</strong> Using multiple antennas in close proximity can lead to "crosstalk," where an antenna reads a tag placed on an adjacent slot. TACTO mitigates this through careful PCB layout (ground planes between coils) and software filtering (checking RSSI signal strength to determine the strongest signal).<sup>30</sup></li>
                            <li><strong>Latency:</strong> Multiplexing 16 antennas introduces a slight delay. While &lt;100ms is acceptable for placing blocks, it may not support "real-time" manipulation (like rapidly turning a dial) as smoothly as active potentiometers. TACTO addresses this by using discrete tokens for values rather than continuous dials.</li>
                        </ul>

                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">7.2 The "Complexity Ceiling"</h3>
                        <p className="mb-6">
                            Tangible programming has inherent physical limitations. Writing a program with 100 lines of code would require 100 physical blocks and a massive table. TACTO is explicitly an introductory tool. It is designed to bridge the gap between "no code" and "text code." It is not a replacement for professional tools but a gateway to them.
                        </p>

                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">7.3 Deployment Hurdles</h3>
                        <p className="mb-6">
                            While "Open Source" reduces hardware costs, it shifts the burden to assembly and maintenance. A teacher with no technical background cannot "download" a TACTO kit; they need a partner to build it. Successful deployment will require partnerships with local makerspaces, universities, or NGOs to act as the manufacturing hubs.<sup>44</sup>
                        </p>
                    </section>

                    <hr className="border-border/20 my-12" />

                    {/* Conclusion */}
                    <section id="future-work" className="mb-16">
                        <h2 className="text-3xl font-bold text-foreground mb-6">8. Future Work</h2>

                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">8.1 The "Bridge" Software</h3>
                        <p className="mb-6">
                            To address the "Complexity Ceiling," future work involves developing a software bridge. When a student builds a physical sequence in TACTO, the Hub sends the data to a PC via Bluetooth. A companion app displays the equivalent Python or Quorum code on screen. The student can then use a screen reader to traverse the text code while tactually verifying it against the physical blocks. This scaffolds the transition from physical to digital environments.<sup>9</sup>
                        </p>

                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">8.2 AI-Assisted Accessibility</h3>
                        <p className="mb-6">
                            Integration with computer vision (using the ESP32-CAM) could provide a secondary layer of verification. If a block is placed but the NFC reader fails (e.g., due to distance), the camera could detect the high-contrast visual marker and prompt the user: "I see a loop block, but it's not clicked in all the way." This hybrid approach maximizes reliability.<sup>11</sup>
                        </p>

                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">8.3 The Global Repository</h3>
                        <p className="mb-6">
                            OSTSE aims to build an online repository, similar to Thingiverse, for TACTO blocks. Educators can upload new block designs (STL files) and code definitions. A teacher in Brazil could design a "Samba Rhythm" block, and a teacher in Kenya could download, print, and use it the next day. This fosters a decentralized, global curriculum development model.<sup>36</sup>
                        </p>
                    </section>

                    <hr className="border-border/20 my-12" />

                    {/* Conclusion */}
                    <section id="conclusion" className="mb-16">
                        <h2 className="text-3xl font-bold text-foreground mb-6">9. Conclusion</h2>
                        <p className="mb-6">
                            The exclusion of visually impaired students from computer science is a solvable design problem. It persists not because the technology is unavailable, but because the market incentives favor expensive, proprietary solutions that most schools cannot afford.
                        </p>
                        <p className="mb-6">
                            TACTO offers a corrective path. By embracing the principles of Open Science Hardware, Passive NFC architecture, and Embodied Cognition, TACTO dramatically lowers the cost of entry while simultaneously improving the pedagogical quality of the experience. It treats the visually impaired learner not as a passive recipient of "accessible" content, but as an active constructor of knowledge.
                        </p>
                        <p className="mb-6 text-lg font-medium text-foreground">
                            The transition from "Black Box" to "Open Grid" transforms the physical classroom. When code becomes tangible, cheap, and hackable, it ceases to be a barrier and becomes a bridge—a bridge that connects the VI learner to the digital world, and the sighted world to the immense potential of inclusive design. The technology exists; the pedagogy is sound. The task now is to build, share, and scale.
                        </p>
                    </section>


                    {/* References Footer */}

                    <div className="bg-secondary/5 p-8 rounded-2xl border border-border/40 text-sm text-muted-foreground mt-16">
                        <h4 className="font-bold text-foreground mb-6 uppercase tracking-wider">References & Research Foundations</h4>
                        <p className="mb-6 italic">
                            This white paper draws upon a multidisciplinary body of work spanning accessibility research, tangible programming languages, embodied cognition, open-source hardware, and low-cost embedded systems.
                        </p>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h5 className="font-semibold text-foreground mb-2">A. Programming Accessibility & Visual Impairment</h5>
                                <ul className="space-y-2 list-none text-xs">
                                    <li><a href="https://kclpure.kcl.ac.uk/portal/en/publications/making-programming-accessible-to-learners-with-visual-impairments/" className="hover:text-primary transition-colors underline decoration-border/50">Making Programming Accessible to Learners with Visual Impairments: A Literature Review.</a> KCL.</li>
                                    <li><a href="https://arxiv.org/pdf/2508.05056" className="hover:text-primary transition-colors underline decoration-border/50">Accessibility Beyond Accommodations: A Systematic Redesign.</a> arXiv.</li>
                                    <li><a href="https://www.researchgate.net/publication/268239455_Visual_programming_and_the_blind" className="hover:text-primary transition-colors underline decoration-border/50">Lewis, C., et al. Visual Programming and the Blind.</a></li>
                                    <li><a href="https://www.mdpi.com/2071-1050/12/13/5320" className="hover:text-primary transition-colors underline decoration-border/50">Teaching Programming to Students with Vision Impairment.</a> MDPI.</li>
                                    <li><a href="https://pandeymauli.github.io/research/documents/pandey_cscw_fullpaper_2021.pdf" className="hover:text-primary transition-colors underline decoration-border/50">Understanding Accessibility and Collaboration in Programming.</a></li>
                                    <li><a href="https://dl.acm.org/doi/10.1145/3507469" className="hover:text-primary transition-colors underline decoration-border/50">Addressing Accessibility Barriers in Programming (ACM).</a></li>
                                </ul>
                            </div>

                            <div>
                                <h5 className="font-semibold text-foreground mb-2">B. Tangible Programming & Prior Art</h5>
                                <ul className="space-y-2 list-none text-xs">
                                    <li><a href="https://discovery.ucl.ac.uk/10110233/1/TIPToyPaper_cameraready_V4.pdf" className="hover:text-primary transition-colors underline decoration-border/50">TIP-Toy: A Tactile, Open-Source Computational Toolkit.</a> UCL.</li>
                                    <li><a href="https://www.ski.org/project/t-scratch-tangible-programming-environment/" className="hover:text-primary transition-colors underline decoration-border/50">t-Scratch: Tangible Programming Environment.</a></li>
                                    <li><a href="https://conferences.ctbto.org/event/30/contributions/6178/attachments/2936/5977/P5.3-833_Ren.pdf" className="hover:text-primary transition-colors underline decoration-border/50">Tangible Programming for Visually Impaired Individuals.</a></li>
                                    <li><a href="https://www.researchgate.net/publication/396604994_Tangible_User_Interfaces_in_Computer_Programming_Learning_A_Systematic_Literature_Review" className="hover:text-primary transition-colors underline decoration-border/50">Tangible User Interfaces in Learning: A Systematic Review.</a></li>
                                    <li><a href="https://scholarscompass.vcu.edu/etd/7314/" className="hover:text-primary transition-colors underline decoration-border/50">Kim, H. W. Development of Tangible Code Blocks.</a></li>
                                    <li><a href="http://www.pekap.gr/images/ladias/Project_Bloks.pdf" className="hover:text-primary transition-colors underline decoration-border/50">Project Bloks: Designing a Development Platform.</a></li>
                                    <li><a href="https://repository.isls.org/bitstream/1/4388/1/1021-1024.pdf" className="hover:text-primary transition-colors underline decoration-border/50">Project Bloks: Embodied and Collaborative Learning.</a></li>
                                </ul>
                            </div>

                            <div>
                                <h5 className="font-semibold text-foreground mb-2">C. Embodied Cognition & Learning Theory</h5>
                                <ul className="space-y-2 list-none text-xs">
                                    <li><a href="https://www.frontiersin.org/articles/10.3389/feduc.2021.712626/full" className="hover:text-primary transition-colors underline decoration-border/50">Translating Embodied Cognition for Embodied Learning.</a> Frontiers.</li>
                                    <li><a href="https://iep.utm.edu/embodied-cognition/" className="hover:text-primary transition-colors underline decoration-border/50">Embodied Cognition.</a> Internet Encyclopedia of Philosophy.</li>
                                    <li><a href="https://www.mdpi.com/2079-3200/13/6/61" className="hover:text-primary transition-colors underline decoration-border/50">When the Past Is Backward and the Future Is Forward.</a> MDPI.</li>
                                    <li><a href="https://www.insticc.org/Primoris/Resources/PaperPdf.ashx?idPaper=fsqHDnTPqlY%3D" className="hover:text-primary transition-colors underline decoration-border/50">Need Finding for an Embodied Coding Platform.</a></li>
                                    <li><a href="https://www.tandfonline.com/doi/full/10.1080/08993408.2022.2140527" className="hover:text-primary transition-colors underline decoration-border/50">Conceptual Development in Early-Years Computing Education.</a></li>
                                </ul>
                            </div>

                            <div>
                                <h5 className="font-semibold text-foreground mb-2">D. Inclusive Design & Makerspaces</h5>
                                <ul className="space-y-2 list-none text-xs">
                                    <li><a href="https://www.nsf.gov/news/making-maker-movement-accessible" className="hover:text-primary transition-colors underline decoration-border/50">Making the Maker Movement Accessible.</a> NSF.</li>
                                    <li><a href="https://doit.uw.edu/brief/making-a-makerspace-guidelines-for-accessibility-and-universal-design" className="hover:text-primary transition-colors underline decoration-border/50">Making a Makerspace: Guidelines.</a> DO-IT.</li>
                                    <li><a href="https://radiona.org/accessibility-makerspaces-makeability/" className="hover:text-primary transition-colors underline decoration-border/50">Accessibility & Makerspaces = MakeAbility.</a></li>
                                    <li><a href="https://lifestyle.sustainability-directory.com/term/sustainable-assistive-technology/" className="hover:text-primary transition-colors underline decoration-border/50">Sustainable Assistive Technology.</a></li>
                                    <li><a href="https://rsisinternational.org/journals/ijriss/articles/overcoming-accessibility-barriers-for-visually-impaired-learners-in-open-and-distance-learning-odl-a-qualitative-study/" className="hover:text-primary transition-colors underline decoration-border/50">Overcoming Accessibility Barriers in ODL.</a></li>
                                </ul>
                            </div>

                            <div>
                                <h5 className="font-semibold text-foreground mb-2">E. Accessible Languages & Interfaces</h5>
                                <ul className="space-y-2 list-none text-xs">
                                    <li><a href="https://quorumlanguage.com/" className="hover:text-primary transition-colors underline decoration-border/50">Quorum: Evidence-Based Accessible Programming Language.</a></li>
                                    <li><a href="https://www.microsoft.com/en-us/research/wp-content/uploads/2018/04/CodeTalkCHI2018CameraReady.pdf" className="hover:text-primary transition-colors underline decoration-border/50">CodeTalk: Code Navigation with Auditory Feedback.</a></li>
                                    <li><a href="https://arxiv.org/abs/2511.03733" className="hover:text-primary transition-colors underline decoration-border/50">HACI: A Haptic-Audio Code Interface.</a> arXiv.</li>
                                </ul>
                            </div>

                            <div>
                                <h5 className="font-semibold text-foreground mb-2">F. Hardware & Technical Foundations</h5>
                                <ul className="space-y-2 list-none text-xs">
                                    <li><a href="https://openhardware.science/gosh-manifesto/" className="hover:text-primary transition-colors underline decoration-border/50">GOSH Manifesto.</a> Global Open Science Hardware.</li>
                                    <li><a href="https://e2e.ti.com/support/wireless-connectivity/other-wireless-group/other-wireless/f/other-wireless-technologies-forum/1514906/trf7970a-multiplexing-nfc-antennas-to-a-single-nfc-reader---circuit-setup" className="hover:text-primary transition-colors underline decoration-border/50">Multiplexing NFC Antennas to Single Reader.</a> (TI).</li>
                                    <li><a href="https://community.st.com/t5/st25-nfc-rfid-tags-and-readers/multiplexing-6-antennas-with-a-single-nfc-reader-e-g-st25r3916b/td-p/802627" className="hover:text-primary transition-colors underline decoration-border/50">Multiplexing NFC Antennas.</a> (ST Community).</li>
                                    <li><a href="https://www.allaboutcircuits.com/projects/read-and-write-on-nfc-tags-with-an-arduino/" className="hover:text-primary transition-colors underline decoration-border/50">Read and Write NFC Tags with Arduino.</a></li>
                                </ul>
                            </div>

                            <div>
                                <h5 className="font-semibold text-foreground mb-2">G. Component Availability & Cost</h5>
                                <ul className="space-y-2 list-none text-xs">
                                    <li><a href="https://www.atlasrfidstore.com/nfc-tags/" className="hover:text-primary transition-colors underline decoration-border/50">NFC Tag Listings (AtlasRFID).</a></li>
                                    <li><a href="https://www.pixelelectric.com/products/pn532-nfc-rfid-reader" className="hover:text-primary transition-colors underline decoration-border/50">PN532 Reader Modules.</a></li>
                                    <li><a href="https://cnibsmartlife.ca/products/code-jumper" className="hover:text-primary transition-colors underline decoration-border/50">Code Jumper Retail Pricing.</a></li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-border/30 text-xs text-muted-foreground/60">
                            <strong>Disclaimer:</strong> Code Jumper is a trademark of Microsoft. Project TACTO is an independent research initiative and is not affiliated with, endorsed by, or associated with Microsoft or any commercial assistive technology provider.
                        </div>
                    </div>

                </article>
            </div>
        </div >
    );
};

export default WhitepaperPage;
