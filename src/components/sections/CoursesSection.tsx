"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Sparkles, CreditCard } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { getCourses } from "@/lib/cms";
import { Course } from "@/types";

export default function CoursesSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const { showToast } = useToast();
    const [courseList, setCourseList] = useState<Course[]>([]);

    useEffect(() => {
        const loadCourses = async () => {
            const fetched = await getCourses();
            if (fetched && fetched.length > 0) {
                const mapped: Course[] = fetched.map((c) => ({
                    ...c,
                    ctaText: c.ctaText || "Enroll Now",
                    badge: c.badge || c.saveBadge,
                    isBundle: c.isBundle || c.title.toLowerCase().includes("bundle"),
                    price: c.mainPrice // Ensure price property exists for UI usage if interface differs
                }));
                // Note: The interface has 'mainPrice', component uses 'price'. 
                // We map 'price' in the object above.
                // However, the Course interface in types.ts has 'price' as optional.
                // We should make sure we use the right property in the UI.
                setCourseList(mapped);
            }
        };
        loadCourses();
    }, []);

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
                    {courseList.map((course, index) => (
                        <motion.div
                            key={course.$id || index}
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
