
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';

// Extend Express Request to include user info
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                roles: string[];
            };
        }
    }
}

/**
 * Middleware to verify JWT token and user roles
 */
export const rbacGuard = (allowedRoles: string[] = []) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // 1. Get Token
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
        }

        const token = authHeader.split(' ')[1];

        try {
            // 2. Verify Token
            const decoded = verifyToken(token);
            req.user = decoded;

            // 3. Check Role (if restrictions apply)
            if (allowedRoles.length > 0) {
                const hasRole = req.user?.roles.some(role => allowedRoles.includes(role));
                if (!hasRole) {
                    return res.status(403).json({ success: false, message: 'Forbidden: Insufficient permissions' });
                }
            }

            next();
        } catch (err) {
            return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
        }
    };
};
