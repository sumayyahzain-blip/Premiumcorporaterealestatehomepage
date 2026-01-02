import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Create a new pool instance used for all queries
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// The pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition encounters
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
export default pool;
