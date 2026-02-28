import { Client, Databases, Account, Storage } from 'appwrite';

const client = new Client();

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

if (endpoint && projectId) {
    client.setEndpoint(endpoint).setProject(projectId);
} else {
    if (typeof window !== 'undefined') {
        console.warn('Appwrite configuration missing. Some features may not work.');
    }
}

export const databases = new Databases(client);
export const account = new Account(client);
export const storage = new Storage(client);

export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

export const COLLECTIONS = {
    SERVICES: process.env.NEXT_PUBLIC_APPWRITE_SERVICES_COLLECTION_ID!,
    PACKAGES: process.env.NEXT_PUBLIC_APPWRITE_PACKAGES_COLLECTION_ID!,
    RESULTS: process.env.NEXT_PUBLIC_APPWRITE_RESULTS_COLLECTION_ID!,
    COURSES: process.env.NEXT_PUBLIC_APPWRITE_COURSES_COLLECTION_ID!,
    STATS: process.env.NEXT_PUBLIC_APPWRITE_STATS_COLLECTION_ID!,
    GLOBALS: process.env.NEXT_PUBLIC_APPWRITE_GLOBALS_COLLECTION_ID!,
    AUDIT_LOGS: process.env.NEXT_PUBLIC_APPWRITE_AUDIT_LOGS_COLLECTION_ID!,
    PREFIX_MSTR: process.env.NEXT_PUBLIC_APPWRITE_PREFIX_MSTR_COLLECTION_ID!,
};

export { client };
