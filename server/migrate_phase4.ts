
import pool from './db';

async function run() {
    console.log("Migration Phase 4: Starting...");

    // 1. Add owner_id
    try {
        console.log("Adding 'owner_id' column...");
        await pool.query(`ALTER TABLE properties ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id);`);
        console.log("Column added or already exists.");
    } catch (e: any) {
        console.error("Error adding column:", e.message);
    }

    // 2. Enable RLS
    try {
        console.log("Enabling Row Level Security...");
        await pool.query(`ALTER TABLE properties ENABLE ROW LEVEL SECURITY;`);
        console.log("RLS enabled.");
    } catch (e: any) {
        console.error("Error enabling RLS:", e.message);
    }

    // 3. Create Policies
    const policies = [
        {
            name: "Users can create properties",
            sql: `CREATE POLICY "Users can create properties" ON properties FOR INSERT WITH CHECK (auth.uid() = owner_id);`
        },
        {
            name: "Users can update own properties",
            sql: `CREATE POLICY "Users can update own properties" ON properties FOR UPDATE USING (auth.uid() = owner_id);`
        },
        {
            name: "Users can delete own properties",
            sql: `CREATE POLICY "Users can delete own properties" ON properties FOR DELETE USING (auth.uid() = owner_id);`
        }
    ];

    for (const p of policies) {
        try {
            console.log(`Creating policy: ${p.name}...`);
            await pool.query(p.sql);
            console.log("Success.");
        } catch (e: any) {
            if (e.message.includes("already exists")) {
                console.log("Policy already exists.");
            } else {
                console.error(`Failed to create policy '${p.name}':`, e.message);
            }
        }
    }

    console.log("Migration complete.");
    process.exit(0);
}

run();
