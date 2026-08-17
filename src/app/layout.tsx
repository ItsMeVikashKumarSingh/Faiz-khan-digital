import type { Metadata } from "next";
import { Orbitron, Outfit } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import DynamicHead from "@/components/layout/DynamicHead";
import { ToastProvider } from "@/components/ui/Toast";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Faiz Khan Digital | Premium Digital Marketing Services",
  description: "Transform your digital presence with Faiz Khan Digital. Expert marketing strategies for verified results. 3+ years experience, 50+ brands served.",
  keywords: "digital marketing, facebook ads, instagram ads, google ads, performance marketing, growth marketing, faiz khan digital",
  openGraph: {
    title: "Faiz Khan Digital | Premium Digital Marketing Services",
    description: "Transform your digital presence with Faiz Khan Digital. Expert marketing strategies for verified results.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${orbitron.variable} antialiased`}
        style={{ fontFamily: "var(--font-outfit), sans-serif" }}
      >
        <ToastProvider>
          <DynamicHead />
          <ConditionalLayout>{children}</ConditionalLayout>
        </ToastProvider>
      </body>
    </html>
  );
}


