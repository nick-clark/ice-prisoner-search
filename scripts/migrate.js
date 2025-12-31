const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function run() {
    // Check if DATABASE_URL is present
    if (!process.env.DATABASE_URL) {
        console.error("Error: DATABASE_URL is missing. Make sure to run with --env-file=.env.local");
        process.exit(1);
    }

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false } // Required for some Supabase connections depending on mode
    });

    try {
        const schemaPath = path.join(process.cwd(), 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Running migration...');
        await pool.query(schemaSql);
        console.log('Migration completed successfully.');
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

run();
