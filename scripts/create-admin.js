const sdk = require('node-appwrite');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
    console.error('ERROR: .env.local file not found');
    process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach((line) => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

const ENDPOINT = env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const PROJECT_ID = env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY || env.APPWRITE_API_KEY;

if (!PROJECT_ID || !API_KEY) {
    console.error('ERROR: Missing Appwrite configuration');
    process.exit(1);
}

const client = new sdk.Client();
client.setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
const users = new sdk.Users(client);

async function createAdminUser() {
    const email = 'admin@faizkhandigital.com';
    const password = 'AdminPassword123!';
    const name = 'Faiz Khan Admin';

    console.log(`🚀 Creating/Verifying Admin User: ${email}...`);

    try {
        const userList = await users.list([sdk.Query.equal('email', email)]);
        if (userList.total > 0) {
            console.log(`✅ Admin user already exists (ID: ${userList.users[0].$id})`);
            // Update password to ensure it matches
            await users.updatePassword(userList.users[0].$id, password);
            console.log(`🔑 Admin password updated to: ${password}`);
        } else {
            const user = await users.create(sdk.ID.unique(), email, undefined, password, name);
            console.log(`✅ Admin user created successfully (ID: ${user.$id})`);
        }
        console.log(`\n---------------------------------------`);
        console.log(`CREDENTIALS FOR ADMIN PORTAL:`);
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log(`---------------------------------------\n`);
    } catch (error) {
        console.error('❌ Error creating admin user:', error.message || error);
    }
}

createAdminUser();
