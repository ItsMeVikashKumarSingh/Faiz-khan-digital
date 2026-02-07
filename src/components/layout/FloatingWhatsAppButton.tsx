"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function FloatingWhatsAppButton() {
    return (
        <motion.a
            href="https://wa.link/uwwdyh"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-8 right-8 z-50 rounded-full w-14 h-14 md:w-16 md:h-16 bg-[#25D366] flex items-center justify-center shadow-lg shadow-green-500/30 overflow-hidden"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Chat on WhatsApp"
        >
            <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity" />
            <div className="absolute inset-0 rounded-full animate-ping bg-[#25D366] opacity-30" />
            <MessageCircle className="w-7 h-7 md:w-8 md:h-8 text-white fill-white" />
        </motion.a>
    );
}
