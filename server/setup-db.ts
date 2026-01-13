
import pg from 'pg';
const { Client } = pg;
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const DB_NAME = 'gradea_realty';

async function setupDatabase() {
    console.log('🚀 Starting Database Setup...');

    // 1. Connect to default 'postgres' db to create our target db
    const rootClient = new Client({
        connectionString: process.env.DATABASE_URL?.replace(`/${DB_NAME}`, '/postgres'),
    });

    try {
        await rootClient.connect();
        console.log('✅ Connected to root postgres database');

        // Check if db exists
        const res = await rootClient.query(`SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'`);
        if (res.rowCount === 0) {
            console.log(`✨ Database '${DB_NAME}' not found. Creating...`);
            await rootClient.query(`CREATE DATABASE "${DB_NAME}"`);
            console.log(`✅ Database '${DB_NAME}' created successfully.`);
        } else {
            console.log(`ℹ️  Database '${DB_NAME}' already exists.`);
        }
    } catch (err) {
        console.error('❌ Failed to check/create database:', err);
        process.exit(1);
    } finally {
        await rootClient.end();
    }

    // 2. Connect to the actual 'gradea_realty' db to apply schema
    const dbClient = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await dbClient.connect();
        console.log(`✅ Connected to '${DB_NAME}'`);

        const schemaPath = path.resolve(__dirname, '../database/schema.sql');
        console.log('📖 Reading schema from:', schemaPath);
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('⚡ Applying schema...');
        await dbClient.query(schemaSql);
        console.log('✅ Schema applied successfully!');

        console.log('🎉 Setup Complete! You are ready for Phase 2.');

    } catch (err) {
        console.error('❌ Failed to apply schema:', err);
        process.exit(1);
    } finally {
        await dbClient.end();
    }
}

setupDatabase();
