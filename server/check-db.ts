import pg from 'pg';
const { Pool } = pg;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('Testing Database Connection...');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
    try {
        const client = await pool.connect();
        console.log('✅ Successfully connected!');
        const res = await client.query('SELECT current_database() as db');
        console.log('🗄️  Database:', res.rows[0].db);
        client.release();
        pool.end();
    } catch (err) {
        console.error('❌ Connection Failed. Full Error:', err);
        process.exit(1);
    }
}

testConnection();
