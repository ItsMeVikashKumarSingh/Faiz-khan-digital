import { account } from '@/lib/appwrite';
import { logAuditAction } from '@/lib/logs';

// Get current session
export async function getCurrentUser() {
    try {
        return await account.get();
    } catch {
        return null;
    }
}

// Login
export async function login(email: string, password: string) {
    try {
        await account.createEmailPasswordSession(email, password);
        const user = await account.get();

        await logAuditAction({
            action: 'LOGIN',
            target_resource: `User: ${email}`,
            payload: { userId: user.$id },
            severity: 'info'
        });

        return { success: true, user };
    } catch (error: Error | unknown) {
        console.error('Login error:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        await logAuditAction({
            action: 'LOGIN_FAILED',
            target_resource: `Attempt: ${email}`,
            payload: { error: errorMessage },
            severity: 'warning'
        });
        return { success: false, error: errorMessage };
    }
}

// Logout
export async function logout() {
    try {
        const user = await getCurrentUser();
        await account.deleteSession('current');

        if (user) {
            await logAuditAction({
                action: 'LOGOUT',
                target_resource: `User: ${user.email}`,
                payload: { userId: user.$id },
                severity: 'info'
            });
        }
        return { success: true };
    } catch (error: Error | unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, error: errorMessage };
    }
}
