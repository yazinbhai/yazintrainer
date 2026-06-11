import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Linkedin, Mail, MapPin } from "lucide-react";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-brand-navy text-white pt-20 pb-10">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
                    {/* Brand Col */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
                            <div className="relative w-[75px] h-[36px]">
                                <Image
                                    src="/yazin-trainer-logo.png"
                                    alt="Yazin Trainer Logo"
                                    fill
                                    sizes="75px"
                                    className="object-contain brightness-0 invert"
                                />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-white transition-colors group-hover:text-brand-gold">
                                Yazin <span className="text-brand-gold">Trainer</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Premium communication strategy, soft skills mastery, and high-stakes
                            English training for corporates and academic institutions across India.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-300 hover:bg-brand-gold hover:text-brand-navy transition-all"
                                aria-label="LinkedIn Profile"
                            >
                                <Linkedin size={18} />
                            </a>
                            <a
                                href="mailto:contact@yazintrainer.com"
                                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-300 hover:bg-brand-gold hover:text-brand-navy transition-all"
                                aria-label="Email Us"
                            >
                                <Mail size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:col-span-1 lg:ml-12">
                        <h4 className="font-semibold text-lg mb-6 text-white">Expertise</h4>
                        <ul className="space-y-4">
                            <li>
                                <Link href="#services" className="text-gray-400 hover:text-brand-gold text-sm transition-colors">
                                    Corporate Training
                                </Link>
                            </li>
                            <li>
                                <Link href="#services" className="text-gray-400 hover:text-brand-gold text-sm transition-colors">
                                    Institutional Programs
                                </Link>
                            </li>
                            <li>
                                <Link href="#services" className="text-gray-400 hover:text-brand-gold text-sm transition-colors">
                                    IELTS Mastery
                                </Link>
                            </li>
                            <li>
                                <Link href="#methodology" className="text-gray-400 hover:text-brand-gold text-sm transition-colors">
                                    Our Methodology
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="lg:col-span-1">
                        <h4 className="font-semibold text-lg mb-6 text-white">Company</h4>
                        <ul className="space-y-4">
                            <li>
                                <Link href="#story" className="text-gray-400 hover:text-brand-gold text-sm transition-colors">
                                    Founder's Story
                                </Link>
                            </li>
                            <li>
                                <Link href="#gallery" className="text-gray-400 hover:text-brand-gold text-sm transition-colors">
                                    Media Gallery
                                </Link>
                            </li>
                            <li>
                                <Link href="#blog" className="text-gray-400 hover:text-brand-gold text-sm transition-colors inline-flex items-center gap-1 group">
                                    Insights & Blog
                                    <ArrowUpRight size={14} className="opacity-0 -translate-y-1 transition-all group-hover:opacity-100 group-hover:translate-y-0" />
                                </Link>
                            </li>
                            <li>
                                <Link href="#consultation" className="text-gray-400 hover:text-brand-gold text-sm transition-colors">
                                    Book Consultation
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Col */}
                    <div className="lg:col-span-1">
                        <h4 className="font-semibold text-lg mb-6 text-white">Get in Touch</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-brand-gold shrink-0 mt-0.5" />
                                <span className="text-gray-400 text-sm leading-relaxed">
                                    Available for strategic engagements across India & Globally via remote consulting.
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-brand-gold shrink-0" />
                                <a href="mailto:consult@yazintrainer.com" className="text-gray-400 hover:text-brand-gold text-sm transition-colors">
                                    consult@yazintrainer.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-sm">
                        © {currentYear} Yazin Trainer. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link href="#" className="text-gray-500 hover:text-white text-sm transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="#" className="text-gray-500 hover:text-white text-sm transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
