import express from 'express';
import cors from 'cors';
import pool from './db';

import authRoutes from './routes/auth';
import chatRoutes from './routes/chat.routes';
import userRoutes from './routes/user.routes';
import propertyRoutes from './routes/properties.routes';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);

// Health Check Endpoint
app.get('/api/health', async (req, res) => {
    try {
        // Simple query to verify DB connection
        const result = await pool.query('SELECT NOW()');
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
