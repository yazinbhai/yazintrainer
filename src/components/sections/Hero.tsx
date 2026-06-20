"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white pt-20">
            {/* Background Subtle Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-muted/50 via-white to-white pointer-events-none" />

            <div className="container relative z-10 px-6 py-20 md:px-12 mx-auto">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Animated Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-muted/80 backdrop-blur-sm border border-brand-indigo/10 mb-8"
                    >
                        <span className="flex h-2 w-2 rounded-full bg-brand-gold animate-pulse" />
                        <span className="text-sm font-medium text-brand-navy">
                            Premium Communication Strategy
                        </span>
                    </motion.div>

                    {/* Main Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-5xl md:text-7xl font-bold tracking-tight text-brand-navy mb-8 mt-4 leading-[1.1]"
                    >
                        Master Power{" "}
                        <span className="text-brand-gold">Skills.</span>
                        <br />
                        Accelerate Your{" "}
                        <span className="text-brand-indigo">Growth.</span>
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                        className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
                    >
                        Premium Soft Skills, Communicative English & IELTS Training
                        engineered for Corporates, Institutions, and driven professionals.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base shadow-xl shadow-brand-navy/10 group" asChild>
                            <Link href="#consultation">
                                Book a Consultation
                                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                        <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-base" asChild>
                            <Link href="#methodology">Explore Methodology</Link>
                        </Button>
                    </motion.div>
                </div>
            </div>

            {/* Decorative Blur Orbs */}
            <div className="absolute top-1/4 left-10 w-72 h-72 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none mix-blend-multiply" />
            <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-brand-indigo/5 rounded-full blur-3xl pointer-events-none mix-blend-multiply" />
        </section>
    );
}
