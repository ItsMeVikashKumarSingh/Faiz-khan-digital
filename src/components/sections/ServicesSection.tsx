/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Service } from "@/types";
import { getServices } from "@/lib/cms";
import * as LucideIcons from "lucide-react";

export default function ServicesSection() {
    const [services, setServices] = useState<Service[]>([]);

    useEffect(() => {
        const loadServices = async () => {
            const fetched = await getServices();
            if (fetched && fetched.length > 0) {
                setServices(fetched);
            }
        };
        loadServices();
    }, []);

    return (
        <section id="services" className="py-12 md:py-24 relative">
            {/* ... rest of the component ... */}
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
                    {services.length === 0 ? (
                        // Simple loading skeleton or nothing
                        <div className="col-span-full text-center text-white/40 py-12">Loading services...</div>
                    ) : (
                        services.map((service, index) => {
                            const IconComponent = (LucideIcons as any)[service.icon] || LucideIcons.HelpCircle;
                            return (
                                <motion.div
                                    key={service.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="glass-card p-8 group hover:bg-white/10 transition-colors"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 text-cyan-400 group-hover:scale-110 transition-transform duration-300 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]">
                                        <IconComponent className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-white" style={{ fontFamily: "var(--font-orbitron)" }}>
                                        {service.title}
                                    </h3>
                                    <p className="text-white/60 leading-relaxed">
                                        {service.description}
                                    </p>
                                </motion.div>
                            );
                        }))}
                </div>
            </div>
        </section>
    );
}
