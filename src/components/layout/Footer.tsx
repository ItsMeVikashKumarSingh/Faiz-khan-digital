"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    Zap,
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    Mail,
    Phone,
    MapPin,
} from "lucide-react";

const quickLinks = [
    { href: "#home", label: "Home" },
    { href: "#services", label: "Services" },
    { href: "#packages", label: "Packages" },
    { href: "#results", label: "Results" },
    { href: "#courses", label: "Courses" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" },
];

const services = [
    { href: "#services", label: "Facebook Ads" },
    { href: "#services", label: "Instagram Ads" },
    { href: "#services", label: "Google Ads" },
    { href: "#services", label: "WhatsApp Marketing" },
    { href: "#services", label: "Web Development" },
    { href: "#services", label: "Video Editing" },
];

const socialLinks = [
    { href: "#", icon: Facebook, label: "Facebook" },
    { href: "#", icon: Instagram, label: "Instagram" },
    { href: "#", icon: Twitter, label: "Twitter" },
    { href: "#", icon: Youtube, label: "YouTube" },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative border-t border-white/10 mt-10">
            {/* Gradient accent line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-600 to-transparent" />

            <div className="container mx-auto px-4 md:px-6 py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link href="#home" className="flex items-center gap-2 group">
                            <Zap className="w-5 h-5 text-cyan-400" />
                            <span className="text-lg font-bold">
                                FAIZ KHAN <span className="text-purple-400">DIGITAL</span>
                            </span>
                        </Link>
                        <p className="text-white/60 text-sm leading-relaxed">
                            Transforming digital presence with cutting-edge marketing
                            strategies and expert guidance. Your success is our mission.
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-cyan-400 hover:border-cyan-400/50 transition-colors"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-4 h-4" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 text-sm">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-white/60 hover:text-purple-400 transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 text-sm">
                            Our Services
                        </h3>
                        <ul className="space-y-2">
                            {services.map((service, index) => (
                                <li key={index}>
                                    <Link
                                        href={service.href}
                                        className="text-white/60 hover:text-cyan-400 transition-colors text-sm"
                                    >
                                        {service.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 text-sm">
                            Contact Info
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <Mail className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                                <span className="text-white/60 text-sm">
                                    faizkhandigital@gmail.com
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Phone className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                                <span className="text-white/60 text-sm">
                                    Available on WhatsApp
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                                <span className="text-white/60 text-sm">Based in India</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-white/40 text-sm">
                        © {currentYear} Faiz Khan Digital. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link
                            href="#"
                            className="text-white/40 hover:text-white/80 text-sm transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="#"
                            className="text-white/40 hover:text-white/80 text-sm transition-colors"
                        >
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
