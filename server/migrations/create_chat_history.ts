
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function runMigration() {
    const client = await pool.connect();
    try {
        console.log('Running Chat History Migration...');

        await client.query(`
            CREATE TABLE IF NOT EXISTS chat_history (
                id SERIAL PRIMARY KEY,
                user_id UUID REFERENCES users(id),
                message TEXT NOT NULL,
                response TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('✅ Chat History Table Created Successfully.');
    } catch (err) {
        console.error('❌ Migration Failed:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

runMigration();
