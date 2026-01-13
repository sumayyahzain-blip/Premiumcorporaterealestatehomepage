
import dotenv from 'dotenv';
import path from 'path';

// Try loading from explicit path
const envPath = path.resolve(process.cwd(), '.env');
console.log("Loading env from:", envPath);
dotenv.config({ path: envPath });

const url = process.env.DATABASE_URL;
console.log("DATABASE_URL details:");
console.log("Type:", typeof url);
console.log("Length:", url ? url.length : 0);
console.log("Contains 'postgres':", url ? url.includes('postgres') : false);
console.log("Contains '@':", url ? url.includes('@') : false);
