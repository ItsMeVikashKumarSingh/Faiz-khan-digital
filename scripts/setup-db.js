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
            { key: 'tsm_order', type: 'integer', required: true, default: 0 },
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
            { key: 'tpm_is_popular', type: 'boolean', required: true, default: false },
            { key: 'tpm_order', type: 'integer', required: true, default: 0 },
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
            { key: 'tr_order', type: 'integer', required: true, default: 0 },
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
            { key: 'tsm_order', type: 'integer', required: true, default: 0 },
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
        if (col.publicRead) {
            try {
                await databases.updateCollection(DATABASE_ID, col.id, col.name, [
                    sdk.Permission.read(sdk.Role.any()), // Public Read
                ]);
                console.log(`   - Permissions: Public Read enabled.`);
            } catch (e) {
                console.error(`   ! Error setting permissions:`, e.message);
            }
        } else {
            console.log(`   - Permissions: Private/Restricted (Default).`);
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
                await new Promise((r) => setTimeout(r, 200));
            } catch (e) {
                if (e.code !== 409) {
                    // console.error(`     ! Error creating ${attr.key}:`, e.message);
                }
            }
        }

        // 4. Create Indexes
        if (col.indexes) {
            console.log(`   - Checking indexes...`);
            // Wait for attributes to be available
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
                // Generate a unique ID for the prefix master record itself
                // naming convention: pm_[prefix]
                const docId = `pm_${seed.tpm_prefix_code}_${Math.random().toString(36).substr(2, 5)}`;

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

    console.log(`\n✅ Setup Finished Successfully!`);
}

setup().catch(console.error);
