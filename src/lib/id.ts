import { databases } from '@/lib/appwrite';
import { Query } from 'appwrite';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const PREFIX_MSTR_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_PREFIX_MSTR_COLLECTION_ID || 'tbl_prefix_mstr';

/**
 * Generates a custom prefixed ID similar to SQL sequences.
 * Matches the behavior of tbl_prefix_mstr logic.
 * 
 * @param tableName The table name to generate ID for (e.g. 'tbl_services_mstr')
 * @returns Prefixed ID (e.g. 'tsm00001')
 */
export async function generatePrefixId(tableName: string): Promise<string> {
    try {
        // 1. Find the prefix master record for this table
        const response = await databases.listDocuments(
            DATABASE_ID,
            PREFIX_MSTR_COLLECTION_ID,
            [Query.equal('tpm_table_name', tableName), Query.limit(1)]
        );

        if (response.documents.length === 0) {
            throw new Error(`Prefix configuration not found for table: ${tableName}`);
        }

        const masterDoc = response.documents[0];

        // 2. Increment the number
        const newNumber = (masterDoc.tpm_last_number || 0) + 1;

        // 3. Update the master record
        await databases.updateDocument(
            DATABASE_ID,
            PREFIX_MSTR_COLLECTION_ID,
            masterDoc.$id,
            {
                tpm_last_number: newNumber
            }
        );

        // 4. Format the ID
        const prefix = masterDoc.tpm_prefix_code;
        const length = masterDoc.tpm_number_length;
        const paddedNumber = String(newNumber).padStart(length, '0');

        return `${prefix}${paddedNumber}`;

    } catch (error) {
        console.error(`Failed to generate ID for ${tableName}:`, error);
        // Fallback to random ID to prevent total blockage, but log error
        // Note: In strict mode, we might want to throw to avoid data inconsistency
        const fallbackId = `ERR-${Date.now()}`;
        console.warn(`Using fallback ID: ${fallbackId}. CHECK PREFIX MASTER TABLE!`);
        return fallbackId;
    }
}
