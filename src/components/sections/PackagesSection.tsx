"use client";

import { motion } from "framer-motion";
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
    highlight?: boolean;
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
        ctaText: "Select",
    },
    {
        name: "Essential Package",
        isPopular: true,
        highlight: true,
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
        ctaText: "Select",
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
        ctaText: "Contact Us",
    },
];

export default function PackagesSection() {
    return (
        <section id="packages" className="py-12 md:py-24 relative">
            <div className="container mx-auto px-6 md:px-12 lg:px-20">
                <div className="text-center mb-8 md:mb-16">
                    <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-orbitron)" }}>
                        Transparent <span className="gradient-text">Pricing</span>
                    </h2>
                    <p className="text-white/60">
                        No hidden fees. No surprises.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 items-center max-w-6xl mx-auto">
                    {packages.map((pkg, index) => (
                        <motion.div
                            key={pkg.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`glass-card p-10 relative flex flex-col ${pkg.highlight
                                ? "z-10 bg-white/10 border-cyan-400 shadow-[0_0_50px_rgba(0,242,234,0.1)] scale-105"
                                : "opacity-80 scale-100 lg:scale-95 z-0"
                                }`}
                        >
                            {pkg.isPopular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2 items-center bg-[#050510] border border-cyan-400 text-cyan-400 px-4 py-1 rounded-full text-xs uppercase tracking-widest font-bold">
                                    <Sparkles className="w-3 h-3" /> Recommended
                                </div>
                            )}

                            <h3 className="text-2xl font-bold mb-6 text-center" style={{ fontFamily: "var(--font-orbitron)" }}>
                                {pkg.name}
                            </h3>

                            <ul className="mb-8 space-y-0 text-left flex-grow">
                                {pkg.features.map((feature, fIndex) => (
                                    <li key={fIndex} className="py-3 border-b border-white/5 flex items-start gap-3 text-white/70">
                                        {feature.included ? (
                                            <Check className={`w-4 h-4 mt-1 flex-shrink-0 ${pkg.highlight ? 'text-cyan-400' : 'text-white'}`} />
                                        ) : (
                                            <X className="w-4 h-4 mt-1 flex-shrink-0 text-white/30" />
                                        )}
                                        <span className={feature.included ? "" : "opacity-50 line-through"}>{feature.text}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href="#contact"
                                className={`btn-glass w-full justify-center ${pkg.highlight ? 'bg-cyan-400 text-black border-cyan-400 hover:bg-cyan-300' : ''}`}
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
