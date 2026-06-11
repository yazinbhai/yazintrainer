"use client";

import { motion } from "framer-motion";
import { Briefcase, Building2, GraduationCap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const services = [
    {
        icon: Building2,
        title: "Corporate Communication Strategy",
        description: "Executive coaching, internal alignment, and public speaking mastery for senior leaders and teams.",
        metrics: "Focus: Executive Presence & Clarity",
    },
    {
        icon: GraduationCap,
        title: "Institutional Job-Readiness for Corporate Placements",
        description: "Structured interventions for colleges bridging the gap between academic knowledge and corporate expectations.",
        metrics: "Focus: Employability & Soft Skills",
    },
    {
        icon: Briefcase,
        title: "Premium English Communication and IELTS Mastery",
        description: "High-stakes IELTS preparation engineered for absolute certainty, focusing on communicative competence.",
        metrics: "Focus: Band 7.5+ Strategies",
    },
];

export function Services() {
    return (
        <section className="py-24 bg-white" id="services">
            <div className="container px-6 md:px-12 mx-auto">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-3xl md:text-5xl font-bold text-brand-navy mb-6"
                    >
                        Engineering <br />
                        <span className="text-brand-gold">Communicative Competence.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-600 text-lg"
                    >
                        Three specialized verticals designed to transform how individuals and organizations operate through language and behavior.
                    </motion.p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: index * 0.15 }}
                            whileHover={{ y: -8 }}
                            className="bg-brand-muted rounded-3xl p-8 border border-gray-100 hover:shadow-xl hover:border-brand-gold/20 transition-all group flex flex-col h-full"
                        >
                            <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <service.icon className="w-6 h-6 text-brand-indigo" />
                            </div>

                            <h3 className="text-2xl font-bold text-brand-navy mb-4">
                                {service.title}
                            </h3>

                            <p className="text-gray-600 mb-8 flex-grow">
                                {service.description}
                            </p>

                            <div className="mt-auto">
                                <div className="text-sm font-semibold text-brand-gold uppercase tracking-wider mb-6">
                                    {service.metrics}
                                </div>

                                <Link href="#consultation" className="inline-flex items-center text-brand-navy font-medium group-hover:text-brand-indigo">
                                    Learn more
                                    <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <Button variant="outline" size="lg" className="rounded-full shadow-sm hover:shadow-md" asChild>
                        <Link href="#consultation">View Custom Programs</Link>
                    </Button>
                </motion.div>

            </div>
        </section>
    );
}
