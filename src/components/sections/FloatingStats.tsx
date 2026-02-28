"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { getStats } from "@/lib/cms";
import { Stat } from "@/types";

export default function FloatingStats() {
    const [stats, setStats] = useState<Stat[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const loadStats = async () => {
            const fetchedStats = await getStats();
            if (fetchedStats && fetchedStats.length > 0) {
                setStats(fetchedStats);
            }
        };
        loadStats();
    }, []);

    useEffect(() => {
        if (stats.length > 1) {
            const timer = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % stats.length);
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [stats]);

    return (
        <div className="relative h-[250px] md:h-[300px] max-w-[1000px] mx-auto my-8 md:my-12 flex justify-center items-center overflow-hidden z-10">
            <motion.div
                className="glass-card w-60 h-60 rounded-full flex flex-col items-center justify-center relative z-10 border border-white/20"
                style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))" }}
                animate={{
                    y: [-10, 10, -10],
                }}
                transition={{
                    duration: 6,
                    ease: "easeInOut",
                    repeat: Infinity,
                }}
            >
                <AnimatePresence mode="wait">
                    {stats.length > 0 && (
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.5 }}
                            className="text-center"
                        >
                            <span className="text-5xl font-bold text-white mb-2">
                                {stats[currentIndex].prefix}{stats[currentIndex].value}{stats[currentIndex].suffix}
                            </span>
                            <div className="text-sm uppercase tracking-widest text-[#00f2ea]">
                                {stats[currentIndex].label}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Decorative Shards */}
            <motion.div
                className="glass-card absolute w-[300px] h-[150px] opacity-30 z-0"
                style={{
                    transform: "rotate(-10deg) translate(-150px, 50px)",
                    background: "rgba(255,255,255,0.02)"
                }}
                animate={{
                    rotate: [-10, -5, -10],
                    y: [0, 20, 0]
                }}
                transition={{
                    duration: 8,
                    ease: "easeInOut",
                    repeat: Infinity,
                }}
            />
            <motion.div
                className="glass-card absolute w-[200px] h-[200px] opacity-30 z-0"
                style={{
                    transform: "rotate(15deg) translate(150px, -50px)",
                    background: "rgba(255,255,255,0.02)"
                }}
                animate={{
                    rotate: [15, 20, 15],
                    y: [0, -20, 0]
                }}
                transition={{
                    duration: 10,
                    ease: "easeInOut",
                    repeat: Infinity,
                    delay: 1
                }}
            />
        </div>
    );
}
