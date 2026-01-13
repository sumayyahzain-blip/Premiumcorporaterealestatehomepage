
import { generateToken } from './utils/auth';

async function test() {
    console.log('🧪 Testing User API...');

    // 1. Generate Token
    const token = generateToken({
        id: 'a0000000-0000-0000-0000-000000000001', // Admin ID
        email: 'admin@gradea.realty',
        roles: ['super_admin']
    });

    console.log('🔑 Token Generated');

    // 2. Make Request
    try {
        const res = await fetch('http://localhost:3000/api/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log(`📡 Status: ${res.status} ${res.statusText}`);

        const text = await res.text();
        console.log('📦 Raw Body:', text || "(empty)");

        try {
            const json = JSON.parse(text);
            console.log('✅ Valid JSON Received');
            console.log('Count:', json.data?.data?.length);
        } catch {
            console.error('❌ Invalid JSON');
        }

    } catch (e) {
        console.error('❌ Network Error:', e);
    }
}

test();
