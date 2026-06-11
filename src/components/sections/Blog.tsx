"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

// Placeholder data for the blog section
const posts = [
    {
        title: "The Death of the 'Soft Skill': Why Corporate Communication is Hard ROI",
        category: "Corporate Strategy",
        date: "Oct 12, 2023",
        readTime: "5 min read",
        excerpt: "Stop calling it soft skills. Internal alignment, persuasive management, and clear documentation are the hardest drivers of enterprise revenue.",
        slug: "death-of-soft-skills"
    },
    {
        title: "IELTS Band 8+: Thinking Natively vs. Translating",
        category: "IELTS Mastery",
        date: "Sep 28, 2023",
        readTime: "7 min read",
        excerpt: "The fundamental flaw in most IELTS preparation is treating English as a math equation to be translated, rather than a framework of thought.",
        slug: "ielts-thinking-natively"
    },
    {
        title: "Generative AI and the Future of the Trainer",
        category: "Future of Learning",
        date: "Sep 15, 2023",
        readTime: "4 min read",
        excerpt: "How prompt engineering and AI integration change the role of the corporate trainer from a knowledge provider to a behavioral coach.",
        slug: "ai-future-of-training"
    }
];

export function Blog() {
    return (
        <section className="py-24 bg-brand-muted" id="blog">
            <div className="container px-6 md:px-12 mx-auto">

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="max-w-2xl"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-brand-navy mb-4">
                            Strategic <span className="text-brand-indigo">Insights.</span>
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Perspectives on corporate training, linguistic competence, and professional growth.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <Link
                            href="/blog"
                            className="inline-flex items-center text-brand-navy font-bold hover:text-brand-indigo transition-colors"
                        >
                            View All Articles <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, index) => (
                        <motion.article
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white rounded-3xl p-8 border border-gray-100 hover:shadow-xl hover:border-brand-gold/20 transition-all flex flex-col group h-full"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-xs font-bold text-brand-gold uppercase tracking-wider bg-brand-gold/10 px-3 py-1 rounded-full">
                                    {post.category}
                                </span>
                                <div className="flex items-center text-gray-400 text-xs font-medium">
                                    <Clock className="w-3.5 h-3.5 mr-1" />
                                    {post.readTime}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-brand-navy mb-4 group-hover:text-brand-indigo transition-colors line-clamp-2">
                                <Link href={`/blog/${post.slug}`} className="before:absolute before:inset-0 relative">
                                    {post.title}
                                </Link>
                            </h3>

                            <p className="text-gray-600 mb-8 line-clamp-3 text-sm leading-relaxed flex-grow">
                                {post.excerpt}
                            </p>

                            <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-500">{post.date}</span>
                                <span className="text-brand-indigo font-medium text-sm group-hover:translate-x-1 transition-transform opacity-0 group-hover:opacity-100 flex items-center">
                                    Read Article <ArrowRight className="w-4 h-4 ml-1" />
                                </span>
                            </div>
                        </motion.article>
                    ))}
                </div>

            </div>
        </section>
    );
}
