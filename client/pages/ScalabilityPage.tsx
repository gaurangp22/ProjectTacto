import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowLeft, Download, Share2, TrendingUp, Cpu, Landmark, Target, PieChart, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Cell, Legend, LineChart, Line, PieChart as RechartsPieChart, Pie
} from "recharts";

/* ═══════════════════════════════════════════════
   BRAND COLOURS
   ═══════════════════════════════════════════════ */
const BRAND = {
    primary: "#5b5fc7",
    secondary: "#1a1a17",
    background: "#f2f0ec",
    text: {
        main: "#1a1a17",
        muted: "#6b6b63"
    },
    accent: {
        blue: "#3b82f6",
        green: "#10b981",
        amber: "#f59e0b",
        purple: "#8b5cf6"
    }
};

/* ═══════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════ */
const costData = [
    { component: "Raspberry Pi Zero 2 W", quantity: 1, cost: 2079 },
    { component: "PN532 NFC reader modules", quantity: 2, cost: 556 },
    { component: "NTAG213 NFC tags", quantity: 20, cost: 260 },
    { component: "MAX98357A audio amplifier", quantity: 1, cost: 126 },
    { component: "3 W speaker", quantity: 1, cost: 110 },
    { component: "2,000 mAh battery", quantity: 1, cost: 118 },
    { component: "Charging module", quantity: 1, cost: 17 },
    { component: "32 GB microSD card", quantity: 1, cost: 899 },
    { component: "Printed enclosure and blocks", quantity: "200 g", cost: 1200 },
    { component: "PCB, wiring and connectors", quantity: "Est.", cost: 350 },
    { component: "Packaging and printed guide", quantity: "Est.", cost: 250 },
];

const fundingAllocation = [
    { name: 'Initial kit production', value: 40, color: BRAND.primary },
    { name: 'Product engineering', value: 18, color: BRAND.accent.blue },
    { name: 'Curriculum & localisation', value: 12, color: BRAND.accent.purple },
    { name: 'Contingency & working capital', value: 12, color: BRAND.accent.amber },
    { name: 'Pilot delivery', value: 10, color: BRAND.accent.green },
    { name: 'Company setup & IP', value: 8, color: BRAND.text.muted },
];

const financialProjection = [
    { year: 'Year 1', revenue: 4.95, cost: 2.81, profit: -2.86 },
    { year: 'Year 2', revenue: 19.95, cost: 9.53, profit: -1.58 },
    { year: 'Year 3', revenue: 63.10, cost: 27.03, profit: 8.07 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-4 border border-slate-200 shadow-xl rounded-xl">
                <p className="font-semibold text-slate-800 mb-2">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-slate-600 capitalize">{entry.name}:</span>
                        <span className="font-medium text-slate-900">₹{entry.value} lakh</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════ */
const ScalabilityPage = () => {
    const [activeSection, setActiveSection] = useState("hardware-architecture");
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
        if (location.hash) {
            const id = location.hash.replace("#", "");
            const element = document.getElementById(id);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: "smooth" });
                    setActiveSection(id);
                }, 100);
            }
        }
    }, [location]);

    const handleShare = async () => {
        if (navigator.share) {
            try { await navigator.share({ title: "TACTO Scale & Sustainability", url: window.location.href }); } catch (e) { }
        }
        else { try { await navigator.clipboard.writeText(window.location.href); alert("Link copied!"); } catch { } }
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-20 print:pt-0 print:pb-0">
            {/* ═══ PDF COVER PAGE ═══ */}
            <div className="hidden print:block pdf-cover">
                <div className="pdf-cover-inner">
                    <img src="/tacto-logo.png" alt="TACTO" className="pdf-cover-logo" />
                    <div className="pdf-cover-badge">Strategic Overview</div>
                    <h1 className="pdf-cover-title">Scale &amp; Sustainability<br />Financial Model</h1>
                    <p className="pdf-cover-subtitle">Hardware sustainability, cost economics and growth trajectory</p>
                    <div className="pdf-cover-footer">Open-Source Tactile STEM Ecosystem</div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-7xl">
                {/* ═══ HEADER ═══ */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 print:hidden">
                    <div>
                        <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-4 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 font-outfit mb-3">
                            Scale & Sustainability
                        </h1>
                        <p className="text-lg text-slate-600 max-w-2xl">
                            Hardware sustainability, cost economics and the 3-year growth trajectory for the TACTO ecosystem.
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

                {/* ═══ MAIN LAYOUT ═══ */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* SIDEBAR NAVIGATION */}
                    <div className="hidden lg:block lg:col-span-3 print:hidden">
                        <div className="sticky top-28 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Contents</h3>
                            <nav className="space-y-1.5">
                                {[
                                    { id: "hardware-architecture", label: "Hardware Architecture", icon: Cpu },
                                    { id: "cost-economics", label: "Cost Economics", icon: Target },
                                    { id: "funding-allocation", label: "Funding & Allocation", icon: Landmark },
                                    { id: "financial-plan", label: "3-Year Financial Plan", icon: PieChart },
                                    { id: "growth-strategy", label: "Growth Strategy", icon: TrendingUp },
                                ].map((item) => (
                                    <a
                                        key={item.id}
                                        href={`#${item.id}`}
                                        onClick={() => setActiveSection(item.id)}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeSection === item.id
                                            ? "bg-indigo-50 text-indigo-700"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                            }`}
                                    >
                                        <item.icon className={`w-4 h-4 ${activeSection === item.id ? "text-indigo-600" : "text-slate-400"}`} />
                                        {item.label}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* CONTENT AREA */}
                    <div className="lg:col-span-9 space-y-16">

                        {/* 1. HARDWARE ARCHITECTURE */}
                        <section id="hardware-architecture" className="scroll-mt-28">
                            <h2 className="text-2xl font-bold text-slate-900 font-outfit mb-6 border-b border-slate-200 pb-4 flex items-center gap-3">
                                <Cpu className="w-6 h-6 text-indigo-600" />
                                Hardware Architecture & Scalability
                            </h2>
                            <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
                                <p>
                                    The basic idea behind TACTO is simple: <strong>keep the expensive electronics in one reader and keep the coding blocks passive.</strong>
                                </p>
                                <p>
                                    Each block contains a tactile symbol, Braille labelling and an NFC tag. It does not need its own processor, battery or internet connection. This means that when we add a new command or lesson, we do not need to redesign the entire kit. We only need a new block, an NFC mapping and the corresponding audio and curriculum content.
                                </p>
                                <p>
                                    This also makes the product easier to maintain. If one block is lost or damaged, the school replaces that block rather than the complete kit. Since there are no batteries inside the blocks, teachers do not need to charge or pair individual pieces before a lesson.
                                </p>
                                
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 my-8">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4">Technical Reliability</h3>
                                    <p className="text-sm">
                                        NXP states that NTAG213 tags are NFC Forum Type 2 and ISO/IEC 14443 Type A compliant. They are rated for approximately 100,000 write cycles and ten years of data retention. TACTO mainly reads the tags rather than repeatedly rewriting them, so tag memory should not be a significant maintenance issue. We will still verify this through repeated-use and classroom durability tests.
                                    </p>
                                </div>

                                <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-4">Localisation</h3>
                                <p>
                                    The same hardware can also be used across different languages. Localisation mainly involves changing the audio instructions, tactile or Braille labels, lesson plans and teacher material.
                                </p>
                                <p>
                                    For example, if one language pack contains 100 audio instructions, each lasting five seconds and encoded at 64 kbps, the estimated storage requirement would be:
                                </p>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center font-mono text-sm my-4">
                                    100 × 5 × 64 ÷ 8 = 4,000 KB
                                </div>
                                <p>
                                    That is approximately 4 MB per language. Even ten such language packs would require only about 40 MB. The actual translation and recording work will still require time and accessibility review, but it will not require a different reader.
                                </p>
                                <p>
                                    The curriculum is also being organised around concepts that remain consistent across education systems: commands, sequences, events, loops, selection and debugging. These can be mapped to the CSTA Computer Science Standards, India's computational-thinking objectives and the computing curriculum followed in England.
                                </p>
                            </div>
                        </section>

                        <div className="pdf-page-break"></div>

                        {/* 2. COST ECONOMICS */}
                        <section id="cost-economics" className="scroll-mt-28">
                            <h2 className="text-2xl font-bold text-slate-900 font-outfit mb-6 border-b border-slate-200 pb-4 flex items-center gap-3">
                                <Target className="w-6 h-6 text-indigo-600" />
                                Cost Economics
                            </h2>
                            <div className="prose prose-slate max-w-none text-slate-600">
                                <p className="mb-6">
                                    We do not yet have a production quotation for every component. For that reason, this model uses current Indian retail prices and clearly marked allowances. It is intended to establish whether the product is financially feasible, not to present an unconfirmed cost as final.
                                </p>
                                <p className="mb-8 font-medium">
                                    The calculation is for a classroom kit containing one reader and 20 tactile coding blocks.
                                </p>

                                <div className="overflow-x-auto mb-10">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-200 bg-slate-50">
                                                <th className="py-3 px-4 font-semibold text-slate-900">Component</th>
                                                <th className="py-3 px-4 font-semibold text-slate-900 text-right">Quantity</th>
                                                <th className="py-3 px-4 font-semibold text-slate-900 text-right">Est. Cost (INR)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {costData.map((item, i) => (
                                                <tr key={i} className="hover:bg-slate-50/50">
                                                    <td className="py-3 px-4">{item.component}</td>
                                                    <td className="py-3 px-4 text-right text-slate-500">{item.quantity}</td>
                                                    <td className="py-3 px-4 text-right font-medium text-slate-900">₹{item.cost}</td>
                                                </tr>
                                            ))}
                                            <tr className="bg-indigo-50/50 font-semibold text-indigo-900">
                                                <td className="py-3 px-4">Raw component cost</td>
                                                <td className="py-3 px-4"></td>
                                                <td className="py-3 px-4 text-right">₹5,965</td>
                                            </tr>
                                            <tr>
                                                <td className="py-3 px-4 text-slate-500">Assembly and quality checks</td>
                                                <td className="py-3 px-4 text-right text-slate-500">10%</td>
                                                <td className="py-3 px-4 text-right text-slate-500">₹597</td>
                                            </tr>
                                            <tr>
                                                <td className="py-3 px-4 text-slate-500">Scrap and replacement provision</td>
                                                <td className="py-3 px-4 text-right text-slate-500">5%</td>
                                                <td className="py-3 px-4 text-right text-slate-500">₹298</td>
                                            </tr>
                                            <tr>
                                                <td className="py-3 px-4 text-slate-500">Freight and handling</td>
                                                <td className="py-3 px-4 text-right text-slate-500">5%</td>
                                                <td className="py-3 px-4 text-right text-slate-500">₹298</td>
                                            </tr>
                                            <tr className="bg-slate-900 text-white font-bold">
                                                <td className="py-4 px-4 rounded-l-lg">Estimated pilot-stage landed cost</td>
                                                <td className="py-4 px-4"></td>
                                                <td className="py-4 px-4 text-right rounded-r-lg">₹7,158</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <h3 className="text-xl font-semibold text-slate-900 mb-4">Proposed starting price</h3>
                                <p>
                                    At an estimated landed cost of ₹7,158, a selling price of ₹11,999 would provide a hardware gross margin of approximately 40.3%. This margin is necessary because the cost of supporting a hardware product is not limited to its components. It must also cover replacements, price fluctuations, quality failures, field support and channel discounts.
                                </p>

                                <div className="overflow-x-auto my-8">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-200 bg-slate-50">
                                                <th className="py-3 px-4 font-semibold text-slate-900">Selling price</th>
                                                <th className="py-3 px-4 font-semibold text-slate-900 text-center">Margin at ₹7,158 cost</th>
                                                <th className="py-3 px-4 font-semibold text-slate-900 text-center">Margin at ₹6,250 cost</th>
                                                <th className="py-3 px-4 font-semibold text-slate-900 text-center">Margin at ₹5,000 cost</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            <tr className="hover:bg-slate-50/50">
                                                <td className="py-3 px-4 font-medium">₹9,999</td>
                                                <td className="py-3 px-4 text-center">28.4%</td>
                                                <td className="py-3 px-4 text-center">37.5%</td>
                                                <td className="py-3 px-4 text-center">50.0%</td>
                                            </tr>
                                            <tr className="hover:bg-slate-50/50">
                                                <td className="py-3 px-4 font-medium">₹10,999</td>
                                                <td className="py-3 px-4 text-center">34.9%</td>
                                                <td className="py-3 px-4 text-center">43.2%</td>
                                                <td className="py-3 px-4 text-center">54.5%</td>
                                            </tr>
                                            <tr className="bg-indigo-50 border-l-4 border-indigo-600">
                                                <td className="py-3 px-4 font-bold text-indigo-900">₹11,999 (Target)</td>
                                                <td className="py-3 px-4 text-center font-bold text-indigo-700">40.3%</td>
                                                <td className="py-3 px-4 text-center text-indigo-700">47.9%</td>
                                                <td className="py-3 px-4 text-center text-indigo-700">58.3%</td>
                                            </tr>
                                            <tr className="hover:bg-slate-50/50">
                                                <td className="py-3 px-4 font-medium">₹12,999</td>
                                                <td className="py-3 px-4 text-center">44.9%</td>
                                                <td className="py-3 px-4 text-center">51.9%</td>
                                                <td className="py-3 px-4 text-center">61.5%</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p className="text-sm text-slate-500 italic">
                                    We expect the cost per kit to decrease as we move away from one-off retail purchases. Our working target is ₹5,750 in Year 2 and ₹5,000 in Year 3.
                                </p>
                            </div>
                        </section>

                        <div className="pdf-page-break"></div>

                        {/* 3. FUNDING & ALLOCATION */}
                        <section id="funding-allocation" className="scroll-mt-28">
                            <h2 className="text-2xl font-bold text-slate-900 font-outfit mb-6 border-b border-slate-200 pb-4 flex items-center gap-3">
                                <Landmark className="w-6 h-6 text-indigo-600" />
                                Funding & Allocation
                            </h2>
                            <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
                                <p>
                                    TACTO currently has three forms of financial support. The conversion uses the 4 August 2026 exchange rate of approximately ₹95.38 per US dollar. We have separated the AWS support from the available cash because cloud credits cannot be used to manufacture kits, pay suppliers or cover travel.
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                        <h3 className="text-sm font-bold text-slate-900 mb-4">Deployable Capital</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-600">University investment</span>
                                                <span className="font-semibold text-slate-900">₹5,00,000</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-600">EdUHK cash award ($1,500)</span>
                                                <span className="font-semibold text-slate-900">₹1,43,066</span>
                                            </div>
                                            <div className="pt-3 border-t border-slate-100 flex justify-between font-bold text-indigo-600">
                                                <span>Total Deployable</span>
                                                <span>₹6,43,066</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                        <h3 className="text-sm font-bold text-slate-900 mb-4">Non-Cash Support</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-600">AWS support package ($7,000)</span>
                                                <span className="font-semibold text-slate-900">₹6,67,643</span>
                                            </div>
                                            <div className="pt-3 border-t border-slate-100 flex justify-between font-bold text-emerald-600">
                                                <span>Combined Total Value</span>
                                                <span>₹13,10,709</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-slate-50 p-6 rounded-3xl border border-slate-100 mt-8">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-4">Proposed Use of Capital</h3>
                                        <p className="text-sm mb-6">Allocation of the ₹6.43 lakh deployable funding.</p>
                                        <ul className="space-y-3">
                                            {fundingAllocation.map((item, i) => (
                                                <li key={i} className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                                        <span className="text-slate-700">{item.name}</span>
                                                    </div>
                                                    <span className="font-semibold text-slate-900">{item.value}%</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="h-64 w-full print:h-48">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RechartsPieChart>
                                                <Pie
                                                    data={fundingAllocation}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                    stroke="none"
                                                >
                                                    {fundingAllocation.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </RechartsPieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <p className="text-sm mt-4">
                                    At the estimated pilot cost of ₹7,158 per kit, the production allocation (40%) would support approximately <strong>35 kits</strong>. If each kit is shared by 4 learners and used for 3 cohorts in a year, these kits could provide <strong>420 learner places annually</strong>.
                                </p>
                            </div>
                        </section>

                        <div className="pdf-page-break"></div>

                        {/* 4. FINANCIAL PLAN */}
                        <section id="financial-plan" className="scroll-mt-28">
                            <h2 className="text-2xl font-bold text-slate-900 font-outfit mb-6 border-b border-slate-200 pb-4 flex items-center gap-3">
                                <PieChart className="w-6 h-6 text-indigo-600" />
                                Three-Year Financial Plan
                            </h2>
                            <div className="prose prose-slate max-w-none text-slate-600">
                                <p className="mb-6">
                                    The model assumes two sources of revenue: Sale of TACTO classroom kits and paid teacher onboarding, implementation and institutional support. The years refer to commercial years after the pilot launch. The model does not include GST, depreciation, interest or income tax.
                                </p>

                                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm mb-10">
                                    <h3 className="text-lg font-bold text-slate-900 mb-6">Projected Income Statement (₹ Lakh)</h3>
                                    <div className="h-72 w-full mb-8">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={financialProjection} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />
                                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                                <Line type="monotone" dataKey="revenue" name="Total Revenue" stroke={BRAND.primary} strokeWidth={3} dot={{ r: 6, fill: BRAND.primary, strokeWidth: 2, stroke: 'white' }} activeDot={{ r: 8 }} />
                                                <Line type="monotone" dataKey="cost" name="Direct Cost" stroke={BRAND.accent.amber} strokeWidth={3} dot={{ r: 6, fill: BRAND.accent.amber, strokeWidth: 2, stroke: 'white' }} />
                                                <Line type="monotone" dataKey="profit" name="Operating Profit" stroke={BRAND.accent.green} strokeWidth={3} dot={{ r: 6, fill: BRAND.accent.green, strokeWidth: 2, stroke: 'white' }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <h3 className="text-xl font-semibold text-slate-900 mb-4">Cash and Working Capital</h3>
                                <p>
                                    Profitability does not automatically mean that the company has enough cash. Institutional customers may take time to pay, while components usually need to be purchased before kits are delivered. The model shows that TACTO would require approximately ₹5 lakh in additional funding before Year 2.
                                </p>

                                <div className="overflow-x-auto my-8">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-200 bg-slate-50">
                                                <th className="py-3 px-4 font-semibold text-slate-900">Cash movement (₹ lakh)</th>
                                                <th className="py-3 px-4 font-semibold text-slate-900 text-right">Year 1</th>
                                                <th className="py-3 px-4 font-semibold text-slate-900 text-right">Year 2</th>
                                                <th className="py-3 px-4 font-semibold text-slate-900 text-right">Year 3</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            <tr className="hover:bg-slate-50/50">
                                                <td className="py-3 px-4 font-medium text-slate-700">Opening cash</td>
                                                <td className="py-3 px-4 text-right">6.43</td>
                                                <td className="py-3 px-4 text-right">1.96</td>
                                                <td className="py-3 px-4 text-right">2.03</td>
                                            </tr>
                                            <tr className="hover:bg-slate-50/50">
                                                <td className="py-3 px-4">Additional funding</td>
                                                <td className="py-3 px-4 text-right text-slate-500">0.00</td>
                                                <td className="py-3 px-4 text-right font-semibold text-emerald-600">5.00</td>
                                                <td className="py-3 px-4 text-right text-slate-500">0.00</td>
                                            </tr>
                                            <tr className="hover:bg-slate-50/50">
                                                <td className="py-3 px-4">Operating profit or loss</td>
                                                <td className="py-3 px-4 text-right text-rose-500">-2.86</td>
                                                <td className="py-3 px-4 text-right text-rose-500">-1.58</td>
                                                <td className="py-3 px-4 text-right text-emerald-600">8.07</td>
                                            </tr>
                                            <tr className="hover:bg-slate-50/50">
                                                <td className="py-3 px-4">Add. working capital req.</td>
                                                <td className="py-3 px-4 text-right text-slate-500">-0.82</td>
                                                <td className="py-3 px-4 text-right text-slate-500">-2.35</td>
                                                <td className="py-3 px-4 text-right text-slate-500">-6.67</td>
                                            </tr>
                                            <tr className="hover:bg-slate-50/50">
                                                <td className="py-3 px-4">Capital expenditure</td>
                                                <td className="py-3 px-4 text-right text-slate-500">-0.80</td>
                                                <td className="py-3 px-4 text-right text-slate-500">-1.00</td>
                                                <td className="py-3 px-4 text-right text-slate-500">-2.00</td>
                                            </tr>
                                            <tr className="bg-slate-900 text-white font-bold">
                                                <td className="py-3 px-4 rounded-l-lg">Closing cash</td>
                                                <td className="py-3 px-4 text-right">1.96</td>
                                                <td className="py-3 px-4 text-right">2.03</td>
                                                <td className="py-3 px-4 text-right rounded-r-lg">1.43</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>

                        <div className="pdf-page-break"></div>

                        {/* 5. GROWTH STRATEGY */}
                        <section id="growth-strategy" className="scroll-mt-28">
                            <h2 className="text-2xl font-bold text-slate-900 font-outfit mb-6 border-b border-slate-200 pb-4 flex items-center gap-3">
                                <TrendingUp className="w-6 h-6 text-indigo-600" />
                                Growth Strategy
                            </h2>
                            <div className="space-y-8">
                                <div className="relative pl-8 border-l-2 border-indigo-100 pb-4">
                                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-indigo-600 ring-4 ring-white" />
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">First six months</h3>
                                    <p className="text-slate-600 text-sm">
                                        Our immediate priority is not large-scale production. It is proving that the reference design works reliably. We will finalise the BOM, obtain supplier quotations and test scan accuracy, audio-response time, repeated block placement, drop resistance and classroom safety.
                                    </p>
                                </div>
                                <div className="relative pl-8 border-l-2 border-indigo-100 pb-4">
                                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-indigo-400 ring-4 ring-white" />
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">Months 6–12</h3>
                                    <p className="text-slate-600 text-sm">
                                        Subject to the technical results, we will produce a controlled batch of up to 35 kits. These will be used for structured pilots with schools or organisations working with visually impaired learners. Each pilot will record attendance, NFC reads, setup time, block damage, and teacher observations.
                                    </p>
                                </div>
                                <div className="relative pl-8 border-l-2 border-indigo-100 pb-4">
                                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-indigo-300 ring-4 ring-white" />
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">Months 12–24</h3>
                                    <p className="text-slate-600 text-sm">
                                        The next stage will focus on turning the pilot process into something that another institution can adopt without constant founder involvement. Targets include production of 50–150 units, a repeatable onboarding process, batch-manufacturing quotations, and initial paid institutional orders.
                                    </p>
                                </div>
                                <div className="relative pl-8 border-transparent">
                                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-300 ring-4 ring-white" />
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">Three to five years</h3>
                                    <p className="text-slate-600 text-sm">
                                        Once the product, curriculum and implementation model are stable, TACTO can expand through contract manufacturing, regional distributors and institutional partners. An open SDK can eventually allow educators to create additional blocks, activities and content.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScalabilityPage;
