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
const DATABASE_ID = env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const API_KEY = process.env.APPWRITE_API_KEY || env.APPWRITE_API_KEY;

const client = new sdk.Client();
client.setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
const databases = new sdk.Databases(client);

const GLOBALS_DATA = [
    {
        tgm_slug: 'hero',
        tgm_content: JSON.stringify({
            titleLine1: 'Digital Presence',
            titleLine2: 'Reimagined',
            subtitle: 'Transform your brand with expert strategies. Zero guesswork, infinite scalability, and verified results.',
            ctaPrimary: 'Start Building',
            ctaSecondary: 'Explore Services'
        })
    },
    {
        tgm_slug: 'about',
        tgm_content: JSON.stringify({
            title: 'Driving Remarkable Results Through Strategic Advertising',
            description1: "Hey there! 👋 I'm Faiz Khan, your go-to Facebook Ads expert with a proven track record. I've successfully completed over 1000 projects, collaborating with individuals and businesses alike.",
            description2: "With years of hands-on experience, I understand the ever-evolving landscape of digital advertising. From small startups to established enterprises, I've helped my clients achieve their marketing goals with precision and impact.",
            mentorName: 'Faiz Khan',
            mentorRole: 'Facebook Ads Expert & Mentor',
            mentorImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',
            features: [
                'Proven 50Cr+ Ad Spend Management',
                'Custom Funnel & ROAS Optimization',
                '1-on-1 Mentorship & Weekly Audits',
                '1000+ Completed Success Projects'
            ]
        })
    }
];

async function updateGlobals() {
    console.log('🌱 Syncing Globals Master Table with exact DB content...');
    for (const g of GLOBALS_DATA) {
        try {
            const existing = await databases.listDocuments(DATABASE_ID, 'tbl_globals_mstr', [
                sdk.Query.equal('tgm_slug', g.tgm_slug)
            ]);
            if (existing.total > 0) {
                await databases.updateDocument(DATABASE_ID, 'tbl_globals_mstr', existing.documents[0].$id, {
                    tgm_content: g.tgm_content
                });
                console.log(` ✅ Updated global record for slug: ${g.tgm_slug}`);
            } else {
                await databases.createDocument(DATABASE_ID, 'tbl_globals_mstr', sdk.ID.unique(), g);
                console.log(` ✅ Created global record for slug: ${g.tgm_slug}`);
            }
        } catch (e) {
            console.error(` ❌ Error syncing ${g.tgm_slug}:`, e.message || e);
        }
    }
    console.log('✅ Globals Sync Finished Successfully!');
}

updateGlobals();
