"use client";

import { motion } from "framer-motion";

export default function OrbsBackground() {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
            <motion.div
                className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full opacity-60 blur-[100px]"
                style={{ background: "radial-gradient(circle, #4f46e5, #0f172a)" }}
                animate={{
                    x: [0, 50, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full opacity-60 blur-[100px]"
                style={{ background: "radial-gradient(circle, #ec4899, #7c3aed)" }}
                animate={{
                    x: [0, -50, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute top-[40%] left-[40%] w-[30vw] h-[30vw] rounded-full opacity-60 blur-[100px]"
                style={{ background: "radial-gradient(circle, #00f2ea, #0ea5e9)" }}
                animate={{
                    x: [0, 30, 0],
                    y: [0, -30, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                }}
            />
        </div>
    );
}
