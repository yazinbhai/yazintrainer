"use client";

import { motion } from "framer-motion";
import { Search, PenTool, Mic, BarChart } from "lucide-react";

const steps = [
    {
        icon: Search,
        title: "Diagnostic Assessment",
        description: "Deep-dive analysis of current communication gaps, behavioral patterns, and corporate/academic requirements.",
    },
    {
        icon: PenTool,
        title: "Curriculum Architecture",
        description: "Designing a bespoke intervention program leveraging TEFL methodologies and adult-learning principles.",
    },
    {
        icon: Mic,
        title: "Strategic Delivery",
        description: "Interactive, scenario-based training sessions focused on practical application, not just theory.",
    },
    {
        icon: BarChart,
        title: "Metric Measurement",
        description: "Continuous evaluation mapping behavioral shifts and ROI against the initial diagnostic baselines.",
    },
];

export function Methodology() {
    return (
        <section className="py-24 bg-brand-navy text-white relative overflow-hidden" id="methodology">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay"></div>

            <div className="container px-6 md:px-12 mx-auto relative z-10">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                    {/* Sticky Left Content */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-5xl font-bold mb-6"
                        >
                            The <span className="text-brand-gold">Framework.</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-gray-400 text-lg mb-8"
                        >
                            Transformation is not accidental. It is engineered. Our proprietary four-phase methodology ensures that training translates directly into measurable behavioral change.
                        </motion.p>
                    </div>

                    {/* Scrolling Right Steps */}
                    <div className="lg:col-span-7 lg:col-start-6 space-y-8 relative">

                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute left-[2.25rem] top-10 bottom-10 w-px bg-white/10 z-0 border-l border-dashed border-white/20"></div>

                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="relative z-10 bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm flex flex-col md:flex-row gap-8 items-start hover:bg-white/10 transition-colors"
                            >
                                {/* Step Number & Icon */}
                                <div className="shrink-0">
                                    <div className="w-16 h-16 rounded-2xl bg-brand-indigo/50 border border-brand-indigo flex items-center justify-center relative shadow-[0_0_15px_rgba(28,46,91,0.5)]">
                                        <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-brand-gold text-brand-navy font-bold flex items-center justify-center text-sm">
                                            0{index + 1}
                                        </div>
                                        <step.icon className="w-8 h-8 text-brand-gold" />
                                    </div>
                                </div>

                                {/* Step Content */}
                                <div>
                                    <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                                    <p className="text-gray-400 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}

                    </div>
                </div>
            </div>
        </section>
    );
}
