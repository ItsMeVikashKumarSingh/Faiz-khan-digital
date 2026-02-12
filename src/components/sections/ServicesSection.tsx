"use client";

import { motion } from "framer-motion";
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
    },
    {
        icon: Instagram,
        title: "Instagram Ads",
        description:
            "Visual storytelling and influencer marketing to engage your audience effectively.",
    },
    {
        icon: Chrome,
        title: "Google Ads",
        description:
            "Search and display advertising to capture high-intent customers at the right moment.",
    },
    {
        icon: MessageSquare,
        title: "WhatsApp Marketing",
        description:
            "Personalized messaging and automation for higher engagement and conversions.",
    },
    {
        icon: Palette,
        title: "Graphic Designing",
        description:
            "Eye-catching visuals that communicate your brand message effectively.",
    },
    {
        icon: Globe,
        title: "Web Development",
        description:
            "Fast, responsive, and SEO-friendly websites that convert visitors into customers.",
    },
    {
        icon: Send,
        title: "Telegram Ads",
        description:
            "Reach targeted audiences through Telegram channels and groups effectively.",
    },
    {
        icon: Smartphone,
        title: "WhatsApp API",
        description:
            "Business API integration for automated messaging and customer support.",
    },
    {
        icon: Video,
        title: "Video Editing",
        description:
            "Professional video editing for ads, reels, and promotional content.",
    },
];

export default function ServicesSection() {
    return (
        <section id="services" className="py-12 md:py-24 relative">
            <div className="container mx-auto px-6 md:px-12 lg:px-20">
                <div className="text-center mb-8 md:mb-16">
                    <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-orbitron)" }}>
                        Our <span className="gradient-text">Services</span>
                    </h2>
                    <p className="text-white/60 max-w-2xl mx-auto">
                        Comprehensive digital solutions tailored for your growth.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="glass-card p-8 group hover:bg-white/10 transition-colors"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 text-cyan-400 group-hover:scale-110 transition-transform duration-300 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]">
                                <service.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white" style={{ fontFamily: "var(--font-orbitron)" }}>
                                {service.title}
                            </h3>
                            <p className="text-white/60 leading-relaxed">
                                {service.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
