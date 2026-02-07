"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp } from "lucide-react";

// Placeholder results - in production, fetch from DB
const results = [
    { id: 1, title: "E-commerce Campaign", metric: "320% ROI" },
    { id: 2, title: "Lead Generation", metric: "2.5K Leads" },
    { id: 3, title: "Brand Awareness", metric: "1M+ Reach" },
    { id: 4, title: "App Installs", metric: "50K+ Downloads" },
    { id: 5, title: "Sales Campaign", metric: "₹10L Revenue" },
    { id: 6, title: "Engagement Boost", metric: "500% Engagement" },
];

export default function ResultsSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="results" className="relative py-24" ref={ref}>
            <div className="container mx-auto px-4 md:px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2
                        className="section-title"
                        style={{ fontFamily: "var(--font-orbitron)" }}
                    >
                        Our <span className="gradient-text">Results</span> Speak Louder
                    </h2>
                    <p className="section-subtitle">
                        Real results from real campaigns we&apos;ve managed for our clients
                    </p>
                </motion.div>

                {/* Results Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    {results.map((result, index) => (
                        <motion.div
                            key={result.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="glass-card aspect-square flex flex-col items-center justify-center p-6 text-center group cursor-pointer"
                        >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/20 to-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-6 h-6 text-purple-400" />
                            </div>
                            <div
                                className="text-2xl md:text-3xl font-bold gradient-text mb-2"
                                style={{ fontFamily: "var(--font-orbitron)" }}
                            >
                                {result.metric}
                            </div>
                            <p className="text-gray-400 text-sm">{result.title}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
