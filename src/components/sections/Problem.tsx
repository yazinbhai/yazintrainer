"use client";

import { motion } from "framer-motion";
import { TrendingDown, Users, AlertTriangle } from "lucide-react";

const stats = [
    {
        icon: TrendingDown,
        value: "60%",
        label: "of engineering graduates lack corporate-ready communication skills.",
    },
    {
        icon: Users,
        value: "8/10",
        label: "generic training programs fail to produce lasting behavioral transformation.",
    },
    {
        icon: AlertTriangle,
        value: "3x",
        label: "higher turnover rates in teams with poor internal communication.",
    },
];

export function Problem() {
    return (
        <section className="py-24 bg-brand-navy text-white relative h-auto overflow-hidden">
            {/* Background Graphic */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-indigo/20 blur-[100px] pointer-events-none rounded-full transform translate-x-1/2 -translate-y-1/2" />

            <div className="container px-6 md:px-12 mx-auto relative z-10 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left Column: Text */}
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                            className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
                        >
                            The Hidden Cost of <br />
                            <span className="text-brand-gold">Generic Training</span>.
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8"
                        >
                            Most corporate soft skills and communicative English programs rely on outdated lectures and motivational fluff. They inspire for a day, but fail to change behavior.
                            <br /><br />
                            Institutions and enterprises don't need another generic seminar. They need structured, metric-driven intervention.
                        </motion.p>
                    </div>

                    {/* Right Column: Stats Grid */}
                    <div className="grid grid-cols-1 gap-6">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                                className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors flex items-start gap-6"
                            >
                                <div className="p-3 bg-brand-gold/20 rounded-lg shrink-0">
                                    <stat.icon className="w-6 h-6 text-brand-gold" />
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                                    <p className="text-gray-400 leading-snug">{stat.label}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
