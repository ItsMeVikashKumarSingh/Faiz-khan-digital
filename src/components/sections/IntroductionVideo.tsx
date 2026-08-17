"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getIntroVideoData } from "@/lib/cms";
import { IntroVideoData } from "@/types";

function formatEmbedUrl(url?: string): string | null {
    if (!url || !url.trim()) return null;
    const cleanUrl = url.trim();

    // YouTube watch URL -> embed URL
    if (cleanUrl.includes("youtube.com/watch?v=")) {
        const videoId = cleanUrl.split("v=")[1]?.split("&")[0];
        if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=0`;
    }
    // YouTube short URL (youtu.be) -> embed URL
    if (cleanUrl.includes("youtu.be/")) {
        const videoId = cleanUrl.split("youtu.be/")[1]?.split("?")[0];
        if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=0`;
    }
    // YouTube Shorts -> embed URL
    if (cleanUrl.includes("youtube.com/shorts/")) {
        const videoId = cleanUrl.split("youtube.com/shorts/")[1]?.split("?")[0];
        if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=0`;
    }
    // Vimeo URL -> player URL
    if (cleanUrl.includes("vimeo.com/") && !cleanUrl.includes("player.vimeo.com")) {
        const vimeoId = cleanUrl.split("vimeo.com/")[1]?.split("?")[0];
        if (vimeoId) return `https://player.vimeo.com/video/${vimeoId}`;
    }

    return cleanUrl;
}

export default function IntroductionVideo() {
    const [videoData, setVideoData] = useState<IntroVideoData>({
        videoUrl: "",
        title: "Watch Introduction",
        subtitle: "Discover how we scale businesses through high-converting performance marketing"
    });

    useEffect(() => {
        const loadIntroVideo = async () => {
            const data = await getIntroVideoData();
            if (data) {
                setVideoData(prev => ({ ...prev, ...data }));
            }
        };
        loadIntroVideo();
    }, []);

    const embedUrl = formatEmbedUrl(videoData.videoUrl);

    // If no video URL is configured, we can keep the sleek placeholder or render an interactive teaser
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
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black/60 shadow-2xl">
                        {embedUrl ? (
                            <iframe
                                src={embedUrl}
                                title={videoData.title || "Introduction Video"}
                                className="w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-purple-950/30 to-black/60">
                                <motion.div
                                    animate={{ scale: [1, 1.08, 1] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-cyan-400/10 backdrop-blur-md flex items-center justify-center border border-cyan-400/30 shadow-[0_0_30px_rgba(0,242,234,0.3)] mb-4"
                                >
                                    <div className="w-0 h-0 border-t-[10px] sm:border-t-[12px] border-t-transparent border-l-[18px] sm:border-l-[22px] border-l-cyan-400 border-b-[10px] sm:border-b-[12px] border-b-transparent ml-1"></div>
                                </motion.div>
                                <h3 className="text-lg sm:text-xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-orbitron)" }}>
                                    {videoData.title || "Watch Strategy In Action"}
                                </h3>
                                <p className="text-xs sm:text-sm text-white/60 max-w-md">
                                    {videoData.subtitle || "Learn how we scale businesses with high-converting ads and proven digital funnels."}
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

