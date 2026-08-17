export interface Service {
    $id: string;
    title: string;
    description: string;
    icon: string;
    order: number;
}

export interface PackageFeature {
    text: string;
    included: boolean;
}

export interface Package {
    $id: string;
    name: string;
    price: string;
    features: PackageFeature[];
    isPopular: boolean;
    order: number;
    // UI Helpers
    ctaText?: string;
    highlight?: boolean;
}

export interface Result {
    $id: string;
    type: 'image' | 'video';
    url: string;
    thumbnail?: string; // Optional for image, maybe required for video
    order: number;
    // UI Helpers
    metric?: string; // For ResultsSection cards
    title?: string;
}

export interface Course {
    $id: string;
    title: string;
    description?: string;
    mainPrice: string;
    originalPrice?: string;
    saveBadge?: string; // or badge
    image: string;
    features: string[]; // JSON string array in DB, parsed to string[]
    link: string;
    // UI Helpers
    ctaText?: string;
    badge?: string;
    isBundle?: boolean;
    price?: string; // Mapped from mainPrice
}

export interface Stat {
    $id: string;
    label: string;
    value: string;
    prefix?: string;
    suffix?: string;
    order: number;
    icon?: string; // Add icon support
}

export interface Video {
    $id: string;
    title: string;
    category: string;
    thumbnail?: string;
    url: string;
    youtubeId?: string;
}

export interface HeroData {
    titleLine1?: string;
    titleLine2?: string;
    subtitle?: string;
    ctaPrimary?: string;
    ctaSecondary?: string;
    tagPill?: string;
    // Legacy support
    title?: string;
    ctaText?: string;
    ctaLink?: string;
    videoUrl?: string;
}

export interface AboutData {
    title: string;
    description1: string;
    description2: string;
    mentorName: string;
    mentorRole: string;
    mentorImage: string;
    features?: string[];
}

export interface SiteBranding {
    siteName?: string;
    siteNameHighlight?: string;
    logoUrl?: string;
    faviconUrl?: string;
    tagPill?: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
}

export interface ContactInfo {
    email?: string;
    phone?: string;
    whatsappLink?: string;
    location?: string;
    footerBio?: string;
    copyrightText?: string;
}

export interface SocialLinks {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
}

export interface IntroVideoData {
    videoUrl?: string;
    title?: string;
    subtitle?: string;
}

