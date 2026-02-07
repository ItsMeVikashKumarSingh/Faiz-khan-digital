"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, X, Sparkles } from "lucide-react";
import Link from "next/link";

interface PackageFeature {
    text: string;
    included: boolean;
}

interface Package {
    name: string;
    isPopular?: boolean;
    features: PackageFeature[];
    ctaText: string;
}

const packages: Package[] = [
    {
        name: "Basic Package",
        features: [
            { text: "Lead generation ads", included: true },
            { text: "Creative ads editing", included: true },
            { text: "Unlimited Sales ads", included: true },
            { text: "WhatsApp support", included: true },
            { text: "WhatsApp and call support", included: true },
            { text: "Run your ads 7 days", included: true },
            { text: "Need Facebook account", included: false },
        ],
        ctaText: "Get Started",
    },
    {
        name: "Essential Package",
        isPopular: true,
        features: [
            { text: "Lead generation ads", included: true },
            { text: "Online followers campaign", included: true },
            { text: "Affiliate/Network/MLM Marketing", included: true },
            { text: "Telegram/Dropshipping/Astrology Ads", included: true },
            { text: "Creative ads editing", included: true },
            { text: "Unlimited Sales ads", included: true },
            { text: "WhatsApp support", included: true },
            { text: "WhatsApp & call support", included: true },
            { text: "Account manager", included: true },
            { text: "Run your ads 15 days", included: true },
            { text: "NO Need Facebook account", included: true },
        ],
        ctaText: "Get Started",
    },
    {
        name: "Pro Package",
        features: [
            { text: "Lead generation ads", included: true },
            { text: "Online followers campaign", included: true },
            { text: "Affiliate/Network/MLM Marketing", included: true },
            { text: "Telegram/Dropshipping/Astrology Ads", included: true },
            { text: "Creative ads editing", included: true },
            { text: "Unlimited Sales ads", included: true },
            { text: "Landing page-personal ads manager", included: true },
            { text: "WhatsApp, calling & weekly zoom support", included: true },
            { text: "2 dedicated ads managers", included: true },
            { text: "Account manager", included: true },
            { text: "Run your ads 30 days", included: true },
        ],
        ctaText: "Get Started",
    },
];

export default function PackagesSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="packages" className="relative py-24" ref={ref}>
            {/* Background accent */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-3xl" />
            </div>

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
                        Our <span className="gradient-text">Service Packages</span>
                    </h2>
                    <p className="section-subtitle">
                        Choose the perfect package for your business needs
                    </p>
                </motion.div>

                {/* Packages Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {packages.map((pkg, index) => (
                        <motion.div
                            key={pkg.name}
                            initial={{ opacity: 0, y: 40 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.15 }}
                            className={`relative glass-card p-8 flex flex-col ${pkg.isPopular
                                ? "border-purple-500/50 shadow-lg shadow-purple-500/20"
                                : ""
                                }`}
                        >
                            {/* Popular Badge */}
                            {pkg.isPopular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-semibold uppercase tracking-wide">
                                        <Sparkles className="w-3.5 h-3.5" />
                                        Most Popular
                                    </div>
                                </div>
                            )}

                            {/* Package Name */}
                            <h3
                                className="text-xl font-bold text-white mb-6 text-center"
                                style={{ fontFamily: "var(--font-orbitron)" }}
                            >
                                {pkg.name}
                            </h3>

                            {/* Features List */}
                            <ul className="space-y-3 mb-8 flex-grow">
                                {pkg.features.map((feature, fIndex) => (
                                    <li key={fIndex} className="flex items-start gap-3">
                                        {feature.included ? (
                                            <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                        ) : (
                                            <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                        )}
                                        <span
                                            className={`text-sm ${feature.included ? "text-gray-300" : "text-gray-500"
                                                }`}
                                        >
                                            {feature.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA Button */}
                            <Link
                                href="#contact"
                                className={`w-full py-3 rounded-xl font-semibold text-center transition-all ${pkg.isPopular
                                    ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white hover:shadow-lg hover:shadow-purple-500/25"
                                    : "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-purple-500/50"
                                    }`}
                            >
                                {pkg.ctaText}
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
