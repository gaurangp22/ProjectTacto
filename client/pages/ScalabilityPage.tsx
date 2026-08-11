import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    ArrowLeft,
    BarChart3,
    CheckCircle2,
    Cpu,
    Download,
    FileCheck2,
    Landmark,
    Layers3,
    Share2,
    Target,
    TrendingUp,
} from "lucide-react";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";

const BRAND = {
    primary: "#5b5fc7",
    blue: "#3b82f6",
    green: "#059669",
};

const costData = [
    { component: "Raspberry Pi Zero 2 W", quantity: "1", cost: 22 },
    { component: "PN532 NFC reader modules", quantity: "2", cost: 6 },
    { component: "NTAG213 NFC tags", quantity: "20", cost: 3 },
    { component: "Audio amplifier and speaker", quantity: "1 set", cost: 2 },
    { component: "Battery and charging module", quantity: "1 set", cost: 2 },
    { component: "32 GB microSD card", quantity: "1", cost: 9 },
    { component: "Printed enclosure and blocks", quantity: "1 set", cost: 13 },
    { component: "PCB, wiring and connectors", quantity: "Allowance", cost: 4 },
    { component: "Packaging and printed guide", quantity: "Allowance", cost: 3 },
];

const pricingData = [
    { stage: "Pilot batch", landedCost: 76, averagePrice: 139, grossMargin: "45%", basis: "Retail parts and manual assembly" },
    { stage: "Year 2 batch", landedCost: 60, averagePrice: 135, grossMargin: "56%", basis: "Supplier pricing and repeatable assembly" },
    { stage: "Year 3 batch", landedCost: 52, averagePrice: 129, grossMargin: "60%", basis: "Contract manufacturing and volume buying" },
];

const revenueModel = [
    { year: "Year 1", kits: 250, kitRevenue: 34.8, implementation: 36, sponsored: 40, recurring: 0, totalRevenue: 110.8 },
    { year: "Year 2", kits: 900, kitRevenue: 121.5, implementation: 112.5, sponsored: 96, recurring: 24, totalRevenue: 354 },
    { year: "Year 3", kits: 3000, kitRevenue: 387, implementation: 300, sponsored: 225, recurring: 200, totalRevenue: 1112 },
    { year: "Year 4", kits: 7500, kitRevenue: 937.5, implementation: 650, sponsored: 500, recurring: 516, totalRevenue: 2603.5 },
    { year: "Year 5", kits: 16000, kitRevenue: 1904, implementation: 1400, sponsored: 1000, recurring: 1175, totalRevenue: 5479 },
];

const financialProjection = [
    { year: "Year 1", revenue: 110.8, grossProfit: 69, operatingResult: -71 },
    { year: "Year 2", revenue: 354, grossProfit: 230, operatingResult: -80 },
    { year: "Year 3", revenue: 1112, grossProfit: 739, operatingResult: 89 },
    { year: "Year 4", revenue: 2603.5, grossProfit: 1744, operatingResult: 444 },
    { year: "Year 5", revenue: 5479, grossProfit: 3703, operatingResult: 1103 },
];

const fundingPlan = [
    { use: "Product engineering, tooling and safety validation", amount: 75000, share: "37.5%" },
    { use: "Inventory and working capital", amount: 50000, share: "25.0%" },
    { use: "Structured pilots and implementation", amount: 35000, share: "17.5%" },
    { use: "Curriculum, accessibility review and localisation", amount: 25000, share: "12.5%" },
    { use: "Company setup, IP and contingency", amount: 15000, share: "7.5%" },
];

const milestones = [
    {
        period: "0 to 6 months",
        title: "Lock the reference design",
        detail: "Confirm the bill of materials, obtain supplier quotations, complete durability and safety checks, and freeze the Basic and Explorer kit specifications.",
        gate: "No production increase until scan reliability, audio response, setup time and replacement rates meet the pilot thresholds.",
    },
    {
        period: "6 to 12 months",
        title: "Run a controlled production batch",
        detail: "Produce up to 35 kits for structured deployments, document teacher onboarding, and collect comparable learner and product data at each site.",
        gate: "Proceed when schools can run sessions using the guide and training package without continuous founder support.",
    },
    {
        period: "12 to 24 months",
        title: "Convert pilots into paid institutional use",
        detail: "Move to 250 to 900 annual kit sales, introduce paid implementation packages, establish repair and replacement procedures, and secure a manufacturing partner.",
        gate: "Add inventory only against purchase orders, sponsored deployment contracts, or a defined distributor forecast.",
    },
    {
        period: "Years 3 to 5",
        title: "Build regional delivery capacity",
        detail: "Use contract manufacturing, educator certification, regional distributors and local content partners to serve India first, followed by selected Asian and UK markets.",
        gate: "Enter each new market only after local curriculum mapping, accessibility review, after-sales ownership and channel economics are confirmed.",
    },
];

const formatMoney = (value: number) => `$${value.toLocaleString("en-US")}`;
const formatThousands = (value: number) => value >= 1000 ? `$${(value / 1000).toFixed(1)}m` : `$${value.toFixed(value % 1 ? 1 : 0)}k`;

const FinancialTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
            <p className="mb-2 font-semibold text-slate-900">{label}</p>
            {payload.map((entry: any) => (
                <div key={entry.dataKey} className="flex items-center justify-between gap-6 text-sm">
                    <span style={{ color: entry.color }}>{entry.name}</span>
                    <span className="font-medium text-slate-900">{formatThousands(entry.value)}</span>
                </div>
            ))}
        </div>
    );
};

const ScalabilityPage = () => {
    const [activeSection, setActiveSection] = useState("evidence-base");
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!location.hash) return;

        const id = location.hash.replace("#", "");
        const element = document.getElementById(id);
        if (!element) return;

        setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth" });
            setActiveSection(id);
        }, 100);
    }, [location.hash]);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title: "TACTO Scalability and Sustainability Evidence", url: window.location.href });
            } catch {
                return;
            }
            return;
        }

        try {
            await navigator.clipboard.writeText(window.location.href);
            alert("Link copied");
        } catch {
            alert("Please copy the page address from your browser");
        }
    };

    const navigation = [
        { id: "evidence-base", label: "Evidence Base", icon: FileCheck2 },
        { id: "scalable-design", label: "Scalable Design", icon: Cpu },
        { id: "unit-economics", label: "Unit Economics", icon: Target },
        { id: "commercial-model", label: "Commercial Model", icon: BarChart3 },
        { id: "funding", label: "Funding Plan", icon: Landmark },
        { id: "growth", label: "Growth Gates", icon: TrendingUp },
    ];

    return (
        <div className="min-h-screen bg-background pb-20 pt-24 print:pb-0 print:pt-0">
            <div className="pdf-cover hidden print:block">
                <div className="pdf-cover-inner">
                    <img src="/tacto-logo.png" alt="TACTO" className="pdf-cover-logo" />
                    <div className="pdf-cover-badge">QS Reimagine Education 2026 | Supporting Evidence</div>
                    <h1 className="pdf-cover-title">Scalability and<br />Financial Sustainability</h1>
                    <p className="pdf-cover-subtitle">A milestone-led plan for production, institutional adoption and responsible growth</p>
                    <div className="pdf-cover-footer">Project TACTO | Planning model dated 11 August 2026</div>
                </div>
            </div>

            <div className="container mx-auto max-w-7xl px-4">
                <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center print:hidden">
                    <div>
                        <Link to="/" className="mb-4 inline-flex items-center text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                        </Link>
                        <h1 className="mb-3 font-outfit text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                            Scalability and Financial Sustainability
                        </h1>
                        <p className="max-w-3xl text-lg text-slate-600">
                            Evidence of a modular product architecture, staged production plan, diversified income model and milestone-based funding strategy.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="gap-2" onClick={() => window.print()}>
                            <Download className="h-4 w-4" /> PDF
                        </Button>
                        <Button variant="outline" size="icon" onClick={handleShare} aria-label="Share this evidence page">
                            <Share2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                    <aside className="hidden lg:col-span-3 lg:block print:hidden">
                        <div className="sticky top-28 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">Contents</h2>
                            <nav className="space-y-1.5">
                                {navigation.map((item) => (
                                    <a
                                        key={item.id}
                                        href={`#${item.id}`}
                                        onClick={() => setActiveSection(item.id)}
                                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${activeSection === item.id ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        {item.label}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    <main className="space-y-16 lg:col-span-9">
                        <section id="evidence-base" className="scroll-mt-28">
                            <div className="mb-6 flex items-center gap-3 border-b border-slate-200 pb-4">
                                <FileCheck2 className="h-6 w-6 text-indigo-600" />
                                <h2 className="font-outfit text-2xl font-bold text-slate-900">1. Basis of this evidence</h2>
                            </div>
                            <p className="mb-6 text-slate-600">
                                This paper is a planning document, not a set of audited accounts. It distinguishes money already secured from funding still to be raised, and it labels forecasts as management assumptions. Revenue has not been presented as historical income.
                            </p>

                            <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
                                <div className="pdf-avoid-break rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Cash secured</p>
                                    <p className="text-3xl font-bold text-slate-900">$6,740</p>
                                    <p className="mt-2 text-sm text-slate-600">$5,240 university support plus a $1,500 EdUHK Edventures cash award.</p>
                                </div>
                                <div className="pdf-avoid-break rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Non-cash support</p>
                                    <p className="text-3xl font-bold text-slate-900">$5,500</p>
                                    <p className="mt-2 text-sm text-slate-600">AWS credits awarded through EdUHK Edventures. These are not treated as cash.</p>
                                </div>
                                <div className="pdf-avoid-break rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Reported field reach</p>
                                    <p className="text-3xl font-bold text-slate-900">33+ schools</p>
                                    <p className="mt-2 text-sm text-slate-600">Prototype and pilot activity reported across six Indian states.</p>
                                </div>
                            </div>

                            <div className="pdf-avoid-break rounded-2xl border border-amber-200 bg-amber-50 p-6">
                                <h3 className="mb-2 font-semibold text-amber-950">How to read the numbers</h3>
                                <p className="text-sm leading-6 text-amber-900">
                                    Component costs are current planning estimates and must be replaced by supplier quotations before a production commitment. Sales, contracts and operating results are a base case forecast. Award letters, university records, pilot logs, quotations and purchase orders should be retained as the underlying evidence file.
                                </p>
                            </div>
                        </section>

                        <section id="scalable-design" className="scroll-mt-28">
                            <div className="mb-6 flex items-center gap-3 border-b border-slate-200 pb-4">
                                <Cpu className="h-6 w-6 text-indigo-600" />
                                <h2 className="font-outfit text-2xl font-bold text-slate-900">2. Why the product can scale</h2>
                            </div>
                            <p className="mb-6 text-slate-600">
                                TACTO keeps the expensive electronics in one reader and keeps each coding block passive. A block contains a tactile form, a Braille label and an NFC tag. It has no battery, processor or radio. New commands and lessons can therefore be added through a new block shell, NFC mapping, audio file and curriculum activity without redesigning the complete kit.
                            </p>

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                {[
                                    ["Modular hardware", "A lost or damaged block can be replaced individually. The reader remains in service, which reduces maintenance cost and downtime."],
                                    ["One platform, several levels", "The same kit can progress from sequencing to loops, conditions, variables and functions through software and curriculum updates."],
                                    ["Low-cost localisation", "Language changes affect audio, labels and lesson material. They do not require a new electronic reader design."],
                                    ["Distributed delivery", "Standard parts, documented assembly and replaceable components allow production to move from university prototyping to contract manufacturing or approved regional assembly."],
                                ].map(([title, detail]) => (
                                    <div key={title} className="pdf-avoid-break rounded-2xl border border-slate-200 bg-white p-6">
                                        <Layers3 className="mb-4 h-5 w-5 text-indigo-600" />
                                        <h3 className="mb-2 font-semibold text-slate-900">{title}</h3>
                                        <p className="text-sm leading-6 text-slate-600">{detail}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section id="unit-economics" className="scroll-mt-28">
                            <div className="mb-6 flex items-center gap-3 border-b border-slate-200 pb-4">
                                <Target className="h-6 w-6 text-indigo-600" />
                                <h2 className="font-outfit text-2xl font-bold text-slate-900">3. Unit economics</h2>
                            </div>
                            <p className="mb-4 text-slate-600">
                                The reference classroom kit contains one reader and 20 tactile coding blocks. The pilot estimate uses current retail component prices plus explicit allowances for assembly, quality checks, scrap, replacements and freight.
                            </p>
                            <p className="mb-8 text-sm font-medium text-slate-500">All figures are in US dollars and rounded for planning.</p>

                            <div className="mb-10 overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200 bg-slate-50">
                                            <th className="px-4 py-3 font-semibold text-slate-900">Component group</th>
                                            <th className="px-4 py-3 text-right font-semibold text-slate-900">Quantity</th>
                                            <th className="px-4 py-3 text-right font-semibold text-slate-900">Estimate</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {costData.map((item) => (
                                            <tr key={item.component}>
                                                <td className="px-4 py-3 text-slate-700">{item.component}</td>
                                                <td className="px-4 py-3 text-right text-slate-500">{item.quantity}</td>
                                                <td className="px-4 py-3 text-right font-medium text-slate-900">{formatMoney(item.cost)}</td>
                                            </tr>
                                        ))}
                                        <tr className="bg-indigo-50 font-semibold text-indigo-950">
                                            <td className="px-4 py-3">Raw component estimate</td>
                                            <td className="px-4 py-3"></td>
                                            <td className="px-4 py-3 text-right">$64</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 text-slate-600">Assembly, quality, scrap, replacements and freight</td>
                                            <td className="px-4 py-3 text-right text-slate-500">Allowance</td>
                                            <td className="px-4 py-3 text-right text-slate-700">$12</td>
                                        </tr>
                                        <tr className="bg-slate-900 font-bold text-white">
                                            <td className="rounded-l-lg px-4 py-4">Pilot-stage landed cost</td>
                                            <td className="px-4 py-4"></td>
                                            <td className="rounded-r-lg px-4 py-4 text-right">$76</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <h3 className="mb-4 text-xl font-semibold text-slate-900">Pricing and margin discipline</h3>
                            <p className="mb-6 text-slate-600">
                                The base case uses a $149 list price and lower average realised prices for institutional and volume orders. A sale should not be accepted below the approved margin floor unless a grant or CSR contract explicitly pays the difference.
                            </p>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200 bg-slate-50">
                                            <th className="px-4 py-3 font-semibold text-slate-900">Stage</th>
                                            <th className="px-4 py-3 text-right font-semibold text-slate-900">Landed cost</th>
                                            <th className="px-4 py-3 text-right font-semibold text-slate-900">Average price</th>
                                            <th className="px-4 py-3 text-right font-semibold text-slate-900">Gross margin</th>
                                            <th className="px-4 py-3 font-semibold text-slate-900">Basis</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {pricingData.map((row) => (
                                            <tr key={row.stage}>
                                                <td className="px-4 py-3 font-medium text-slate-900">{row.stage}</td>
                                                <td className="px-4 py-3 text-right">{formatMoney(row.landedCost)}</td>
                                                <td className="px-4 py-3 text-right">{formatMoney(row.averagePrice)}</td>
                                                <td className="px-4 py-3 text-right font-semibold text-emerald-700">{row.grossMargin}</td>
                                                <td className="px-4 py-3 text-slate-600">{row.basis}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section id="commercial-model" className="scroll-mt-28">
                            <div className="mb-6 flex items-center gap-3 border-b border-slate-200 pb-4">
                                <BarChart3 className="h-6 w-6 text-indigo-600" />
                                <h2 className="font-outfit text-2xl font-bold text-slate-900">4. Commercial model and base case forecast</h2>
                            </div>
                            <p className="mb-6 text-slate-600">
                                Kit sales alone are not expected to fund educator onboarding, curriculum adaptation or field support. The model therefore uses four linked income streams: hardware, paid implementation and educator training, sponsored deployment contracts, and recurring support or content licensing.
                            </p>

                            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                                {[
                                    ["Hardware", "$149 list price, with average realised prices of $139, $135 and $129 in Years 1 to 3."],
                                    ["Implementation", "A separate institutional fee for readiness review, educator training, setup and initial delivery support."],
                                    ["Sponsored deployments", "Grant, CSR and research contracts that purchase defined deployments for schools unable to pay directly."],
                                    ["Recurring income", "Annual support, replacement coverage, dashboard services, curriculum packs and localisation licensing."],
                                ].map(([title, detail]) => (
                                    <div key={title} className="pdf-avoid-break rounded-xl border border-slate-200 bg-white p-5">
                                        <h3 className="mb-2 font-semibold text-slate-900">{title}</h3>
                                        <p className="text-sm leading-6 text-slate-600">{detail}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="pdf-avoid-break mb-10 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                                <h3 className="mb-2 text-lg font-bold text-slate-900">Five-year base case</h3>
                                <p className="mb-6 text-sm text-slate-500">Revenue and results in US dollar thousands. Operating result is before tax, interest and depreciation.</p>
                                <div className="h-72 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={financialProjection} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: "#64748b" }} />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: "#64748b" }}
                                                domain={[-100, 6000]}
                                                ticks={[-100, 0, 1000, 3000, 5000]}
                                                tickFormatter={(value) => value >= 1000 ? `${value / 1000}m` : `${value}k`}
                                            />
                                            <Tooltip content={<FinancialTooltip />} />
                                            <Legend verticalAlign="top" align="right" height={30} />
                                            <Line type="monotone" dataKey="revenue" name="Revenue" stroke={BRAND.primary} strokeWidth={3} dot={{ r: 4 }} />
                                            <Line type="monotone" dataKey="grossProfit" name="Gross profit" stroke={BRAND.blue} strokeWidth={3} dot={{ r: 4 }} />
                                            <Line type="monotone" dataKey="operatingResult" name="Operating result" stroke={BRAND.green} strokeWidth={3} dot={{ r: 4 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="mb-10 overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200 bg-slate-50">
                                            <th className="px-3 py-3 font-semibold text-slate-900">Assumption</th>
                                            {revenueModel.slice(0, 3).map((row) => <th key={row.year} className="px-3 py-3 text-right font-semibold text-slate-900">{row.year}</th>)}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        <tr>
                                            <td className="px-3 py-3 font-medium text-slate-700">Kits sold</td>
                                            {revenueModel.slice(0, 3).map((row) => <td key={row.year} className="px-3 py-3 text-right">{row.kits.toLocaleString("en-US")}</td>)}
                                        </tr>
                                        <tr>
                                            <td className="px-3 py-3 font-medium text-slate-700">Kit revenue</td>
                                            {revenueModel.slice(0, 3).map((row) => <td key={row.year} className="px-3 py-3 text-right">{formatThousands(row.kitRevenue)}</td>)}
                                        </tr>
                                        <tr>
                                            <td className="px-3 py-3 font-medium text-slate-700">Implementation and training</td>
                                            {revenueModel.slice(0, 3).map((row) => <td key={row.year} className="px-3 py-3 text-right">{formatThousands(row.implementation)}</td>)}
                                        </tr>
                                        <tr>
                                            <td className="px-3 py-3 font-medium text-slate-700">Sponsored deployment contracts</td>
                                            {revenueModel.slice(0, 3).map((row) => <td key={row.year} className="px-3 py-3 text-right">{formatThousands(row.sponsored)}</td>)}
                                        </tr>
                                        <tr>
                                            <td className="px-3 py-3 font-medium text-slate-700">Support, content and licensing</td>
                                            {revenueModel.slice(0, 3).map((row) => <td key={row.year} className="px-3 py-3 text-right">{formatThousands(row.recurring)}</td>)}
                                        </tr>
                                        <tr>
                                            <td className="px-3 py-3 font-medium text-slate-700">Gross profit</td>
                                            {financialProjection.slice(0, 3).map((row) => <td key={row.year} className="px-3 py-3 text-right">{formatThousands(row.grossProfit)}</td>)}
                                        </tr>
                                        <tr>
                                            <td className="px-3 py-3 font-medium text-slate-700">Operating result</td>
                                            {financialProjection.slice(0, 3).map((row) => <td key={row.year} className={`px-3 py-3 text-right font-medium ${row.operatingResult < 0 ? "text-rose-700" : "text-emerald-700"}`}>{formatThousands(row.operatingResult)}</td>)}
                                        </tr>
                                        <tr className="bg-slate-900 font-bold text-white">
                                            <td className="rounded-l-lg px-3 py-3">Total revenue</td>
                                            {revenueModel.slice(0, 3).map((row, index) => <td key={row.year} className={`px-3 py-3 text-right ${index === 2 ? "rounded-r-lg" : ""}`}>{formatThousands(row.totalRevenue)}</td>)}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="pdf-avoid-break rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
                                    <h3 className="mb-2 font-semibold text-emerald-950">Break-even logic</h3>
                                    <p className="text-sm leading-6 text-emerald-900">
                                        The base case reaches a positive operating result in Year 3, after annual volume reaches about 3,000 kits and service income covers the delivery team. Hiring and inventory are staged against contracted demand, so growth can be slowed if conversion takes longer.
                                    </p>
                                </div>
                                <div className="pdf-avoid-break rounded-2xl border border-slate-200 bg-slate-50 p-6">
                                    <h3 className="mb-2 font-semibold text-slate-900">Downside response</h3>
                                    <p className="text-sm leading-6 text-slate-700">
                                        If unit sales are 30% below plan, TACTO will defer permanent hires, use smaller production batches, prioritise paid institutional deployments and keep new country entry on hold. The product architecture does not require a large factory commitment.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section id="funding" className="scroll-mt-28">
                            <div className="mb-6 flex items-center gap-3 border-b border-slate-200 pb-4">
                                <Landmark className="h-6 w-6 text-indigo-600" />
                                <h2 className="font-outfit text-2xl font-bold text-slate-900">5. Funding plan and sustainability</h2>
                            </div>
                            <p className="mb-6 text-slate-600">
                                Existing deployable cash supports the controlled pilot batch, but it does not fund tooling, inventory, compliance work and the delivery team required for commercial scale. The next target is a $200,000 pre-seed round. Release of spending is tied to technical and commercial milestones.
                            </p>

                            <div className="pdf-avoid-break mb-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                                <div className="mb-5 flex items-end justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Target raise</p>
                                        <p className="text-3xl font-bold text-slate-900">$200,000</p>
                                    </div>
                                    <p className="max-w-sm text-right text-sm text-slate-500">Indicative planning target. No future funding is shown as secured.</p>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-200 bg-slate-50">
                                                <th className="px-4 py-3 font-semibold text-slate-900">Use</th>
                                                <th className="px-4 py-3 text-right font-semibold text-slate-900">Amount</th>
                                                <th className="px-4 py-3 text-right font-semibold text-slate-900">Share</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {fundingPlan.map((row) => (
                                                <tr key={row.use}>
                                                    <td className="px-4 py-3 text-slate-700">{row.use}</td>
                                                    <td className="px-4 py-3 text-right font-medium text-slate-900">{formatMoney(row.amount)}</td>
                                                    <td className="px-4 py-3 text-right text-slate-500">{row.share}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <h3 className="mb-4 text-xl font-semibold text-slate-900">Diversification plan</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {[
                                    ["Earned income", "Hardware margin, implementation fees, educator training, support and curriculum services become the main source of operating sustainability."],
                                    ["Non-dilutive support", "Education grants, research collaborations and competition awards fund validation, evidence generation and open educational resources."],
                                    ["CSR and government procurement", "Funders purchase defined school deployments with agreed delivery, training and outcome reporting, rather than providing unrestricted subsidy."],
                                    ["Impact investment", "Equity or a convertible instrument funds tooling, working capital and team capacity after the reference design and institutional demand are validated."],
                                ].map(([title, detail]) => (
                                    <div key={title} className="pdf-avoid-break rounded-xl border border-slate-200 bg-white p-5">
                                        <h4 className="mb-2 font-semibold text-slate-900">{title}</h4>
                                        <p className="text-sm leading-6 text-slate-600">{detail}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section id="growth" className="scroll-mt-28">
                            <div className="mb-6 flex items-center gap-3 border-b border-slate-200 pb-4">
                                <TrendingUp className="h-6 w-6 text-indigo-600" />
                                <h2 className="font-outfit text-2xl font-bold text-slate-900">6. Growth plan and decision gates</h2>
                            </div>
                            <p className="mb-8 text-slate-600">
                                Scale is treated as a sequence of evidence gates. Production, hiring and geography expand only after the preceding stage is shown to work.
                            </p>

                            <div className="space-y-6">
                                {milestones.map((milestone) => (
                                    <div key={milestone.period} className="pdf-avoid-break rounded-2xl border border-slate-200 bg-white p-6">
                                        <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                            <h3 className="text-lg font-bold text-slate-900">{milestone.title}</h3>
                                            <span className="w-fit rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">{milestone.period}</span>
                                        </div>
                                        <p className="mb-4 text-sm leading-6 text-slate-600">{milestone.detail}</p>
                                        <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                                            <p className="text-sm leading-6 text-slate-700"><strong>Decision gate:</strong> {milestone.gate}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pdf-dark-callout mt-10 rounded-2xl bg-slate-900 p-7 text-white">
                                <h3 className="mb-3 text-xl font-bold">Conclusion</h3>
                                <p className="leading-7 text-slate-200">
                                    TACTO can scale because the product is modular, the electronics are concentrated in one reader, and content can be localised without rebuilding the hardware. Financial sustainability does not depend on selling low-margin kits alone. The plan combines hardware income with implementation, sponsored deployments and recurring support, while using grants and investment for the stages they are best suited to fund. The forecast is ambitious, but every increase in production is tied to a clear technical or commercial gate.
                                </p>
                            </div>

                            <p className="mt-8 text-xs leading-5 text-slate-500">
                                Source note: Project TACTO management planning model, 11 August 2026. Current support figures are based on project records. Pilot reach is reported by the project team. Forecasts are planning assumptions and should be refreshed when supplier quotations, signed orders and audited accounts become available.
                            </p>
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ScalabilityPage;
