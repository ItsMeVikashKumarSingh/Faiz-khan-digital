"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap } from "lucide-react";
import Link from "next/link";

const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#services", label: "Services" },
    { href: "#packages", label: "Packages" },
    { href: "#results", label: "Results" },
    { href: "#courses", label: "Courses" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" },
];

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("home");
    const [isHidden, setIsHidden] = useState(false);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Determine if scrolled for styling
            setIsScrolled(currentScrollY > 50);

            // Determine scroll direction for visibility
            if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                setIsHidden(true); // Scroll Down -> Hide
            } else {
                setIsHidden(false); // Scroll Up -> Show
            }

            lastScrollY.current = currentScrollY;

            // Detect active section
            const sections = navLinks.map((link) => link.href.replace("#", ""));
            for (const section of sections.reverse()) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 100) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? "bg-[#050510]/80 backdrop-blur-xl border-b border-white/10"
                : "bg-transparent"
                } ${isHidden ? "-translate-y-full" : "translate-y-0"}`}
        >
            <nav className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="#home" className="flex items-center gap-2 group">
                    <motion.div
                        className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400 }}
                    >
                        <Zap className="w-5 h-5 text-white" />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 opacity-0 group-hover:opacity-50 blur-xl transition-opacity" />
                    </motion.div>
                    <span
                        className="text-lg font-bold tracking-wide"
                        style={{ fontFamily: "var(--font-orbitron)" }}
                    >
                        <span className="gradient-text">FAIZ KHAN</span>
                        <span className="text-white"> DIGITAL</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`relative text-sm font-medium tracking-wide transition-colors ${activeSection === link.href.replace("#", "")
                                ? "text-white"
                                : "text-gray-400 hover:text-white"
                                }`}
                        >
                            {link.label}
                            {activeSection === link.href.replace("#", "") && (
                                <motion.div
                                    layoutId="activeNav"
                                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-cyan-500"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                        </Link>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="hidden lg:block">
                    <Link
                        href="#contact"
                        className="relative px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-white font-semibold text-sm tracking-wide overflow-hidden group hover:border-purple-500/50 transition-all"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                        <span className="relative z-10 flex items-center gap-2">
                            Get Started
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </span>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="lg:hidden p-2 text-white hover:text-purple-400 transition-colors"
                >
                    {isMobileMenuOpen ? (
                        <X className="w-6 h-6" />
                    ) : (
                        <Menu className="w-6 h-6" />
                    )}
                </button>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-[#050510]/95 backdrop-blur-xl border-t border-white/10"
                    >
                        <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
                            {navLinks.map((link, index) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`block py-2 text-lg font-medium transition-colors ${activeSection === link.href.replace("#", "")
                                            ? "text-purple-400"
                                            : "text-gray-300 hover:text-white"
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                </motion.div>
                            ))}
                            <Link
                                href="#contact"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="btn-primary text-center mt-4"
                            >
                                Get Started
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
