"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Zap,
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    Linkedin,
    Mail,
    Phone,
    MapPin,
} from "lucide-react";
import { getSiteBranding, getContactInfo, getSocialLinks } from "@/lib/cms";
import { SiteBranding, ContactInfo, SocialLinks } from "@/types";

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

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const [branding, setBranding] = useState<SiteBranding>({
        siteName: "FAIZ KHAN",
        siteNameHighlight: "DIGITAL",
        logoUrl: ""
    });
    const [contact, setContact] = useState<ContactInfo>({
        email: "faizkhandigital@gmail.com",
        phone: "Available on WhatsApp",
        location: "Based in India, Serving Worldwide",
        footerBio: "Transforming digital presence with cutting-edge marketing strategies and expert guidance. Your success is our mission.",
        copyrightText: "Faiz Khan Digital. All rights reserved."
    });
    const [social, setSocial] = useState<SocialLinks>({
        facebook: "https://facebook.com",
        instagram: "https://instagram.com",
        twitter: "https://twitter.com",
        youtube: "https://youtube.com",
        linkedin: ""
    });

    useEffect(() => {
        const loadFooterData = async () => {
            const [b, c, s] = await Promise.all([
                getSiteBranding(),
                getContactInfo(),
                getSocialLinks()
            ]);
            if (b) setBranding(prev => ({ ...prev, ...b }));
            if (c) setContact(prev => ({ ...prev, ...c }));
            if (s) setSocial(prev => ({ ...prev, ...s }));
        };
        loadFooterData();
    }, []);

    const socialItems = [
        { href: social.facebook, icon: Facebook, label: "Facebook" },
        { href: social.instagram, icon: Instagram, label: "Instagram" },
        { href: social.twitter, icon: Twitter, label: "Twitter" },
        { href: social.youtube, icon: Youtube, label: "YouTube" },
        { href: social.linkedin, icon: Linkedin, label: "LinkedIn" },
    ].filter(item => item.href && item.href.trim() !== "");

    return (
        <footer className="relative border-t border-white/10 mt-10">
            {/* Gradient accent line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-600 to-transparent" />

            <div className="container mx-auto px-4 md:px-6 py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link href="#home" className="flex items-center gap-2 group">
                            {branding.logoUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={branding.logoUrl}
                                    alt={branding.siteName || "Logo"}
                                    className="h-7 w-auto max-w-[150px] object-contain rounded"
                                />
                            ) : (
                                <>
                                    <Zap className="w-5 h-5 text-cyan-400" />
                                    <span className="text-lg font-bold">
                                        {branding.siteName || "FAIZ KHAN"}{" "}
                                        <span className="text-purple-400">
                                            {branding.siteNameHighlight || "DIGITAL"}
                                        </span>
                                    </span>
                                </>
                            )}
                        </Link>
                        <p className="text-white/60 text-sm leading-relaxed">
                            {contact.footerBio || "Transforming digital presence with cutting-edge marketing strategies and expert guidance. Your success is our mission."}
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-3">
                            {socialItems.map((s) => (
                                <motion.a
                                    key={s.label}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-cyan-400 hover:border-cyan-400/50 transition-colors"
                                    aria-label={s.label}
                                >
                                    <s.icon className="w-4 h-4" />
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
                            {contact.email && (
                                <li className="flex items-start gap-3">
                                    <Mail className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                                    <a
                                        href={`mailto:${contact.email}`}
                                        className="text-white/60 text-sm hover:text-white transition-colors"
                                    >
                                        {contact.email}
                                    </a>
                                </li>
                            )}
                            {contact.phone && (
                                <li className="flex items-start gap-3">
                                    <Phone className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                                    {contact.whatsappLink ? (
                                        <a
                                            href={contact.whatsappLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-white/60 text-sm hover:text-cyan-400 transition-colors"
                                        >
                                            {contact.phone}
                                        </a>
                                    ) : (
                                        <span className="text-white/60 text-sm">{contact.phone}</span>
                                    )}
                                </li>
                            )}
                            {contact.location && (
                                <li className="flex items-start gap-3">
                                    <MapPin className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                                    <span className="text-white/60 text-sm">{contact.location}</span>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-white/40 text-sm">
                        © {currentYear} {contact.copyrightText || "Faiz Khan Digital. All rights reserved."}
                    </p>
                    <div className="flex gap-6">
                        <Link
                            href="/privacy-policy"
                            className="text-white/40 hover:text-white/80 text-sm transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/terms-conditions"
                            className="text-white/40 hover:text-white/80 text-sm transition-colors"
                        >
                            Terms of Service
                        </Link>
                        <Link
                            href="/refund-policy"
                            className="text-white/40 hover:text-white/80 text-sm transition-colors"
                        >
                            Refund Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

