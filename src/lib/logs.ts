import { databases } from '@/lib/appwrite';
import { generatePrefixId } from '@/lib/id';
import { Query } from 'appwrite';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const AUDIT_LOGS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_AUDIT_LOGS_COLLECTION_ID || 'tbl_audit_logs';

export type AuditSeverity = 'info' | 'warning' | 'critical';

export interface AuditLogParams {
    action: string;
    target_resource: string;
    payload: Record<string, unknown>;
    severity: AuditSeverity;
}

export async function logAuditAction(params: AuditLogParams) {
    try {
        // Generate Custom ID
        const logId = await generatePrefixId(AUDIT_LOGS_COLLECTION_ID);

        // Get rudimentary client info if client-side
        const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : 'server';

        await databases.createDocument(
            DATABASE_ID,
            AUDIT_LOGS_COLLECTION_ID,
            logId,
            {
                tal_admin_id: 'system', // Replace with actual user ID where available
                tal_action: params.action,
                tal_target_resource: params.target_resource,
                tal_payload: JSON.stringify(params.payload),
                tal_ip_address: '0.0.0.0', // Placeholder
                tal_user_agent: userAgent,
                tal_severity: params.severity,
                tal_timestamp: new Date().toISOString(),
            }
        );
    } catch (error) {
        console.error('Failed to log audit action:', error);
    }
}

export async function getAuditLogs(limit = 50) {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            AUDIT_LOGS_COLLECTION_ID,
            [
                Query.orderDesc('tal_timestamp'),
                Query.limit(limit)
            ]
        );
        return response.documents;
    } catch (error) {
        console.error('Failed to fetch audit logs:', error);
        return [];
    }
}
