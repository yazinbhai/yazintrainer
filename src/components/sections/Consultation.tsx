"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export function Consultation() {
    return (
        <section className="py-24 bg-white relative overflow-hidden" id="consultation">
            <div className="container px-6 md:px-12 mx-auto max-w-6xl">

                <div className="bg-brand-navy rounded-[3rem] p-8 md:p-16 relative overflow-hidden flex flex-col items-center text-center shadow-2xl">

                    {/* Background Decorative Elements */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-indigo/30 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-gold/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay pointer-events-none"></div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative z-10 max-w-3xl mx-auto"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-8 shadow-inner">
                            <Calendar className="w-8 h-8 text-brand-gold" />
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                            Ready to engineer your <br className="hidden md:block" />
                            <span className="text-brand-gold">communication strategy?</span>
                        </h2>

                        <p className="text-gray-300 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                            Book a 30-minute discovery consultation. We'll diagnose your immediate friction points and sketch a high-level intervention roadmap.
                        </p>

                        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 mb-10">
                            <Button size="lg" asChild className="w-full sm:w-auto h-14 px-8 text-base bg-brand-gold text-brand-navy hover:bg-brand-gold/90 font-bold group cursor-pointer">
                                <a href="https://calendly.com/yazintrainer/30min" target="_blank" rel="noopener noreferrer">
                                    <Calendar className="mr-2 w-5 h-5" />
                                    Schedule Strategy Call
                                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </a>
                            </Button>

                            <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-base bg-transparent text-white border-white/20 hover:bg-white/10 hover:text-white">
                                <Mail className="mr-2 w-5 h-5" />
                                consult@yazintrainer.com
                            </Button>
                        </div>

                        <div className="flex items-center justify-center gap-6 text-sm text-gray-400 font-medium">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-brand-gold" />
                                No Obligation
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-brand-gold" />
                                Confidential
                            </div>
                        </div>

                    </motion.div>
                </div>

            </div>
        </section>
    );
}
