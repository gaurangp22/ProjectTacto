import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowLeft, Download, Share2, CheckCircle2, XCircle, Users, TrendingUp, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Cell, Legend,
} from "recharts";

/* ═══════════════════════════════════════════════
   BRAND COLOURS
   ═══════════════════════════════════════════════ */
const BRAND = {
    primary: "#1a1a17",
    accent: "#5b5fc7",
    warm: "#d97757",
    teal: "#2b5e54",
    purple: "#4a3566",
    muted: "#6b6b63",
    bg: "#fafaf8",
    border: "#e4e2dd",
};

/* ═══════════════════════════════════════════════
   ILLUSTRATIVE EXAMPLE DATA — 3 students only
   ═══════════════════════════════════════════════ */
const exampleTaskData = [
    { task: "T1", name: "Grid Orient", u01: 1, u02: 1, u03: 1 },
    { task: "T2", name: "Block ID", u01: 1, u02: 1, u03: 0 },
    { task: "T3", name: "Sequence", u01: 1, u02: 0, u03: 1 },
    { task: "T4", name: "Predict", u01: 0, u02: 1, u03: 1 },
    { task: "T5", name: "Execute", u01: 1, u02: 1, u03: 1 },
    { task: "T6", name: "Debug", u01: 1, u02: 0, u03: 0 },
    { task: "T7", name: "Loop", u01: 0, u02: 1, u03: 0 },
    { task: "T8", name: "AI Hint", u01: 1, u02: 1, u03: 1 },
    { task: "T9", name: "Unaided", u01: 1, u02: 0, u03: 1 },
];

// Derive completion rates per task for the bar chart
const exampleCompletionChart = exampleTaskData.map((t) => ({
    task: t.task,
    rate: Math.round(((t.u01 + t.u02 + t.u03) / 3) * 100),
}));

const examplePrePost = [
    { id: "U01", pre: 3, post: 7 },
    { id: "U02", pre: 4, post: 6 },
    { id: "U03", pre: 2, post: 5 },
];

/* ═══════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════ */
const EvaluationMetricsPage = () => {
    const [activeSection, setActiveSection] = useState("evaluation-design");
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const el = document.getElementById(location.hash.replace("#", ""));
            if (el) el.scrollIntoView({ behavior: "smooth" });
        } else {
            window.scrollTo(0, 0);
        }

        const observer = new IntersectionObserver(
            (entries) => entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); }),
            { rootMargin: "-20% 0px -35% 0px" }
        );
        const sections = document.querySelectorAll("section[id]");
        sections.forEach((s) => observer.observe(s));
        return () => sections.forEach((s) => observer.unobserve(s));
    }, []);

    const tocSections = [
        { id: "evaluation-design", label: "Evaluation Design" },
        { id: "evaluation-tasks", label: "1. Evaluation Tasks" },
        { id: "assistance-scale", label: "2. Assistance Scale" },
        { id: "usability-metrics", label: "3. Usability Metrics" },
        { id: "ai-metrics", label: "4. AI Assistant Metrics" },
        { id: "technical-metrics", label: "5. Technical Metrics" },
        { id: "learning-measures", label: "6. Learning Measures" },
        { id: "error-classification", label: "7. Error Classification" },
        { id: "severity-scale", label: "8. Issue Severity" },
        { id: "acceptance-criteria", label: "9. Acceptance Criteria" },
        { id: "data-record", label: "10. Data Record" },
        { id: "required-graphs", label: "11. Required Graphs" },
        { id: "evidence-preservation", label: "12. Evidence Preservation" },
        { id: "illustrative-example", label: "Illustrative Example" },
    ];

    const handleShare = async () => {
        const data = { title: "TACTO Evaluation Framework", text: "TACTO formative usability evaluation system.", url: window.location.href };
        if (navigator.share) { try { await navigator.share(data); } catch { } }
        else { try { await navigator.clipboard.writeText(window.location.href); alert("Link copied!"); } catch { } }
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-20 print:pt-0 print:pb-0">

            {/* ═══ PDF COVER PAGE ═══ */}
            <div className="hidden print:block pdf-cover">
                <div className="pdf-cover-inner">
                    <img src="/tacto-logo.png" alt="TACTO" className="pdf-cover-logo" />
                    <div className="pdf-cover-badge">Evaluation Framework</div>
                    <h1 className="pdf-cover-title">TACTO Formative Usability Evaluation System</h1>
                    <p className="pdf-cover-subtitle">Metrics, Methodology & Illustrative Example</p>
                    <div className="pdf-cover-footer">Open-Source Tactile STEM Ecosystem</div>
                </div>
            </div>

            {/* ═══ HERO HEADER ═══ */}
            <div className="bg-secondary/5 border-b border-border/40 py-16 mb-12 print:hidden">
                <div className="container max-w-5xl mx-auto px-6">
                    <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Project
                    </Link>
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                        <div className="max-w-3xl">
                            <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest rounded-full mb-6">
                                Evaluation Framework
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6 leading-tight">
                                TACTO Formative Usability Evaluation System
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                The metrics, methodology and acceptance criteria that will govern every TACTO evaluation round
                            </p>
                        </div>
                        <div className="flex gap-3">
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

            {/* ═══ BODY ═══ */}
            <div className="container max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 print:block print:px-12 print:py-12">

                {/* TOC sidebar */}
                <aside className="lg:col-span-3 hidden lg:block print:hidden">
                    <div className="sticky top-32 space-y-2 text-sm border-l-2 border-border/50 pl-4">
                        <p className="font-bold text-foreground mb-4 uppercase tracking-wider text-xs">Contents</p>
                        {tocSections.map((s) => (
                            <a key={s.id} href={`#${s.id}`}
                                className={`block transition-all duration-200 ${activeSection === s.id ? "text-primary font-bold translate-x-1" : "text-muted-foreground hover:text-foreground hover:translate-x-0.5"}`}>
                                {s.label}
                            </a>
                        ))}
                    </div>
                </aside>

                {/* Main article */}
                <article className="lg:col-span-12 xl:col-span-8 prose prose-lg prose-invert max-w-none text-muted-foreground/90 print:col-span-12 print:w-full print:max-w-none print:text-black print:prose-neutral">

                    {/* ──────────────────────────────────────
                        EVALUATION DESIGN
                    ────────────────────────────────────── */}
                    <section id="evaluation-design" className="mb-16">
                        <h2 className="text-3xl font-bold text-foreground mb-6">Evaluation Design</h2>
                        <p className="mb-6">
                            TACTO will be evaluated through repeated formative rounds, with approximately 5–8 participants per round. Each session will last 45–55 minutes and will be conducted individually to avoid peer influence.
                        </p>
                        <p className="mb-6">
                            Each participant will receive an anonymous identifier such as U01. Names, institutions and identifiable medical information will not appear in the results dataset.
                        </p>

                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">Session Sequence</h3>
                        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white my-8 not-prose">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-900 font-bold border-b border-slate-200">
                                    <tr>
                                        <th className="p-4">Phase</th>
                                        <th className="p-4 text-right">Duration</th>
                                        <th className="p-4">Evidence Collected</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <tr><td className="p-4 font-medium">Consent and orientation</td><td className="p-4 text-right">5 min</td><td className="p-4">Consent status and accessibility requirements</td></tr>
                                    <tr><td className="p-4 font-medium">Baseline assessment</td><td className="p-4 text-right">5 min</td><td className="p-4">Coding knowledge and confidence</td></tr>
                                    <tr><td className="p-4 font-medium">Familiarisation</td><td className="p-4 text-right">5 min</td><td className="p-4">Initial block and grid interaction</td></tr>
                                    <tr><td className="p-4 font-medium">Task evaluation</td><td className="p-4 text-right">25–30 min</td><td className="p-4">Accuracy, time, errors and assistance</td></tr>
                                    <tr><td className="p-4 font-medium">Post-session assessment</td><td className="p-4 text-right">10 min</td><td className="p-4">Concept score, usability and feedback</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <hr className="border-border/20 my-12" />

                    {/* ──────────────────────────────────────
                        1. EVALUATION TASKS
                    ────────────────────────────────────── */}
                    <section id="evaluation-tasks" className="mb-16">
                        <h2 className="text-3xl font-bold text-foreground mb-6">1. Standardised Evaluation Tasks</h2>
                        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white my-8 not-prose">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-900 font-bold border-b border-slate-200">
                                    <tr>
                                        <th className="p-4">ID</th>
                                        <th className="p-4">Task</th>
                                        <th className="p-4">Success Criterion</th>
                                        <th className="p-4 text-right">Time Limit</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <tr><td className="p-4 font-mono font-bold">T1</td><td className="p-4">Orient the TACTO grid correctly</td><td className="p-4">Identifies start position and direction independently</td><td className="p-4 text-right">120 sec</td></tr>
                                    <tr><td className="p-4 font-mono font-bold">T2</td><td className="p-4">Identify eight tactile command blocks</td><td className="p-4">At least seven blocks identified correctly</td><td className="p-4 text-right">240 sec</td></tr>
                                    <tr><td className="p-4 font-mono font-bold">T3</td><td className="p-4">Construct a four-command sequence</td><td className="p-4">Valid sequence assembled in the required order</td><td className="p-4 text-right">300 sec</td></tr>
                                    <tr><td className="p-4 font-mono font-bold">T4</td><td className="p-4">Predict the sequence output</td><td className="p-4">Outcome explained correctly before execution</td><td className="p-4 text-right">120 sec</td></tr>
                                    <tr><td className="p-4 font-mono font-bold">T5</td><td className="p-4">Execute and interpret the program</td><td className="p-4">Audio output interpreted correctly</td><td className="p-4 text-right">180 sec</td></tr>
                                    <tr><td className="p-4 font-mono font-bold">T6</td><td className="p-4">Debug an intentionally incorrect sequence</td><td className="p-4">Error located and corrected</td><td className="p-4 text-right">300 sec</td></tr>
                                    <tr><td className="p-4 font-mono font-bold">T7</td><td className="p-4">Construct a program containing a loop</td><td className="p-4">Loop placed and configured correctly</td><td className="p-4 text-right">360 sec</td></tr>
                                    <tr><td className="p-4 font-mono font-bold">T8</td><td className="p-4">Request and apply AI guidance</td><td className="p-4">Relevant hint understood and applied</td><td className="p-4 text-right">240 sec</td></tr>
                                    <tr><td className="p-4 font-mono font-bold">T9</td><td className="p-4">Repeat a core task without assistance</td><td className="p-4">Task completed with assistance score 0</td><td className="p-4 text-right">300 sec</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="text-sm text-muted-foreground italic">Time limits must be fixed before data collection and applied consistently.</p>
                    </section>

                    <hr className="border-border/20 my-12" />

                    {/* ──────────────────────────────────────
                        2. ASSISTANCE SCALE
                    ────────────────────────────────────── */}
                    <section id="assistance-scale" className="mb-16">
                        <h2 className="text-3xl font-bold text-foreground mb-6">2. Assistance Scale</h2>
                        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white my-8 not-prose">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-900 font-bold border-b border-slate-200">
                                    <tr>
                                        <th className="p-4 text-right">Score</th>
                                        <th className="p-4">Assistance Level</th>
                                        <th className="p-4">Definition</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <tr><td className="p-4 text-right font-mono font-bold">0</td><td className="p-4 font-medium">Independent</td><td className="p-4">No facilitator intervention</td></tr>
                                    <tr><td className="p-4 text-right font-mono font-bold">1</td><td className="p-4 font-medium">General prompt</td><td className="p-4">Non-specific encouragement or task repetition</td></tr>
                                    <tr><td className="p-4 text-right font-mono font-bold">2</td><td className="p-4 font-medium">Directed prompt</td><td className="p-4">Attention directed towards a command or grid region</td></tr>
                                    <tr><td className="p-4 text-right font-mono font-bold">3</td><td className="p-4 font-medium">Step-by-step assistance</td><td className="p-4">Explicit instruction or physical guidance</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="mb-6">A task requiring level 3 assistance is recorded as facilitated completion, not independent completion.</p>
                    </section>

                    <hr className="border-border/20 my-12" />

                    {/* ──────────────────────────────────────
                        3. PRIMARY USABILITY METRICS
                    ────────────────────────────────────── */}
                    <section id="usability-metrics" className="mb-16">
                        <h2 className="text-3xl font-bold text-foreground mb-6">3. Primary Usability Metrics</h2>

                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">3.1 Task Completion Rate (TCR)</h3>
                        <div className="bg-secondary/10 rounded-xl p-6 my-4 not-prose border border-border/30 font-mono text-sm text-foreground">
                            TCR = (tasks completed within the time limit ÷ tasks attempted) × 100
                        </div>
                        <p className="mb-6">Report separately for every task and for the complete session.</p>

                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">3.2 First-Attempt Success Rate (FASR)</h3>
                        <div className="bg-secondary/10 rounded-xl p-6 my-4 not-prose border border-border/30 font-mono text-sm text-foreground">
                            FASR = (tasks completed correctly on first attempt ÷ tasks attempted) × 100
                        </div>
                        <p className="mb-6">This distinguishes intuitive interaction from eventual success after experimentation.</p>

                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">3.3 Independent Completion Rate (ICR)</h3>
                        <div className="bg-secondary/10 rounded-xl p-6 my-4 not-prose border border-border/30 font-mono text-sm text-foreground">
                            ICR = (tasks completed with assistance score 0 ÷ tasks attempted) × 100
                        </div>

                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">3.4 Prompt-Adjusted Independence (PAI)</h3>
                        <div className="bg-secondary/10 rounded-xl p-6 my-4 not-prose border border-border/30 font-mono text-sm text-foreground">
                            PAI = 100 × (1 − (ΣAᵢ ÷ 3N))
                        </div>
                        <p className="mb-6">Where Aᵢ is the assistance score for each task and N is the number of tasks attempted. Higher scores indicate greater independence. This is a project-specific exploratory measure and must not be described as an externally validated scale.</p>

                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">3.5 Tactile Identification Accuracy (TIA)</h3>
                        <div className="bg-secondary/10 rounded-xl p-6 my-4 not-prose border border-border/30 font-mono text-sm text-foreground">
                            TIA = (blocks identified correctly ÷ identification trials) × 100
                        </div>
                        <p className="mb-6">Record first-touch accuracy separately from accuracy after repeated exploration.</p>

                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">3.6 Debugging Success Rate (DSR)</h3>
                        <div className="bg-secondary/10 rounded-xl p-6 my-4 not-prose border border-border/30 font-mono text-sm text-foreground">
                            DSR = (introduced errors corrected ÷ debugging tasks attempted) × 100
                        </div>
                        <p className="mb-6">Also record time to identify the error, total correction time and assistance required.</p>

                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">3.7 Audio Comprehension Rate (ACR)</h3>
                        <div className="bg-secondary/10 rounded-xl p-6 my-4 not-prose border border-border/30 font-mono text-sm text-foreground">
                            ACR = (audio messages correctly interpreted ÷ audio messages tested) × 100
                        </div>
                        <p className="mb-6">A message is understood only when the participant can paraphrase it or perform the intended action.</p>

                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">3.8 Time on Task</h3>
                        <p className="mb-6">Record task-start and task-completion timestamps. Report median time and interquartile range rather than only the mean, because small usability samples are sensitive to outliers.</p>

                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">3.9 Error Rate</h3>
                        <div className="bg-secondary/10 rounded-xl p-6 my-4 not-prose border border-border/30 font-mono text-sm text-foreground">
                            ER = observable interaction errors ÷ tasks attempted
                        </div>
                        <p className="mb-6">Repeated occurrences of the same unresolved error must be recorded separately.</p>
                    </section>

                    <hr className="border-border/20 my-12" />

                    {/* ──────────────────────────────────────
                        4. AI VOICE ASSISTANT METRICS
                    ────────────────────────────────────── */}
                    <section id="ai-metrics" className="mb-16">
                        <h2 className="text-3xl font-bold text-foreground mb-6">4. AI Voice Assistant Metrics</h2>
                        <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white my-8 not-prose">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-900 font-bold border-b border-slate-200">
                                    <tr>
                                        <th className="p-3 w-1/3">Metric</th>
                                        <th className="p-3">Definition</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <tr><td className="p-3 font-medium">Intent-recognition accuracy</td><td className="p-3">Percentage of participant requests interpreted correctly</td></tr>
                                    <tr><td className="p-3 font-medium">Guidance relevance</td><td className="p-3">Percentage of hints relevant to the current program and task</td></tr>
                                    <tr><td className="p-3 font-medium">Grounding accuracy</td><td className="p-3">Percentage of responses consistent with the assembled program</td></tr>
                                    <tr><td className="p-3 font-medium">Hint resolution rate</td><td className="p-3">Percentage of blocked tasks completed after AI guidance without human assistance</td></tr>
                                    <tr><td className="p-3 font-medium">Escalation rate</td><td className="p-3">Percentage of AI interactions still requiring facilitator intervention</td></tr>
                                    <tr><td className="p-3 font-medium">Repetition rate</td><td className="p-3">Percentage of responses participants requested to hear again</td></tr>
                                    <tr><td className="p-3 font-medium">Response latency</td><td className="p-3">Time between completion of the spoken request and beginning of the response</td></tr>
                                    <tr><td className="p-3 font-medium">Over-assistance rate</td><td className="p-3">Percentage of hints that reveal the complete solution rather than scaffolding reasoning</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="mb-6">AI responses should be independently reviewed using a 0–3 scale: <strong>0</strong> = incorrect or unrelated; <strong>1</strong> = partially relevant but incomplete; <strong>2</strong> = correct and relevant; <strong>3</strong> = correct, relevant and instructionally appropriate.</p>
                        <p className="mb-6">A sample of responses should be scored by two reviewers. Agreement should be reported as percentage agreement or Cohen's kappa where sample size permits.</p>
                    </section>

                    <hr className="border-border/20 my-12" />

                    {/* ──────────────────────────────────────
                        5. TECHNICAL PERFORMANCE
                    ────────────────────────────────────── */}
                    <section id="technical-metrics" className="mb-16">
                        <h2 className="text-3xl font-bold text-foreground mb-6">5. Technical Performance Metrics</h2>
                        <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white my-8 not-prose">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-900 font-bold border-b border-slate-200">
                                    <tr>
                                        <th className="p-3 w-1/3">Metric</th>
                                        <th className="p-3">Calculation</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <tr><td className="p-3 font-medium">NFC recognition accuracy</td><td className="p-3">Correct block reads ÷ total placements</td></tr>
                                    <tr><td className="p-3 font-medium">Position-detection accuracy</td><td className="p-3">Correctly identified grid positions ÷ total placements</td></tr>
                                    <tr><td className="p-4 font-medium">False-read rate</td><td className="p-4">Incorrect or duplicate reads ÷ total placements</td></tr>
                                    <tr><td className="p-4 font-medium">Recognition latency</td><td className="p-4">Time from placement to block confirmation</td></tr>
                                    <tr><td className="p-4 font-medium">Execution reliability</td><td className="p-4">Successful executions ÷ valid programs submitted</td></tr>
                                    <tr><td className="p-4 font-medium">Audio-delivery reliability</td><td className="p-4">Correct audio outputs ÷ audio events triggered</td></tr>
                                    <tr><td className="p-4 font-medium">Session stability</td><td className="p-4">Sessions completed without crash or forced restart</td></tr>
                                    <tr><td className="p-4 font-medium">Recovery time</td><td className="p-4">Time required to restore operation after a system error</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="mb-6">Report median and 95th-percentile latency. All system events should be timestamped automatically where possible.</p>
                    </section>

                    <hr className="border-border/20 my-12" />

                    {/* ──────────────────────────────────────
                        6. LEARNING & CONFIDENCE MEASURES
                    ────────────────────────────────────── */}
                    <section id="learning-measures" className="mb-16">
                        <h2 className="text-3xl font-bold text-foreground mb-6">6. Learning and Confidence Measures</h2>

                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">6.1 Concept Assessment</h3>
                        <p className="mb-6">Administer the same or equivalent 10-point concept assessment immediately before and after the session. Topics should include:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-6 text-muted-foreground">
                            <li>command order</li>
                            <li>sequence prediction</li>
                            <li>repetition</li>
                            <li>conditionals</li>
                            <li>debugging</li>
                            <li>decomposition</li>
                        </ul>
                        <div className="bg-secondary/10 rounded-xl p-6 my-4 not-prose border border-border/30 font-mono text-sm text-foreground">
                            Score change = post-session score − pre-session score
                        </div>
                        <p className="mb-6">Report individual score changes and the group median. Do not claim knowledge retention unless a delayed follow-up assessment is conducted.</p>

                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">6.2 Confidence Rating</h3>
                        <p className="mb-6">Participants rate the following statements from 1 to 5:</p>
                        <ol className="list-decimal pl-6 space-y-2 mb-6 text-muted-foreground">
                            <li>I can explain what a program sequence does.</li>
                            <li>I can build a simple program.</li>
                            <li>I can identify and correct a programming error.</li>
                            <li>I can use TACTO without continuous assistance.</li>
                            <li>I would feel comfortable using TACTO again.</li>
                        </ol>
                        <p className="mb-6">Administer the ratings before and after participation.</p>

                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">6.3 Task Ease</h3>
                        <p className="mb-6">After every task, administer a verbally delivered Single Ease Question:</p>
                        <blockquote className="border-l-4 border-primary/30 pl-6 py-2 my-6 text-foreground italic">
                            "Overall, how difficult or easy was this task?"
                        </blockquote>
                        <p className="mb-6">Use a seven-point scale where 1 means very difficult and 7 means very easy.</p>
                    </section>

                    <hr className="border-border/20 my-12" />

                    {/* ──────────────────────────────────────
                        7. ERROR CLASSIFICATION
                    ────────────────────────────────────── */}
                    <section id="error-classification" className="mb-16">
                        <h2 className="text-3xl font-bold text-foreground mb-6">7. Error Classification</h2>
                        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white my-8 not-prose">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-900 font-bold border-b border-slate-200">
                                    <tr>
                                        <th className="p-4">Code</th>
                                        <th className="p-4">Error Category</th>
                                        <th className="p-4">Example</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <tr><td className="p-4 font-mono font-bold">E1</td><td className="p-4">Tactile identification</td><td className="p-4">Incorrect command block selected</td></tr>
                                    <tr><td className="p-4 font-mono font-bold">E2</td><td className="p-4">Grid orientation</td><td className="p-4">Program started from the wrong position</td></tr>
                                    <tr><td className="p-4 font-mono font-bold">E3</td><td className="p-4">Sequence construction</td><td className="p-4">Commands arranged in the wrong order</td></tr>
                                    <tr><td className="p-4 font-mono font-bold">E4</td><td className="p-4">Syntax or structure</td><td className="p-4">Required start, end or parameter block omitted</td></tr>
                                    <tr><td className="p-4 font-mono font-bold">E5</td><td className="p-4">Loop construction</td><td className="p-4">Loop boundary or repetition value incorrect</td></tr>
                                    <tr><td className="p-4 font-mono font-bold">E6</td><td className="p-4">Audio comprehension</td><td className="p-4">Feedback misunderstood</td></tr>
                                    <tr><td className="p-4 font-mono font-bold">E7</td><td className="p-4">AI interaction</td><td className="p-4">Spoken request or response misunderstood</td></tr>
                                    <tr><td className="p-4 font-mono font-bold">E8</td><td className="p-4">Debugging</td><td className="p-4">Error detected but not corrected</td></tr>
                                    <tr><td className="p-4 font-mono font-bold">E9</td><td className="p-4">System recognition</td><td className="p-4">Block not detected or detected incorrectly</td></tr>
                                    <tr><td className="p-4 font-mono font-bold">E10</td><td className="p-4">Execution</td><td className="p-4">Valid sequence fails to execute</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="mb-6">Each error must record task ID, timestamp, severity, resolution and whether it resulted from the learner, interface or system.</p>
                    </section>

                    <hr className="border-border/20 my-12" />

                    {/* ──────────────────────────────────────
                        8. ISSUE SEVERITY SCALE
                    ────────────────────────────────────── */}
                    <section id="severity-scale" className="mb-16">
                        <h2 className="text-3xl font-bold text-foreground mb-6">8. Issue-Severity Scale</h2>
                        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white my-8 not-prose">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-900 font-bold border-b border-slate-200">
                                    <tr>
                                        <th className="p-4 text-right">Severity</th>
                                        <th className="p-4">Definition</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <tr><td className="p-4 text-right font-mono font-bold">0</td><td className="p-4">No usability impact</td></tr>
                                    <tr><td className="p-4 text-right font-mono font-bold">1</td><td className="p-4">Minor friction; task completed independently</td></tr>
                                    <tr><td className="p-4 text-right font-mono font-bold">2</td><td className="p-4">Noticeable difficulty or repeated attempt</td></tr>
                                    <tr><td className="p-4 text-right font-mono font-bold">3</td><td className="p-4">Task failure or facilitator assistance required</td></tr>
                                    <tr><td className="p-4 text-right font-mono font-bold">4</td><td className="p-4">Critical accessibility, privacy or system failure</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="mb-6">Severity-3 and Severity-4 issues require a documented design response before the next evaluation round.</p>
                    </section>

                    <hr className="border-border/20 my-12" />

                    {/* ──────────────────────────────────────
                        9. ACCEPTANCE CRITERIA
                    ────────────────────────────────────── */}
                    <section id="acceptance-criteria" className="mb-16">
                        <h2 className="text-3xl font-bold text-foreground mb-6">9. Predefined Acceptance Criteria</h2>
                        <p className="mb-6">These are evaluation targets, not results, and must be fixed before analysis. Failure to meet a target should generate a design action, not be removed from the report.</p>
                        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white my-8 not-prose">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-900 font-bold border-b border-slate-200">
                                    <tr>
                                        <th className="p-4">Metric</th>
                                        <th className="p-4 text-right">Preliminary Target</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {[
                                        ["Tactile identification accuracy", "≥90%"],
                                        ["Overall task completion", "≥80%"],
                                        ["Independent completion", "≥70%"],
                                        ["Audio comprehension", "≥85%"],
                                        ["Debugging success", "≥70%"],
                                        ["AI grounding accuracy", "≥90%"],
                                        ["NFC recognition accuracy", "≥98%"],
                                        ["Median block-confirmation latency", "≤1.5 seconds"],
                                        ["95th-percentile block-confirmation latency", "≤2.5 seconds"],
                                        ["Median AI response latency", "≤5 seconds"],
                                        ["Median task-ease score", "≥5/7"],
                                        ["Post-session usability score", "≥70/100"],
                                        ["Severity-4 issues", "0"],
                                    ].map(([metric, target]) => (
                                        <tr key={metric}>
                                            <td className="p-4 font-medium">{metric}</td>
                                            <td className="p-4 text-right font-mono font-bold">{target}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <hr className="border-border/20 my-12" />

                    {/* ──────────────────────────────────────
                        10. PARTICIPANT-LEVEL DATA RECORD
                    ────────────────────────────────────── */}
                    <section id="data-record" className="mb-16">
                        <h2 className="text-3xl font-bold text-foreground mb-6">10. Participant-Level Data Record</h2>
                        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white my-8 not-prose">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-900 font-bold border-b border-slate-200">
                                    <tr>
                                        <th className="p-4">Field</th>
                                        <th className="p-4">Entry</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {[
                                        "Session ID", "Participant ID", "Age band", "Vision-access category",
                                        "Braille familiarity", "Previous coding experience", "Task attempted",
                                        "First-attempt success (Yes/No)", "Final completion (Yes/No)",
                                        "Completion time (seconds)", "Incorrect attempts", "Assistance score (0–3)",
                                        "Error codes", "Task-ease score (1–7)", "AI guidance used (Yes/No)", "Observer note"
                                    ].map((f) => (
                                        <tr key={f}>
                                            <td className="p-4 font-medium">{f}</td>
                                            <td className="p-4 text-muted-foreground italic">—</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <hr className="border-border/20 my-12" />

                    {/* ──────────────────────────────────────
                        11. REQUIRED GRAPHS
                    ────────────────────────────────────── */}
                    <section id="required-graphs" className="mb-16">
                        <h2 className="text-3xl font-bold text-foreground mb-6">11. Required Graphs</h2>
                        <p className="mb-6">The following visualisations must be produced for every evaluation round. Percentages must always display the underlying denominator.</p>
                        <ol className="list-decimal pl-6 space-y-3 mb-6 text-muted-foreground">
                            <li><strong className="text-foreground">Task-completion rate:</strong> bar chart of completion percentage for T1–T9.</li>
                            <li><strong className="text-foreground">Independent completion:</strong> bar chart of assistance-score-0 completion by task.</li>
                            <li><strong className="text-foreground">Completion time:</strong> median time with interquartile-range error bars.</li>
                            <li><strong className="text-foreground">Prompt requirement:</strong> median assistance prompts by task.</li>
                            <li><strong className="text-foreground">Pre/post concept performance:</strong> paired participant-level dot plot.</li>
                            <li><strong className="text-foreground">Pre/post confidence:</strong> paired participant-level dot plot.</li>
                            <li><strong className="text-foreground">Error distribution:</strong> horizontal bar chart of E1–E10 frequency.</li>
                            <li><strong className="text-foreground">Issue severity:</strong> count of issues at Severity 1–4.</li>
                            <li><strong className="text-foreground">System latency:</strong> distribution of block-recognition and AI-response times.</li>
                            <li><strong className="text-foreground">Design iteration:</strong> task completion and independence compared across successive evaluation rounds.</li>
                        </ol>
                    </section>

                    <hr className="border-border/20 my-12" />

                    {/* ──────────────────────────────────────
                        12. EVIDENCE PRESERVATION
                    ────────────────────────────────────── */}
                    <section id="evidence-preservation" className="mb-16">
                        <h2 className="text-3xl font-bold text-foreground mb-6">12. Evidence Preservation</h2>
                        <p className="mb-6">Every reported result must remain traceable to:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-6 text-muted-foreground">
                            <li>an anonymised participant record;</li>
                            <li>a dated session sheet;</li>
                            <li>automated Raspberry Pi event logs where available;</li>
                            <li>the prototype version tested;</li>
                            <li>the task script used;</li>
                            <li>consent status;</li>
                            <li>observer notes;</li>
                            <li>photographs or recordings where consent permits; and</li>
                            <li>a design-change log connecting findings to subsequent modifications.</li>
                        </ul>
                        <p className="mb-6">Raw data should be stored separately from identifying information. Participant names must never appear in analysis files or public evidence reports.</p>
                    </section>

                    <hr className="border-border/20 my-12" />

                    {/* ════════════════════════════════════════════════════════
                        ILLUSTRATIVE EXAMPLE — 3 STUDENTS
                    ════════════════════════════════════════════════════════ */}
                    <section id="illustrative-example" className="mb-16">
                        <h2 className="text-3xl font-bold text-foreground mb-6">Illustrative Example — Demo Testing (n = 3)</h2>
                        <p className="mb-6">
                            The following figures are drawn from a brief demo testing session with three participants (U01, U02, U03; ages 9–11, mixed vision profiles). They demonstrate how the evaluation framework above would be applied in practice. These are <strong className="text-foreground">not validated findings</strong> — they illustrate the type of evidence TACTO is designed to generate.
                        </p>

                        {/* Stat cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 not-prose mb-8">
                            <div className="rounded-2xl border border-border/50 bg-card/50 p-6 flex flex-col gap-3 print:border print:border-gray-200 print:bg-white">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${BRAND.accent}15` }}>
                                    <Users size={20} style={{ color: BRAND.accent }} />
                                </div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Participants</p>
                                <p className="text-3xl font-bold tracking-tight text-foreground">3</p>
                                <p className="text-xs text-muted-foreground">Ages 9–11, mixed vision profiles</p>
                            </div>
                            <div className="rounded-2xl border border-border/50 bg-card/50 p-6 flex flex-col gap-3 print:border print:border-gray-200 print:bg-white">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${BRAND.teal}15` }}>
                                    <TrendingUp size={20} style={{ color: BRAND.teal }} />
                                </div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Concept Gain</p>
                                <p className="text-3xl font-bold tracking-tight text-foreground">+3.0</p>
                                <p className="text-xs text-muted-foreground">Median pre→post improvement (out of 10)</p>
                            </div>
                            <div className="rounded-2xl border border-border/50 bg-card/50 p-6 flex flex-col gap-3 print:border print:border-gray-200 print:bg-white">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${BRAND.warm}15` }}>
                                    <Brain size={20} style={{ color: BRAND.warm }} />
                                </div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Task Completion</p>
                                <p className="text-3xl font-bold tracking-tight text-foreground">78%</p>
                                <p className="text-xs text-muted-foreground">Overall across 9 tasks × 3 participants</p>
                            </div>
                        </div>

                        {/* Task completion chart */}
                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">Task Completion Rate by Task</h3>
                        <div className="not-prose rounded-2xl border border-border/40 bg-card/50 p-6 mb-8 print:border print:border-gray-200">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={exampleCompletionChart} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={BRAND.border} />
                                    <XAxis dataKey="task" tick={{ fill: BRAND.muted, fontSize: 12 }} />
                                    <YAxis domain={[0, 100]} tick={{ fill: BRAND.muted, fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
                                    <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ borderRadius: 12, border: `1px solid ${BRAND.border}`, background: BRAND.bg, fontSize: 13 }} />
                                    <Bar dataKey="rate" name="Completion %" radius={[6, 6, 0, 0]}>
                                        {exampleCompletionChart.map((_, i) => (
                                            <Cell key={i} fill={[BRAND.accent, BRAND.warm, BRAND.teal, BRAND.purple, BRAND.primary][i % 5]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Pre/post concept chart */}
                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">Pre/Post Concept Scores</h3>
                        <div className="not-prose rounded-2xl border border-border/40 bg-card/50 p-6 mb-8 print:border print:border-gray-200">
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={examplePrePost} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={BRAND.border} />
                                    <XAxis dataKey="id" tick={{ fill: BRAND.muted, fontSize: 12 }} />
                                    <YAxis domain={[0, 10]} tick={{ fill: BRAND.muted, fontSize: 12 }} />
                                    <Tooltip contentStyle={{ borderRadius: 12, border: `1px solid ${BRAND.border}`, background: BRAND.bg, fontSize: 13 }} />
                                    <Legend wrapperStyle={{ fontSize: 12 }} />
                                    <Bar dataKey="pre" name="Pre-session" fill={BRAND.border} radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="post" name="Post-session" fill={BRAND.accent} radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Raw data table */}
                        <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">Individual Task Results</h3>
                        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white my-8 not-prose">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-900 font-bold border-b border-slate-200">
                                    <tr>
                                        <th className="p-3">Task</th>
                                        <th className="p-3 text-center">U01</th>
                                        <th className="p-3 text-center">U02</th>
                                        <th className="p-3 text-center">U03</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {exampleTaskData.map((t) => (
                                        <tr key={t.task}>
                                            <td className="p-3 font-mono font-bold">{t.task} <span className="font-normal text-muted-foreground ml-1">{t.name}</span></td>
                                            <td className="p-3 text-center">{t.u01 ? <CheckCircle2 className="inline w-4 h-4 text-green-600" /> : <XCircle className="inline w-4 h-4 text-red-400" />}</td>
                                            <td className="p-3 text-center">{t.u02 ? <CheckCircle2 className="inline w-4 h-4 text-green-600" /> : <XCircle className="inline w-4 h-4 text-red-400" />}</td>
                                            <td className="p-3 text-center">{t.u03 ? <CheckCircle2 className="inline w-4 h-4 text-green-600" /> : <XCircle className="inline w-4 h-4 text-red-400" />}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <p className="text-sm text-muted-foreground italic mt-6">
                            The figures above are illustrative only. They demonstrate how the evaluation framework would surface patterns — for example, debugging (T6) and loop construction (T7) showing lower completion rates, indicating areas for design iteration. Formal evaluation will follow established usability research protocols with appropriate ethical oversight and larger participant groups.
                        </p>
                    </section>

                    {/* ═══ DISCLAIMER ═══ */}
                    <div className="bg-secondary/5 p-8 rounded-2xl border border-border/40 text-sm text-muted-foreground mt-16 print:bg-transparent print:border-none print:p-0 print:mt-8 pdf-disclaimer">
                        <strong className="text-foreground">Note:</strong> This document describes the evaluation methodology that will govern TACTO usability testing. The illustrative example (n = 3) demonstrates how data would be collected and reported; it does not constitute a validated study. Formal evaluation rounds will use 5–8 participants per round with appropriate ethical oversight.
                    </div>

                </article>
            </div>
        </div>
    );
};

export default EvaluationMetricsPage;
