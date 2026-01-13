
import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../db';
import { generateToken, generateRefreshToken } from '../utils/auth';
import { rbacGuard } from '../middleware/rbacGuard';

const router = express.Router();

// LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Check if user exists
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const user = userResult.rows[0];

        // 2. Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // 3. Get Roles
        const rolesResult = await pool.query(
            'SELECT role FROM user_roles WHERE user_id = $1 AND is_active = true',
            [user.id]
        );
        const roles = rolesResult.rows.map((r: any) => r.role);

        // 4. Generate Tokens
        const accessToken = generateToken({ id: user.id, email: user.email, roles });
        const refreshToken = generateRefreshToken({ id: user.id, email: user.email, roles });

        // 5. Return success
        // Construct the user object matching the frontend type
        const userResponse = {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            roles: roles, // Simplified for now, frontend might expect object
            kycStatus: user.kyc_status,
            avatarUrl: user.avatar_url
        };

        res.json({
            success: true,
            data: {
                user: userResponse,
                accessToken,
                refreshToken,
                expiresIn: 900 // 15 minutes
            }
        });

        // 6. Update last login asynchronously
        pool.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ME (Check Session)
// ME (Check Session)
router.get('/me', rbacGuard(), async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const user = userResult.rows[0];

        const rolesResult = await pool.query(
            'SELECT role FROM user_roles WHERE user_id = $1 AND is_active = true',
            [user.id]
        );
        const roles = rolesResult.rows.map((r: any) => r.role);

        const userResponse = {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            phone: user.phone,
            avatarUrl: user.avatar_url,
            emailVerified: user.email_verified,
            phoneVerified: user.phone_verified,
            kycStatus: user.kyc_status,
            twoFactorEnabled: user.two_factor_enabled,
            status: user.status,
            roles: roles,
            permissions: [], // Permissions are derived from roles on frontend
            createdAt: user.created_at,
            lastLoginAt: user.last_login_at
        };

        res.json({ success: true, data: userResponse });

    } catch (error) {
        console.error('Me Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
