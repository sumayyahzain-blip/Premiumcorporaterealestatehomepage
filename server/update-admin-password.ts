
import bcrypt from 'bcryptjs';
import pool from './db';

const EMAIL = 'admin@gradea.realty';
const PASSWORD = 'SuperAdmin123!';

async function resetAdminPassword() {
    console.log('🔄 Resetting Admin Password...');

    try {
        // 1. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(PASSWORD, salt);
        console.log('🔐 New Hash Generated:', hash);

        // 2. Update DB
        const res = await pool.query(
            'UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING id',
            [hash, EMAIL]
        );

        if (res.rowCount === 0) {
            console.error(`❌ User ${EMAIL} not found!`);
            // If user is missing, maybe we should create it? 
            // But verify-data said it exists.
        } else {
            console.log(`✅ User ${EMAIL} updated successfully.`);

            // 3. Verify immediately
            const check = await pool.query('SELECT password_hash FROM users WHERE email = $1', [EMAIL]);
            const isMatch = await bcrypt.compare(PASSWORD, check.rows[0].password_hash);
            console.log('🧪 Verification Test:', isMatch ? 'PASSED (Match)' : 'FAILED (No Match)');
        }

    } catch (error) {
        console.error('❌ Error updating password:', error);
    } finally {
        pool.end();
    }
}

resetAdminPassword();
