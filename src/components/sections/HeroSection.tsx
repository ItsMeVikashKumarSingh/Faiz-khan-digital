"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
    return (
        <section
            id="home"
            className="min-h-screen flex items-center justify-center pt-24 pb-12 md:pt-32 md:pb-20 relative overflow-hidden"
        >
            <div className="container mx-auto px-4 z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto"
                >
                    {/* Tag Pill */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 border border-white/10">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm text-cyan-400 tracking-wide">Premium Digital Marketing Services</span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-8 tracking-tight"
                        style={{ fontFamily: "var(--font-orbitron)" }}>
                        Digital Presence<br />
                        <span className="gradient-text">Reimagined</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
                        Transform your brand with expert strategies.
                        Zero guesswork, infinite scalability, and verified results.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link href="#contact" className="btn-glass bg-white/10 border-cyan-400/50 hover:bg-white/20 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] !px-8 !py-4 !text-lg">
                            Start Building <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                        <Link href="#services" className="btn-glass !px-8 !py-4 !text-lg">
                            Explore Services
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
