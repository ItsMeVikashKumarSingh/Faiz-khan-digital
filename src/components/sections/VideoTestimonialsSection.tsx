"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";

interface Video {
    id: number;
    title: string;
    category: string;
    thumbnail?: string;
    youtubeId?: string;
}

const videos: Video[] = [
    { id: 1, title: "Meta Ads Success", category: "Meta Ads" },
    { id: 2, title: "Student Success #1", category: "Student" },
    { id: 3, title: "Client Campaign", category: "Client" },
    { id: 4, title: "Google Ads Win", category: "Google Ads" },
    { id: 5, title: "Performance", category: "Analysis" },
    { id: 6, title: "Top Campaign", category: "Best Results" },
];

export default function VideoTestimonialsSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

    return (
        <section className="relative py-24" ref={ref}>
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
                        Real <span className="gradient-text">Video Results</span>
                    </h2>
                    <p className="section-subtitle">
                        Watch our campaign successes & student achievements
                    </p>
                </motion.div>

                {/* Videos Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    {videos.map((video, index) => (
                        <motion.div
                            key={video.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            onClick={() => setSelectedVideo(video)}
                            className="glass-card aspect-video relative overflow-hidden cursor-pointer group"
                        >
                            {/* Placeholder/Thumbnail */}
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-cyan-900/50" />

                            {/* Play Button */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-purple-600/80 transition-colors"
                                >
                                    <Play className="w-6 h-6 text-white ml-1" />
                                </motion.div>
                            </div>

                            {/* Category Badge */}
                            <div className="absolute top-3 left-3">
                                <span className="px-2 py-1 text-xs font-medium bg-black/50 backdrop-blur-sm rounded-md text-white">
                                    {video.category}
                                </span>
                            </div>

                            {/* Title */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                <p className="text-white text-sm font-medium">{video.title}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Video Modal */}
            <AnimatePresence>
                {selectedVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                        onClick={() => setSelectedVideo(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-4xl aspect-video bg-[#0a0a1a] rounded-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedVideo(null)}
                                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>

                            {/* Placeholder - Replace with actual video embed */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                                <Play className="w-16 h-16 text-purple-400 mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">
                                    {selectedVideo.title}
                                </h3>
                                <p className="text-gray-400">
                                    Video content will be embedded here
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
