
import pool from './db';

async function testChatInsert() {
    try {
        console.log('🧪 Testing Chat History Persistence...');
        // Use the known admin ID from seed or a new UUID if needed
        // For test, we can use the admin user found in verify-data
        const userRes = await pool.query("SELECT id FROM users WHERE email = 'admin@gradea.realty'");
        if (userRes.rowCount === 0) {
            console.log('⚠️ Admin user not found, skipping test insert.');
            return;
        }
        const userId = userRes.rows[0].id;

        const res = await pool.query(
            "INSERT INTO chat_history (user_id, message, response) VALUES ($1, 'Test Message from Script', 'Test Response') RETURNING *",
            [userId]
        );
        console.table(res.rows);
        console.log('✅ Chat History Insert Success!');
    } catch (e) {
        console.error('❌ Insert Failed', e);
    } finally {
        pool.end();
    }
}

testChatInsert();
