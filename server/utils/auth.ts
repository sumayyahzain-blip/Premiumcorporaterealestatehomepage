
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_production';

interface UserPayload {
    id: string;
    email: string;
    roles: string[];
}

export const generateToken = (user: UserPayload): string => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            roles: user.roles
        },
        JWT_SECRET,
        { expiresIn: '15m' }
    );
};

export const generateRefreshToken = (user: UserPayload): string => {
    return jwt.sign(
        { id: user.id },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
};

export const verifyToken = (token: string): any => {
    return jwt.verify(token, JWT_SECRET);
};
