"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap, Cloud } from "lucide-react";
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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu on resize if screen becomes large
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                style={{ translateX: "-50%" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="fixed top-8 left-1/2 w-[calc(100%-3rem)] max-w-[1000px] px-6 py-3 rounded-full flex justify-between items-center z-50 glass-panel md:w-[90%]"
            >
                {/* Logo */}
                <Link href="#home" className="flex items-center gap-2 font-bold text-lg tracking-wider">
                    <Zap className="w-5 h-5 text-cyan-400" />
                    <span style={{ fontFamily: "var(--font-orbitron)" }}>
                        FAIZ KHAN <span className="text-purple-400">DIGITAL</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-white/70 hover:text-white text-sm transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-4">

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden text-white p-1"
                        aria-label="Toggle Menu"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-24 left-4 right-4 z-40 lg:hidden"
                    >
                        <div className="bg-[#050510]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-4 shadow-2xl">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-white/80 hover:text-white text-lg font-medium p-2 border-b border-white/5"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <Link
                                href="#contact"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="btn-glass text-center justify-center mt-2"
                            >
                                Get Started
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
