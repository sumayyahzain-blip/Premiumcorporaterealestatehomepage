
import pg from 'pg';
const { Pool } = pg;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function verifyUsers() {
    const client = await pool.connect();
    try {
        console.log('🔍 Verifying Seed Data...');
        const res = await client.query('SELECT id, email, status FROM users');
        console.table(res.rows);

        const roles = await client.query('SELECT u.email, r.role FROM user_roles r JOIN users u ON r.user_id = u.id');
        console.table(roles.rows);
    } catch (e) {
        console.error(e);
    } finally {
        client.release();
        pool.end();
    }
}
verifyUsers();
