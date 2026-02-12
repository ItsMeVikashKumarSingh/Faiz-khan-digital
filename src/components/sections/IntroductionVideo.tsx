"use client";

import { motion } from "framer-motion";

export default function IntroductionVideo() {
    return (
        <section className="py-10 md:py-20 relative z-10">
            <div className="container mx-auto px-4 max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="glass-panel p-2 rounded-2xl md:p-4"
                >
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black/50">
                        {/* Placeholder for Video */}
                        <div className="absolute inset-0 flex items-center justify-center text-white/50">
                            <p>Introduction Video Placeholder</p>
                            {/* You would replace this with an iframe or video tag */}
                            {/* Example: <iframe src="https://www.youtube.com/embed/YOUR_VIDEO_ID" className="w-full h-full" ... /> */}
                        </div>

                        {/* Optional Overlay/Play Button design */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                            >
                                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
