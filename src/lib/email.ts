export async function sendEmail({
    to,
    subject,
    html,
}: {
    to: { email: string; name?: string }[];
    subject: string;
    html: string;
}) {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.SENDER_EMAIL || 'admin@faizkhandigital.com';
    const senderName = process.env.SENDER_NAME || 'Faiz Khan Digital Admin';

    if (!apiKey) {
        console.warn('⚠️ BREVO_API_KEY not found. Email not sent:', subject);
        return { success: false, error: 'Missing API Key' };
    }

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'api-key': apiKey,
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                sender: { name: senderName, email: senderEmail },
                to: to,
                subject: subject,
                htmlContent: html,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Brevo Error:', error);
            return { success: false, error };
        }

        return { success: true };
    } catch (error) {
        console.error('Failed to send email:', error);
        return { success: false, error };
    }
}
