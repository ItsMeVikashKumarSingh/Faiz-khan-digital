"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { getResults } from "@/lib/cms";
import { Result } from "@/types";

export default function ResultsSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [results, setResults] = useState<Result[]>([]);

    useEffect(() => {
        const loadResults = async () => {
            const fetched = await getResults();
            if (fetched && fetched.length > 0) {
                setResults(fetched);
            }
        };
        loadResults();
    }, []);

    return (
        <section id="results" className="relative py-24" ref={ref}>
            <div className="container mx-auto px-6 md:px-12 lg:px-20">
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
                            key={result.$id || index}
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
