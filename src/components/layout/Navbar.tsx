"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
    { name: "Story", href: "#story" },
    { name: "Services", href: "#services" },
    { name: "Methodology", href: "#methodology" },
    { name: "Gallery", href: "#gallery" },
    { name: "Insights", href: "#blog" },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b border-transparent",
                isScrolled
                    ? "bg-white/80 backdrop-blur-md shadow-sm border-gray-100 py-3"
                    : "bg-transparent py-5"
            )}
        >
            <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="relative z-10 flex items-center gap-3 group">
                    <div className="relative w-[75px] h-[36px] transition-transform duration-300 group-hover:scale-105">
                        <Image
                            src="/yazin-trainer-logo.png"
                            alt="Yazin Trainer Logo"
                            fill
                            sizes="75px"
                            className="object-contain"
                            priority
                        />
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-brand-navy transition-colors duration-300 group-hover:text-brand-indigo">
                        Yazin <span className="text-brand-gold">Trainer</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-gray-600 hover:text-brand-navy transition-colors relative group"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-gold transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    ))}
                    <Button variant="default" size="sm" asChild>
                        <Link href="#consultation">Book Consultation</Link>
                    </Button>
                </nav>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden relative z-10 p-2 text-brand-navy"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle Navigation"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Navigation Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-xl md:hidden overflow-hidden"
                    >
                        <nav className="flex flex-col container mx-auto px-6 py-6 gap-6">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-lg font-medium text-gray-800 hover:text-brand-gold transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-gray-100">
                                <Button variant="default" className="w-full" asChild>
                                    <Link href="#consultation" onClick={() => setIsMobileMenuOpen(false)}>
                                        Book Consultation
                                    </Link>
                                </Button>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
