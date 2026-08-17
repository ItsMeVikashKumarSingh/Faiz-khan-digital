import { databases, DATABASE_ID, COLLECTIONS } from './appwrite';
import { Query } from 'appwrite';
import { Service, Package, Result, Course, Stat, HeroData, AboutData } from '@/types';

/* =========================================
   Caching Logic (No Fallbacks)
   ========================================= */
const CACHE_PREFIX = 'cms_cache_';

interface CacheItem<T> {
    data: T;
    timestamp: number;
}

function getCached<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    try {
        const itemStr = localStorage.getItem(CACHE_PREFIX + key);
        if (!itemStr) return null;
        const item: CacheItem<T> = JSON.parse(itemStr);
        return item.data;
    } catch {
        return null;
    }
}

function setCached<T>(key: string, data: T) {
    if (typeof window === 'undefined') return;
    try {
        const item: CacheItem<T> = {
            data,
            timestamp: Date.now()
        };
        localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item));
    } catch (e) {
        console.warn('LocalStorage cache failed', e);
    }
}

/* =========================================
   CMS Functions
   ========================================= */

// Hero Data (from tbl_globals_mstr)
export const getHeroData = async (): Promise<HeroData | null> => {
    const cacheKey = 'hero_data';
    const cached = getCached<HeroData>(cacheKey);

    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.GLOBALS,
            [Query.equal('tgm_slug', 'hero')]
        );
        if (response.documents.length > 0) {
            const data = JSON.parse(response.documents[0].tgm_content);
            setCached(cacheKey, data);
            return data;
        }
        return cached || null;
    } catch (error) {
        console.error('Error fetching hero data:', error);
        return cached || null;
    }
};

// Services (from tbl_services_mstr)
export const getServices = async (): Promise<Service[]> => {
    const cacheKey = 'services';
    const cached = getCached<Service[]>(cacheKey);

    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.SERVICES,
            [Query.orderAsc('tsm_order')]
        );
        // Map attributes
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: Service[] = response.documents.map((doc: any) => ({
            $id: doc.$id,
            title: doc.tsm_title,
            description: doc.tsm_description,
            icon: doc.tsm_icon,
            order: doc.tsm_order
        }));

        setCached(cacheKey, data);
        return data;
    } catch (error) {
        console.error('Error fetching services:', error);
        return cached || [];
    }
};

// Packages (from tbl_packages_mstr)
export const getPackages = async (): Promise<Package[]> => {
    const cacheKey = 'packages';
    const cached = getCached<Package[]>(cacheKey);

    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.PACKAGES,
            [Query.orderAsc('tpm_order')]
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: Package[] = response.documents.map((doc: any) => ({
            $id: doc.$id,
            name: doc.tpm_name,
            price: doc.tpm_price,
            features: JSON.parse(doc.tpm_features),
            isPopular: doc.tpm_is_popular,
            order: doc.tpm_order
        }));

        setCached(cacheKey, data);
        return data;
    } catch (error) {
        console.error('Error fetching packages:', error);
        return cached || [];
    }
};

// Results (from tbl_results)
export const getResults = async (): Promise<Result[]> => {
    const cacheKey = 'results';
    const cached = getCached<Result[]>(cacheKey);

    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.RESULTS,
            [Query.orderAsc('tr_order')]
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: Result[] = response.documents.map((doc: any) => ({
            $id: doc.$id,
            type: doc.tr_type as 'image' | 'video',
            url: doc.tr_url,
            thumbnail: doc.tr_thumbnail,
            order: doc.tr_order,
            metric: doc.tr_metric || undefined, // Maybe add to schema if needed
            title: doc.tr_title || undefined
        }));

        setCached(cacheKey, data);
        return data;
    } catch (error) {
        console.error('Error fetching results:', error);
        return cached || [];
    }
};

// Videos (subset of results)
export const getVideos = async (): Promise<Result[]> => {
    const cacheKey = 'videos';
    const cached = getCached<Result[]>(cacheKey);

    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.RESULTS,
            [Query.equal('tr_type', 'video'), Query.orderAsc('tr_order')]
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: Result[] = response.documents.map((doc: any) => ({
            $id: doc.$id,
            type: doc.tr_type as 'image' | 'video',
            url: doc.tr_url,
            thumbnail: doc.tr_thumbnail,
            order: doc.tr_order
        }));

        setCached(cacheKey, data);
        return data;
    } catch (error) {
        console.error('Error fetching videos:', error);
        return cached || [];
    }
};

// Courses (from tbl_courses_mstr)
export const getCourses = async (): Promise<Course[]> => {
    const cacheKey = 'courses';
    const cached = getCached<Course[]>(cacheKey);

    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.COURSES
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: Course[] = response.documents.map((doc: any) => ({
            $id: doc.$id,
            title: doc.tcm_title,
            mainPrice: doc.tcm_main_price,
            originalPrice: doc.tcm_original_price,
            saveBadge: doc.tcm_save_badge,
            image: doc.tcm_image,
            features: JSON.parse(doc.tcm_features),
            link: doc.tcm_link,
            isBundle: doc.tcm_title.toLowerCase().includes('bundle')
        }));

        setCached(cacheKey, data);
        return data;
    } catch (error) {
        console.error('Error fetching courses:', error);
        return cached || [];
    }
};

// Stats (from tbl_stats_mstr)
export const getStats = async (): Promise<Stat[]> => {
    const cacheKey = 'stats';
    const cached = getCached<Stat[]>(cacheKey);

    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.STATS,
            [Query.orderAsc('tsm_order')]
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: Stat[] = response.documents.map((doc: any) => ({
            $id: doc.$id,
            label: doc.tsm_label,
            value: doc.tsm_value,
            prefix: doc.tsm_prefix,
            suffix: doc.tsm_suffix,
            order: doc.tsm_order,
            icon: doc.tsm_icon
        }));

        setCached(cacheKey, data);
        return data;
    } catch (error) {
        console.error('Error fetching stats:', error);
        return cached || [];
    }
};

// About Data (from tbl_globals_mstr)
export const getAboutData = async (): Promise<AboutData | null> => {
    const cacheKey = 'about_data';
    const cached = getCached<AboutData>(cacheKey);

    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.GLOBALS,
            [Query.equal('tgm_slug', 'about')]
        );
        if (response.documents.length > 0) {
            const data = JSON.parse(response.documents[0].tgm_content);
            setCached(cacheKey, data);
            return data;
        }
        return cached || null;
    } catch (error) {
        console.error('Error fetching about data:', error);
        return cached || null;
    }
};

// Site Branding (from tbl_globals_mstr slug 'branding')
export const getSiteBranding = async (): Promise<import('@/types').SiteBranding | null> => {
    const cacheKey = 'site_branding';
    const cached = getCached<import('@/types').SiteBranding>(cacheKey);

    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.GLOBALS,
            [Query.equal('tgm_slug', 'branding')]
        );
        if (response.documents.length > 0) {
            const data = JSON.parse(response.documents[0].tgm_content);
            setCached(cacheKey, data);
            return data;
        }
        return cached || null;
    } catch (error) {
        console.error('Error fetching site branding:', error);
        return cached || null;
    }
};

// Contact Info (from tbl_globals_mstr slug 'contact')
export const getContactInfo = async (): Promise<import('@/types').ContactInfo | null> => {
    const cacheKey = 'contact_info';
    const cached = getCached<import('@/types').ContactInfo>(cacheKey);

    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.GLOBALS,
            [Query.equal('tgm_slug', 'contact')]
        );
        if (response.documents.length > 0) {
            const data = JSON.parse(response.documents[0].tgm_content);
            setCached(cacheKey, data);
            return data;
        }
        return cached || null;
    } catch (error) {
        console.error('Error fetching contact info:', error);
        return cached || null;
    }
};

// Social Links (from tbl_globals_mstr slug 'social')
export const getSocialLinks = async (): Promise<import('@/types').SocialLinks | null> => {
    const cacheKey = 'social_links';
    const cached = getCached<import('@/types').SocialLinks>(cacheKey);

    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.GLOBALS,
            [Query.equal('tgm_slug', 'social')]
        );
        if (response.documents.length > 0) {
            const data = JSON.parse(response.documents[0].tgm_content);
            setCached(cacheKey, data);
            return data;
        }
        return cached || null;
    } catch (error) {
        console.error('Error fetching social links:', error);
        return cached || null;
    }
};

// Intro Video (from tbl_globals_mstr slug 'intro_video')
export const getIntroVideoData = async (): Promise<import('@/types').IntroVideoData | null> => {
    const cacheKey = 'intro_video';
    const cached = getCached<import('@/types').IntroVideoData>(cacheKey);

    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.GLOBALS,
            [Query.equal('tgm_slug', 'intro_video')]
        );
        if (response.documents.length > 0) {
            const data = JSON.parse(response.documents[0].tgm_content);
            setCached(cacheKey, data);
            return data;
        }
        return cached || null;
    } catch (error) {
        console.error('Error fetching intro video:', error);
        return cached || null;
    }
};

