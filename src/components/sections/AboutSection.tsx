"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle2, User, Trophy, Users, Briefcase } from "lucide-react";
import CountUp from "./ui/CountUp";

// Placeholder image for mentor - in production use real image
const MENTOR_IMAGE = "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80";

const features = [
    "Proven track record with 1000+ successful projects",
    "3+ years of hands-on experience in digital marketing",
    "Worked with 50+ brands across different industries",
    "Managed 50+ lakhs in ad spend with positive ROI",
    "Personalized strategy for every client",
];

const stats = [
    { icon: Briefcase, value: 1000, suffix: "+", label: "Projects Completed" },
    { icon: Users, value: 50, suffix: "+", label: "Happy Clients" },
    { icon: Trophy, value: 3, suffix: "+", label: "Years Experience" },
];

export default function AboutSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="about" className="relative py-24 bg-[#030308]" ref={ref}>
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-900/5 to-transparent pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Image Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="w-full lg:w-1/2 relative"
                    >
                        {/* Image Frame */}
                        <div className="relative z-10 rounded-2xl overflow-hidden border border-white/10 glow-border group">
                            <div className="aspect-[4/5] relative">
                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-transparent to-transparent opacity-60" />
                                <img
                                    src={MENTOR_IMAGE}
                                    alt="Faiz Khan - Mentor"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>

                            {/* Floating Name Card */}
                            <div className="absolute bottom-6 left-6 right-6 p-4 glass rounded-xl bg-black/40 backdrop-blur-md border border-white/10">
                                <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-orbitron)" }}>
                                    Faiz Khan
                                </h3>
                                <p className="text-purple-400 text-sm font-medium">Facebook Ads Expert & Mentor</p>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute -top-6 -left-6 w-24 h-24 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-3xl" />
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 border-b-2 border-r-2 border-purple-500/30 rounded-br-3xl" />
                    </motion.div>

                    {/* Content Column */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-full lg:w-1/2"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-6">
                            <User className="w-3.5 h-3.5" />
                            Meet Your Mentor
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight" style={{ fontFamily: "var(--font-orbitron)" }}>
                            Driving Remarkable Results Through <span className="gradient-text">Strategic Advertising</span>
                        </h2>

                        <div className="space-y-4 text-gray-400 mb-8">
                            <p>
                                Hey there! 👋 I&apos;m Faiz Khan, your go-to Facebook Ads expert with a proven track record.
                                I&apos;ve successfully completed over 1000 projects, collaborating with individuals and businesses alike.
                            </p>
                            <p>
                                With years of hands-on experience, I understand the ever-evolving landscape of digital advertising.
                                From small startups to established enterprises, I&apos;ve helped my clients achieve their marketing goals with precision and impact.
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4 mb-10">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center p-3 rounded-lg bg-white/5 border border-white/5">
                                    <stat.icon className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
                                    <div className="text-xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-orbitron)" }}>
                                        <CountUp end={stat.value} duration={2} />
                                        {stat.suffix}
                                    </div>
                                    <div className="text-xs text-gray-400">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Why Choose Us Features */}
                        <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "var(--font-orbitron)" }}>Why Choose Us?</h3>
                        <ul className="space-y-3">
                            {features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-300 text-sm">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
