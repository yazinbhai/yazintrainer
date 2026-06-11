"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const timeline = [
    {
        year: "Corporate Foundation",
        title: "Training manager at Corporetta",
        description: "Built strong foundation in corporate soft skills training by planning and executing training sessions which gave a strong understanding of training methodology, psychology and communication dynamics.",
    },
    {
        year: "Pedagogical Mastery",
        title: "Master Soft Skills Trainer Certified",
        description: "Obtained rigorous Master Trainer certifications in Soft skills, IELTS,  ESL (TEFL) and ESL (TESOL) officially recognized by IDP, British council, ALAP and University of Arizona (US)",
    },
    {
        year: "Communication Coaching",
        title: "Public Speaking Trainer at Planet Spark",
        description: "Trained learners in public speaking and creative writing, helping them develop confidence and articulate self-expression at PlanetSpark, India's leading soft skills edtech firm",
    },
    {
        year: "Leadership",
        title: "Head Trainer at Jintas Learning Solutions",
        description: "Lead, motivated, and managed a team of over 30 trainers, overseeing their performance and professional development, apart from training students in Soft skills.",
    },
    {
        year: "Current Era",
        title: "Soft Skills Training for Organisations",
        description: "Conducts training need analysis and identifies skills gap in consultation with performance managers. Creates and executes customised training plans using proven training methodologies.",
    },
];

export function Authority() {
    const targetRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [scrollRange, setScrollRange] = useState(0);

    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"]
    });

    useEffect(() => {
        const updateRange = () => {
            if (trackRef.current) {
                const range = trackRef.current.scrollWidth - window.innerWidth;
                setScrollRange(range > 0 ? range : 0);
            }
        };

        updateRange();
        window.addEventListener("resize", updateRange);
        return () => window.removeEventListener("resize", updateRange);
    }, []);

    // Map vertical scroll to horizontal scroll using exact measured pixels
    const x = useTransform(scrollYProgress, [0, 1], [0, -scrollRange]);

    return (
        <section ref={targetRef} className="relative h-[300vh] bg-brand-muted" id="story">
            <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">

                {/* Header Content */}
                <div className="container px-6 md:px-12 mx-auto w-full mb-8 shrink-0">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-2xl"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-brand-navy mb-4">
                            The Architect <br />
                            <span className="text-brand-indigo">Behind the Mastery.</span>
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Yazin T. Azad brings a rare synthesis of corporate trenches, facilitation strategy,
                            and certified instructional design to every engagement.
                        </p>
                    </motion.div>
                </div>

                {/* Horizontal Scroll Track */}
                <motion.div
                    ref={trackRef}
                    style={{ x }}
                    className="flex gap-6 md:gap-8 px-6 md:pl-12 w-max"
                >

                    {/* Intro Card */}
                    <div className="w-[300px] md:w-[400px] h-[350px] shrink-0 bg-brand-navy text-white rounded-3xl relative overflow-hidden group shadow-xl flex flex-col justify-end p-8">
                        <Image
                            src="/Yazin_professional.png"
                            alt="Yazin T. Azad"
                            fill
                            className="object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 mix-blend-luminosity grayscale group-hover:grayscale-0"
                            sizes="(max-width: 768px) 300px, 400px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/60 to-transparent"></div>

                        <div className="relative z-10 flex flex-col">
                            <div className="mb-4">
                                <span className="text-brand-gold font-semibold uppercase tracking-wider text-sm drop-shadow-md">Founder</span>
                                <h3 className="text-3xl font-bold mt-1 drop-shadow-md">Yazin T. Azad</h3>
                            </div>
                            <div className="border-t border-white/30 pt-4">
                                <ul className="space-y-2 text-sm text-gray-100 font-medium tracking-wide">
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-gold shadow-[0_0_8px_rgba(255,215,0,0.8)]"></div> Masters in Human Resource Management</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-gold shadow-[0_0_8px_rgba(255,215,0,0.8)]"></div> Certified Master Soft Skills Trainer</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-gold shadow-[0_0_8px_rgba(255,215,0,0.8)]"></div> Certified IELTS, TEFL & TESOL Trainer</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Cards */}
                    {timeline.map((item, index) => (
                        <div
                            key={index}
                            className="w-[300px] md:w-[350px] h-[350px] shrink-0 bg-white border border-gray-100 rounded-3xl p-8 flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-2 hover:border-brand-indigo/20 transition-all duration-300 group"
                        >
                            <div className="text-sm font-bold text-brand-gold uppercase tracking-widest mb-4">
                                {item.year}
                            </div>
                            <h3 className="text-2xl font-bold text-brand-navy mb-4 border-b border-gray-100 pb-4">
                                {item.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    ))}

                    {/* Spacer block to add padding at the very end of the scroll array */}
                    <div className="w-[6vw] md:w-[10vw] shrink-0"></div>

                </motion.div>
            </div>
        </section>
    );
}
