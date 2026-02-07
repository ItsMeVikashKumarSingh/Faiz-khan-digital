"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
    Facebook,
    Instagram,
    Chrome,
    MessageSquare,
    Palette,
    Globe,
    Send,
    Smartphone,
    Video,
} from "lucide-react";

const services = [
    {
        icon: Facebook,
        title: "Facebook Ads",
        description:
            "Targeted campaigns that drive conversions and maximize ROI on Facebook platform.",
        color: "from-blue-500 to-blue-600",
    },
    {
        icon: Instagram,
        title: "Instagram Ads",
        description:
            "Visual storytelling and influencer marketing to engage your audience effectively.",
        color: "from-pink-500 to-purple-600",
    },
    {
        icon: Chrome,
        title: "Google Ads",
        description:
            "Search and display advertising to capture high-intent customers at the right moment.",
        color: "from-green-500 to-emerald-600",
    },
    {
        icon: MessageSquare,
        title: "WhatsApp Marketing",
        description:
            "Personalized messaging and automation for higher engagement and conversions.",
        color: "from-green-400 to-green-600",
    },
    {
        icon: Palette,
        title: "Graphic Designing",
        description:
            "Eye-catching visuals that communicate your brand message effectively.",
        color: "from-orange-500 to-red-500",
    },
    {
        icon: Globe,
        title: "Web Development",
        description:
            "Fast, responsive, and SEO-friendly websites that convert visitors into customers.",
        color: "from-purple-500 to-indigo-600",
    },
    {
        icon: Send,
        title: "Telegram Ads",
        description:
            "Reach targeted audiences through Telegram channels and groups effectively.",
        color: "from-cyan-500 to-blue-500",
    },
    {
        icon: Smartphone,
        title: "WhatsApp API",
        description:
            "Business API integration for automated messaging and customer support.",
        color: "from-green-500 to-teal-500",
    },
    {
        icon: Video,
        title: "Video Editing",
        description:
            "Professional video editing for ads, reels, and promotional content.",
        color: "from-red-500 to-pink-500",
    },
];

export default function ServicesSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="services" className="relative py-24" ref={ref}>
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
                        Our <span className="gradient-text">Performance Marketing</span>{" "}
                        Services
                    </h2>
                    <p className="section-subtitle">
                        We offer a comprehensive suite of services designed to propel your
                        brand into the digital spotlight
                    </p>
                </motion.div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="glass-card p-6 group cursor-pointer relative overflow-hidden"
                        >
                            {/* Glow Effect on Hover */}
                            <div
                                className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                            />

                            {/* Icon */}
                            <div
                                className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} p-0.5 mb-5`}
                            >
                                <div className="w-full h-full rounded-xl bg-[#0a0a1a] flex items-center justify-center">
                                    <service.icon className="w-6 h-6 text-white" />
                                </div>
                            </div>

                            {/* Content */}
                            <h3
                                className="text-lg font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors"
                                style={{ fontFamily: "var(--font-orbitron)" }}
                            >
                                {service.title}
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                {service.description}
                            </p>

                            {/* Bottom Gradient Line */}
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
