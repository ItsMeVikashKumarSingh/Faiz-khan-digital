"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Sparkles, CreditCard } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";

interface Course {
    id: number;
    title: string;
    description: string;
    price: string;
    originalPrice: string;
    image: string;
    features: string[];
    ctaText: string;
    badge?: string;
    isBundle?: boolean;
}

const courses: Course[] = [
    {
        id: 1,
        title: "DIGITAL ADS MEGA BUNDLE",
        description:
            "Complete step-by-step training from basic setup to advanced scaling strategies.",
        price: "₹999/-",
        originalPrice: "₹4,999/-",
        image: "https://placehold.co/600x400/9333ea/ffffff?text=Mega+Bundle",
        features: [
            "Messaging Ads Strategy",
            "High-Converting Lead Forms",
            "Affiliate Marketing Blueprint",
            "Selling Digital Products",
            "Telegram Growth Ads",
            "Includes New 2026 Updates",
        ],
        ctaText: "GET INSTANT ACCESS",
        badge: "BEST VALUE",
        isBundle: true,
    },
    {
        id: 2,
        title: "META ADS COURSE",
        description:
            "Master the art of advertising on Meta platforms (Facebook and Instagram).",
        price: "₹4,999/-",
        originalPrice: "₹9,999/-",
        image: "https://placehold.co/600x400/22d3ee/000000?text=Meta+Ads",
        features: [
            "Campaign structure and audience targeting",
            "Create compelling ads with high CTR",
            "Leads, sales, call bookings & retargeting",
            "Step-by-step funnel training",
            "Maximize ROI through tracking",
        ],
        ctaText: "Enroll Now",
    },
    {
        id: 3,
        title: "GOOGLE ADS COURSE",
        description:
            "Master the art of advertising on Google platforms (Youtube & Google).",
        price: "₹4,999/-",
        originalPrice: "₹9,999/-",
        image: "https://placehold.co/600x400/db4a39/ffffff?text=Google+Ads",
        features: [
            "Leads, Sales & Call Booking Strategies",
            "Campaign Structure & Keyword Research",
            "Step-by-Step Funnel Training",
            "Budget Scaling & Smart Bidding",
            "Optimization & ROI Boosting",
        ],
        ctaText: "Enroll Now",
    },
    {
        id: 4,
        title: "WEBSITE DEVELOPMENT",
        description:
            "Build stunning, fast, and SEO-friendly websites without coding.",
        price: "₹4,999/-",
        originalPrice: "₹8,999/-",
        image: "https://placehold.co/600x400/0f9d58/ffffff?text=Web+Dev",
        features: [
            "Learn WordPress & Elementor",
            "Build responsive, mobile-friendly designs",
            "Create landing pages for leads",
            "Domains, hosting, and SSL setup",
            "Beginner friendly - no coding",
        ],
        ctaText: "Enroll Now",
        badge: "NEW",
    },
    {
        id: 5,
        title: "WHATSAPP BUSINESS API",
        description:
            "Everything you need to get started with your business communication.",
        price: "₹9,999/-",
        originalPrice: "₹14,999/-",
        image: "https://placehold.co/600x400/25d366/ffffff?text=WhatsApp+API",
        features: [
            "10,000 Audience Management",
            "10,000 Broadcasting / month via API",
            "Advance Chatflow Builder",
            "Auto Message Campaigns",
            "Chat Inbox with Tickets System",
            "AI Automation for queries",
        ],
        ctaText: "Subscribe Now",
    },
    {
        id: 6,
        title: "US META AGENCY ACCOUNT",
        description: "Premium US-based Meta Agency Account for unlimited advertising.",
        price: "₹16,200/-",
        originalPrice: "₹25,000/-",
        image: "https://placehold.co/600x400/1877f2/ffffff?text=Agency+Account",
        features: [
            "1 AD ACCOUNT with Business Manager",
            "Run Ads on Restricted Category",
            "No GST (18% Saving)",
            "Unlimited Spend - No caps",
            "$100 credit for running ads",
            "24/7 human support",
        ],
        ctaText: "Buy Now",
        badge: "PREMIUM",
    },
];

export default function CoursesSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const { showToast } = useToast();

    const handleEnroll = () => {
        showToast("Payment option not integrated", "info");
    };

    return (
        <section id="courses" className="relative py-24" ref={ref}>
            {/* Background accent */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-6 md:px-8 lg:px-8">
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
                        Our <span className="gradient-text">Premium Courses</span> &
                        Products
                    </h2>
                    <p className="section-subtitle">
                        Master digital marketing and scale your business with our
                        comprehensive solutions
                    </p>
                </motion.div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course, index) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className={`flex flex-col h-full relative overflow-hidden ${course.isBundle
                                ? "border-cyan-500/50 shadow-lg shadow-cyan-500/10"
                                : ""
                                }`}>
                                {/* Badge */}
                                {course.badge && (
                                    <div className="absolute top-4 right-4 z-10">
                                        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-semibold uppercase shadow-lg">
                                            <Sparkles className="w-3 h-3" />
                                            {course.badge}
                                        </div>
                                    </div>
                                )}

                                {/* Image */}
                                <div className="relative w-full h-48 mb-6 rounded-xl overflow-hidden group">
                                    <Image
                                        src={course.image}
                                        alt={course.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                </div>

                                {/* Title */}
                                <h3
                                    className="text-lg font-bold text-white mb-2"
                                    style={{ fontFamily: "var(--font-orbitron)" }}
                                >
                                    {course.title}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>

                                {/* Price */}
                                <div className="mb-6">
                                    <div
                                        className="text-3xl font-bold gradient-text mb-2"
                                        style={{ fontFamily: "var(--font-orbitron)" }}
                                    >
                                        {course.price}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-white/60 line-through text-sm">
                                            {course.originalPrice}
                                        </span>
                                        <span className="text-green-400 text-xs font-semibold px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20 whitespace-nowrap">
                                            SAVE BIG
                                        </span>
                                    </div>
                                </div>

                                {/* Features */}
                                <ul className="space-y-2 mb-6 flex-grow">
                                    {course.features.slice(0, 5).map((feature, fIndex) => (
                                        <li key={fIndex} className="flex items-start gap-2">
                                            <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-300 text-sm">{feature}</span>
                                        </li>
                                    ))}
                                    {course.features.length > 5 && (
                                        <li className="text-purple-400 text-sm pl-6">
                                            +{course.features.length - 5} more features
                                        </li>
                                    )}
                                </ul>

                                {/* CTA Button */}
                                <Button
                                    onClick={handleEnroll}
                                    variant={course.isBundle ? "primary" : "secondary"}
                                    icon={<CreditCard className="w-4 h-4" />}
                                    className="w-full"
                                >
                                    {course.ctaText}
                                </Button>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
