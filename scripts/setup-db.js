/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */
const sdk = require('node-appwrite');
const fs = require('fs');
const path = require('path');

// 1. Load Environment Variables
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
    console.error('ERROR: .env.local file not found at', envPath);
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
// Prioritize APPWRITE_API_KEY from process env, fallback to .env
const API_KEY = process.env.APPWRITE_API_KEY || env.APPWRITE_API_KEY;

if (!PROJECT_ID || !API_KEY || !DATABASE_ID) {
    console.error('ERROR: Missing Appwrite configuration.');
    console.error('Required: NEXT_PUBLIC_APPWRITE_PROJECT_ID, NEXT_PUBLIC_APPWRITE_DATABASE_ID, APPWRITE_API_KEY');
    process.exit(1);
}

const client = new sdk.Client();
client.setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
const databases = new sdk.Databases(client);

// 2. Schema Definition (Standardized)
const COLLECTIONS = [
    {
        id: 'tbl_prefix_mstr',
        name: 'Prefix Master',
        prefix: 'tpm',
        attributes: [
            { key: 'tpm_table_name', type: 'string', size: 50, required: true },
            { key: 'tpm_prefix_code', type: 'string', size: 10, required: true },
            { key: 'tpm_number_length', type: 'integer', required: true },
            { key: 'tpm_last_number', type: 'integer', required: true },
        ],
        indexes: [
            { key: 'idx_table_name', type: 'unique', attributes: ['tpm_table_name'] }
        ],
        publicRead: false
    },
    {
        id: 'tbl_audit_logs',
        name: 'Audit Logs',
        prefix: 'tal',
        attributes: [
            { key: 'tal_admin_id', type: 'string', size: 255, required: true },
            { key: 'tal_action', type: 'string', size: 255, required: true },
            { key: 'tal_target_resource', type: 'string', size: 255, required: true },
            { key: 'tal_payload', type: 'string', size: 5000, required: false },
            { key: 'tal_ip_address', type: 'string', size: 50, required: false },
            { key: 'tal_user_agent', type: 'string', size: 255, required: false },
            { key: 'tal_severity', type: 'string', size: 20, required: true },
            { key: 'tal_timestamp', type: 'string', size: 50, required: true },
        ],
        indexes: [
            { key: 'idx_timestamp', type: 'key', attributes: ['tal_timestamp'] }
        ],
        publicRead: false
    },
    {
        id: 'tbl_services_mstr',
        name: 'Services Master',
        prefix: 'tsm',
        attributes: [
            { key: 'tsm_title', type: 'string', size: 255, required: true },
            { key: 'tsm_description', type: 'string', size: 1000, required: true },
            { key: 'tsm_icon', type: 'string', size: 100, required: true },
            { key: 'tsm_order', type: 'integer', required: false, default: 0 },
        ],
        publicRead: true
    },
    {
        id: 'tbl_packages_mstr',
        name: 'Packages Master',
        prefix: 'tpm',
        attributes: [
            { key: 'tpm_name', type: 'string', size: 255, required: true },
            { key: 'tpm_price', type: 'string', size: 100, required: true },
            { key: 'tpm_features', type: 'string', size: 2000, required: true }, // JSON array
            { key: 'tpm_is_popular', type: 'boolean', required: false, default: false },
            { key: 'tpm_order', type: 'integer', required: false, default: 0 },
        ],
        publicRead: true
    },
    {
        id: 'tbl_results',
        name: 'Results',
        prefix: 'tr',
        attributes: [
            { key: 'tr_type', type: 'string', size: 50, required: true },
            { key: 'tr_url', type: 'string', size: 2000, required: true },
            { key: 'tr_thumbnail', type: 'string', size: 2000, required: false },
            { key: 'tr_title', type: 'string', size: 255, required: false },
            { key: 'tr_metric', type: 'string', size: 255, required: false },
            { key: 'tr_order', type: 'integer', required: false, default: 0 },
        ],
        publicRead: true
    },
    {
        id: 'tbl_courses_mstr',
        name: 'Courses Master',
        prefix: 'tcm',
        attributes: [
            { key: 'tcm_title', type: 'string', size: 255, required: true },
            { key: 'tcm_main_price', type: 'string', size: 100, required: true },
            { key: 'tcm_original_price', type: 'string', size: 100, required: false },
            { key: 'tcm_save_badge', type: 'string', size: 100, required: false },
            { key: 'tcm_image', type: 'string', size: 2000, required: true },
            { key: 'tcm_features', type: 'string', size: 2000, required: true }, // JSON array
            { key: 'tcm_link', type: 'string', size: 2000, required: true },
        ],
        publicRead: true
    },
    {
        id: 'tbl_stats_mstr',
        name: 'Stats Master',
        prefix: 'tsm', // Note: Same prefix as Services (TSM), but different table. IDs will be unique per table.
        attributes: [
            { key: 'tsm_label', type: 'string', size: 255, required: true },
            { key: 'tsm_value', type: 'string', size: 50, required: true },
            { key: 'tsm_prefix', type: 'string', size: 20, required: false },
            { key: 'tsm_suffix', type: 'string', size: 20, required: false },
            { key: 'tsm_icon', type: 'string', size: 50, required: false },
            { key: 'tsm_order', type: 'integer', required: false, default: 0 },
        ],
        publicRead: true
    },
    {
        id: 'tbl_globals_mstr',
        name: 'Globals Master',
        prefix: 'tgm',
        attributes: [
            { key: 'tgm_slug', type: 'string', size: 100, required: true },
            { key: 'tgm_content', type: 'string', size: 5000, required: true }, // JSON content
        ],
        indexes: [
            { key: 'idx_slug', type: 'unique', attributes: ['tgm_slug'] }
        ],
        publicRead: true
    },
];

const PREFIX_SEEDS = [
    { tpm_table_name: 'tbl_services_mstr', tpm_prefix_code: 'tsm', tpm_number_length: 5, tpm_last_number: 0 },
    { tpm_table_name: 'tbl_packages_mstr', tpm_prefix_code: 'tpm', tpm_number_length: 5, tpm_last_number: 0 },
    { tpm_table_name: 'tbl_results', tpm_prefix_code: 'tr', tpm_number_length: 5, tpm_last_number: 0 },
    { tpm_table_name: 'tbl_courses_mstr', tpm_prefix_code: 'tcm', tpm_number_length: 5, tpm_last_number: 0 },
    { tpm_table_name: 'tbl_stats_mstr', tpm_prefix_code: 'tsm', tpm_number_length: 5, tpm_last_number: 0 },
    { tpm_table_name: 'tbl_globals_mstr', tpm_prefix_code: 'tgm', tpm_number_length: 5, tpm_last_number: 0 },
    { tpm_table_name: 'tbl_audit_logs', tpm_prefix_code: 'tal', tpm_number_length: 6, tpm_last_number: 0 },
];

const SERVICES_SEEDS = [
    { tsm_title: 'Performance Marketing', tsm_description: 'Data-driven ad campaigns on Meta, Google, and TikTok that deliver high ROI.', tsm_icon: 'TrendingUp', tsm_order: 1 },
    { tsm_title: 'Brand Strategy & Design', tsm_description: 'Crafting unique brand identities, visual assets, and high-converting landing pages.', tsm_icon: 'Palette', tsm_order: 2 },
    { tsm_title: 'Social Media Growth', tsm_description: 'Organic content creation, community management, and viral video strategies.', tsm_icon: 'Share2', tsm_order: 3 },
    { tsm_title: 'Funnel Optimization', tsm_description: 'Optimizing your sales funnels and conversion rate for maximum profitability.', tsm_icon: 'Zap', tsm_order: 4 },
    { tsm_title: 'SEO & Content Marketing', tsm_description: 'Rank #1 on Google with high-intent keywords and strategic authority content.', tsm_icon: 'Search', tsm_order: 5 },
    { tsm_title: 'Automation & CRM', tsm_description: 'Automating lead capture, email nurturing, and customer retention workflows.', tsm_icon: 'Cpu', tsm_order: 6 },
];

const PACKAGES_SEEDS = [
    {
        tpm_name: 'Starter Plan',
        tpm_price: '₹25,000 / mo',
        tpm_features: JSON.stringify([
            { text: 'Meta & Instagram Ads Management', included: true },
            { text: 'Basic Landing Page Creation', included: true },
            { text: 'Weekly Performance Reports', included: true },
            { text: 'Dedicated Account Manager', included: false },
            { text: 'Custom Video Ad Creatives', included: false },
        ]),
        tpm_is_popular: false,
        tpm_order: 1
    },
    {
        tpm_name: 'Pro Growth Plan',
        tpm_price: '₹55,000 / mo',
        tpm_features: JSON.stringify([
            { text: 'Meta, Google & TikTok Ads', included: true },
            { text: 'High-Converting Funnel Design', included: true },
            { text: 'Dedicated Account Manager', included: true },
            { text: '8 Custom Video Ad Creatives / mo', included: true },
            { text: 'A/B Testing & CRO', included: true },
        ]),
        tpm_is_popular: true,
        tpm_order: 2
    },
    {
        tpm_name: 'Enterprise Scale Plan',
        tpm_price: '₹1,20,000 / mo',
        tpm_features: JSON.stringify([
            { text: 'Omnichannel Ad Campaigns (Global)', included: true },
            { text: 'Full Funnel & Web App Development', included: true },
            { text: 'Dedicated Growth Team (3 Experts)', included: true },
            { text: 'Unlimited Creative Revisions', included: true },
            { text: 'Weekly Strategy Calls with Mentor', included: true },
        ]),
        tpm_is_popular: false,
        tpm_order: 3
    }
];

const COURSES_SEEDS = [
    {
        tcm_title: 'Complete Meta Ads Mastery 2026',
        tcm_main_price: '₹4,999',
        tcm_original_price: '₹14,999',
        tcm_save_badge: '67% OFF',
        tcm_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        tcm_features: JSON.stringify([
            'Step-by-step Meta Ads setup',
            'ROAS scaling strategies',
            'Retargeting & custom audiences',
            'Creative copy formulas',
            'Lifetime updates & community access'
        ]),
        tcm_link: '#contact'
    },
    {
        tcm_title: 'Agency Growth Bundle 2.0',
        tcm_main_price: '₹9,999',
        tcm_original_price: '₹29,999',
        tcm_save_badge: 'BESTSELLER',
        tcm_image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
        tcm_features: JSON.stringify([
            'Client acquisition SOPs',
            'Cold email templates & scripts',
            'High-ticket closing framework',
            'Agency contract templates',
            '1-on-1 Q&A sessions'
        ]),
        tcm_link: '#contact'
    }
];

const STATS_SEEDS = [
    { tsm_label: 'Ad Spend Managed', tsm_value: '50', tsm_prefix: '₹', tsm_suffix: 'Cr+', tsm_icon: 'DollarSign', tsm_order: 1 },
    { tsm_label: 'Clients Scaled', tsm_value: '150', tsm_prefix: '', tsm_suffix: '+', tsm_icon: 'Users', tsm_order: 2 },
    { tsm_label: 'Average ROAS', tsm_value: '4.8', tsm_prefix: '', tsm_suffix: 'x', tsm_icon: 'TrendingUp', tsm_order: 3 },
    { tsm_label: 'Leads Generated', tsm_value: '1', tsm_prefix: '', tsm_suffix: 'M+', tsm_icon: 'Zap', tsm_order: 4 }
];

const RESULTS_SEEDS = [
    { tr_type: 'image', tr_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', tr_thumbnail: '', tr_title: 'E-commerce Brand 5.2x ROAS', tr_metric: '5.2x ROAS', tr_order: 1 },
    { tr_type: 'video', tr_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', tr_thumbnail: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80', tr_title: 'Real Estate Lead Gen Campaign', tr_metric: '1,200+ Leads', tr_order: 2 }
];

const GLOBALS_SEEDS = [
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

async function setup() {
    console.log(`🚀 Starting Database Setup on Project: ${PROJECT_ID}`);

    for (const col of COLLECTIONS) {
        console.log(`\nProcessing Collection: ${col.name} (${col.id})...`);

        // 1. Create or Get Collection
        try {
            await databases.getCollection(DATABASE_ID, col.id);
            console.log(`   - Collection exists.`);
        } catch (e) {
            console.log(`   - Creating collection...`);
            await databases.createCollection(DATABASE_ID, col.id, col.name);
        }

        // 2. Set Permissions
        try {
            await databases.updateCollection(DATABASE_ID, col.id, col.name, [
                sdk.Permission.read(sdk.Role.any()),
                sdk.Permission.create(sdk.Role.any()),
                sdk.Permission.update(sdk.Role.any()),
                sdk.Permission.delete(sdk.Role.any()),
                sdk.Permission.read(sdk.Role.users()),
                sdk.Permission.create(sdk.Role.users()),
                sdk.Permission.update(sdk.Role.users()),
                sdk.Permission.delete(sdk.Role.users()),
            ]);
            console.log(`   - Permissions: Full CRUD Enabled.`);
        } catch (e) {
            console.error(`   ! Error setting permissions:`, e.message);
        }

        // 3. Create Attributes
        console.log(`   - Checking attributes...`);
        for (const attr of col.attributes) {
            try {
                if (attr.type === 'string') {
                    await databases.createStringAttribute(DATABASE_ID, col.id, attr.key, attr.size, attr.required, attr.default);
                } else if (attr.type === 'integer') {
                    await databases.createIntegerAttribute(DATABASE_ID, col.id, attr.key, attr.required, -2147483648, 2147483647, attr.default);
                } else if (attr.type === 'boolean') {
                    await databases.createBooleanAttribute(DATABASE_ID, col.id, attr.key, attr.required, attr.default);
                }
                console.log(`     + Created: ${attr.key}`);
                await new Promise((r) => setTimeout(r, 300));
            } catch (e) {
                if (e.code !== 409) {
                    console.error(`     ! Error creating ${attr.key}:`, e.message);
                }
            }
        }

        // 4. Create Indexes
        if (col.indexes) {
            console.log(`   - Checking indexes...`);
            await new Promise((r) => setTimeout(r, 2000));

            for (const idx of col.indexes) {
                try {
                    await databases.createIndex(DATABASE_ID, col.id, idx.key, idx.type, idx.attributes);
                    console.log(`     + Created Index: ${idx.key}`);
                } catch (e) {
                    if (e.code !== 409) {
                        console.error(`     ! Error creating index ${idx.key}:`, e.message);
                    }
                }
            }
        }
    }

    // 5. Seed Prefix Master
    console.log(`\n🌱 Seeding tbl_prefix_mstr...`);
    for (const seed of PREFIX_SEEDS) {
        try {
            const existing = await databases.listDocuments(DATABASE_ID, 'tbl_prefix_mstr', [
                sdk.Query.equal('tpm_table_name', seed.tpm_table_name)
            ]);

            if (existing.total === 0) {
                await databases.createDocument(DATABASE_ID, 'tbl_prefix_mstr', sdk.ID.unique(), {
                    ...seed
                });
                console.log(`   + Seeded configuration for ${seed.tpm_table_name}`);
            } else {
                console.log(`   = Config exists for ${seed.tpm_table_name}`);
            }
        } catch (e) {
            console.error(`   ! Error seeding ${seed.tpm_table_name}:`, e.message);
        }
    }

    // 6. Seed Master Tables Data
    const seedTableData = async (tableId, seeds, matchField) => {
        console.log(`\n🌱 Seeding ${tableId}...`);
        for (const item of seeds) {
            try {
                const queries = matchField ? [sdk.Query.equal(matchField, item[matchField])] : [];
                const existing = await databases.listDocuments(DATABASE_ID, tableId, queries);
                if (existing.total === 0) {
                    await databases.createDocument(DATABASE_ID, tableId, sdk.ID.unique(), item);
                    console.log(`   + Seeded record into ${tableId}`);
                } else {
                    console.log(`   = Record exists in ${tableId}`);
                }
            } catch (e) {
                console.error(`   ! Error seeding ${tableId}:`, e.message);
            }
        }
    };

    // Wait for attribute indexing in Appwrite before seeding document records
    console.log(`\n⏳ Waiting 5 seconds for Appwrite attribute indexes to settle...`);
    await new Promise((r) => setTimeout(r, 5000));

    await seedTableData('tbl_services_mstr', SERVICES_SEEDS, 'tsm_title');
    await seedTableData('tbl_packages_mstr', PACKAGES_SEEDS, 'tpm_name');
    await seedTableData('tbl_courses_mstr', COURSES_SEEDS, 'tcm_title');
    await seedTableData('tbl_stats_mstr', STATS_SEEDS, 'tsm_label');
    await seedTableData('tbl_results', RESULTS_SEEDS, 'tr_url');
    await seedTableData('tbl_globals_mstr', GLOBALS_SEEDS, 'tgm_slug');

    console.log(`\n✅ Setup Finished Successfully!`);
}

setup().catch(console.error);
