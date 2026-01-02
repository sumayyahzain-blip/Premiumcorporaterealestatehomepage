import express from 'express';
import cors from 'cors';
import pool from './db';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', async (req, res) => {
    try {
        // Simple query to verify DB connection
        constresult = await pool.query('SELECT NOW()');
        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            database: 'connected',
            db_time: result.rows[0].now
        });
    } catch (error) {
        console.error('Database connection failed:', error);
        res.status(500).json({
            status: 'error',
            database: 'disconnected',
            error: (error as Error).message
        });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`\n🚀 Server running at http://localhost:${port}`);
    console.log(`   Health Check: http://localhost:${port}/api/health\n`);
});
