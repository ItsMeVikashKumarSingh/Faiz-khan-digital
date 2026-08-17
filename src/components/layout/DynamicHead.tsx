"use client";

import { useEffect } from "react";
import { getSiteBranding } from "@/lib/cms";

export default function DynamicHead() {
    useEffect(() => {
        const applyBranding = async () => {
            const branding = await getSiteBranding();
            if (!branding) return;

            // Dynamically update document title if custom metaTitle provided
            if (branding.metaTitle) {
                document.title = branding.metaTitle;
            }

            // Dynamically update favicon link tag if custom faviconUrl provided
            if (branding.faviconUrl) {
                let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
                if (!link) {
                    link = document.createElement("link");
                    link.rel = "icon";
                    document.getElementsByTagName("head")[0].appendChild(link);
                }
                link.href = branding.faviconUrl;
            }
        };

        applyBranding();
    }, []);

    return null;
}
