
import { Request, Response } from 'express';
import pool from '../db';
import { GetUsersRequest } from '../../src/types/api';

export class UserController {

    /**
     * Get paginated list of users with filters
     */
    async listUsers(req: Request, res: Response) {
        try {
            // Build query
            const { page = 1, pageSize = 10, role, status, query } = req.query as any;
            const offset = (Number(page) - 1) * Number(pageSize);

            const params: any[] = [];
            let sql = `
                SELECT 
                    u.id, u.email, u.first_name as "firstName", u.last_name as "lastName",
                    u.phone, u.avatar_url as "avatarUrl", u.status, u.created_at as "createdAt",
                    u.last_login_at as "lastLoginAt",
                    COALESCE(
                        (SELECT json_agg(ur.role) FROM user_roles ur WHERE ur.user_id = u.id AND ur.is_active = true),
                        '[]'
                    ) as roles
                FROM users u
                WHERE 1=1
            `;

            let paramIdx = 1;

            if (status) {
                sql += ` AND u.status = $${paramIdx++}`;
                params.push(status);
            }

            if (query) {
                sql += ` AND (u.email ILIKE $${paramIdx} OR u.first_name ILIKE $${paramIdx} OR u.last_name ILIKE $${paramIdx})`;
                params.push(`%${query}%`);
                paramIdx++;
            }

            // Note: Role filter requires a JOIN or subquery check, simplified here for now
            if (role) {
                sql += ` AND EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = u.id AND ur.role = $${paramIdx} AND ur.is_active = true)`;
                params.push(role);
                paramIdx++;
            }

            // Count total for pagination
            const countSql = `SELECT count(*) as total FROM (${sql}) as filtered_users`;
            const countResult = await pool.query(countSql, params);
            const totalItems = parseInt(countResult.rows[0].total);

            // Add Sort and Pagination
            sql += ` ORDER BY u.created_at DESC LIMIT $${paramIdx++} OFFSET $${paramIdx++}`;
            params.push(pageSize, offset);

            const result = await pool.query(sql, params);
            const totalPages = Math.ceil(totalItems / Number(pageSize));

            res.json({
                success: true,
                data: {
                    data: result.rows,
                    pagination: {
                        page: Number(page),
                        pageSize: Number(pageSize),
                        totalItems,
                        totalPages,
                        hasNext: Number(page) < totalPages,
                        hasPrev: Number(page) > 1
                    }
                }
            });

        } catch (error) {
            console.error('GET /api/users error:', error);
            // ✅ ALWAYS return JSON
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch users',
                error: (error as Error).message
            });
        }
    }

    /**
     * Get single user by ID
     */
    async getUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const sql = `
                SELECT 
                    u.id, u.email, u.first_name as "firstName", u.last_name as "lastName",
                    u.phone, u.avatar_url as "avatarUrl", u.status, u.created_at as "createdAt",
                    COALESCE(
                        (SELECT json_agg(ur.role) FROM user_roles ur WHERE ur.user_id = u.id AND ur.is_active = true),
                        '[]'
                    ) as roles
                FROM users u
                WHERE u.id = $1
            `;
            const result = await pool.query(sql, [id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            res.json({ success: true, data: result.rows[0] });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }
}

export const userController = new UserController();
