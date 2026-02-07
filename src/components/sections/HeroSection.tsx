"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, MessageCircle, TrendingUp, Users, Wallet } from "lucide-react";
import Link from "next/link";
import CountUp from "./ui/CountUp";

const stats = [
    {
        icon: TrendingUp,
        value: 3,
        suffix: "+",
        label: "Years Experience",
    },
    {
        icon: Users,
        value: 50,
        suffix: "+",
        label: "Brands Served",
    },
    {
        icon: Wallet,
        value: 50,
        suffix: "L+",
        label: "Ad Spent",
    },
];

export default function HeroSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <section
            id="home"
            className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
            ref={ref}
        >
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Gradient Orbs */}
                <motion.div
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
                    animate={{
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl"
                    animate={{
                        x: [0, -40, 0],
                        y: [0, -30, 0],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDAgTCA0MCAwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPjxwYXRoIGQ9Ik0gMCAwIEwgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center">

                    {/* Main Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6"
                        style={{ fontFamily: "var(--font-orbitron)" }}
                    >
                        Transform Your{" "}
                        <span className="gradient-text">Digital Presence</span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10"
                    >
                        A dedicated team of specialists, delivering remarkable work to our
                        clients worldwide!
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
                    >
                        <Link href="#contact" className="btn-primary flex items-center gap-2">
                            Book a Strategy Call
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <a
                            href="https://wa.link/uwwdyh"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary flex items-center gap-2"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Chat on WhatsApp
                        </a>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto"
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                                className="glass-card p-6 text-center group"
                            >
                                <div className="flex items-center justify-center mb-3">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/20 to-cyan-500/20 flex items-center justify-center">
                                        <stat.icon className="w-6 h-6 text-purple-400 group-hover:text-cyan-400 transition-colors" />
                                    </div>
                                </div>
                                <div
                                    className="text-3xl md:text-4xl font-bold gradient-text mb-1"
                                    style={{ fontFamily: "var(--font-orbitron)" }}
                                >
                                    <CountUp end={stat.value} duration={2} />
                                    {stat.suffix}
                                </div>
                                <p className="text-gray-400 text-sm">{stat.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
                >
                    <motion.div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                </motion.div>
            </motion.div>
        </section>
    );
}
