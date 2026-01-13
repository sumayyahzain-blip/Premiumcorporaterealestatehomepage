b -- =============================================================================
-- GRADE A REALTY - CHATBOT SCHEMA
-- SUPABASE / POSTGRESQL API
-- =============================================================================

-- 1. Enable UUID Extension (Ensure it exists)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- TABLE 1: bot_knowledge (The Brain)
-- Stores Q&A pairs for the AI to retrieve.
-- =============================================================================
CREATE TABLE IF NOT EXISTS bot_knowledge (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trigger_phrase TEXT NOT NULL,
    response_text TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('sales', 'support', 'admin', 'general')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- TABLE 2: chat_sessions (The Conversation Container)
-- Groups messages into logical conversations.
-- =============================================================================
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Optional: Null for guests
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- TABLE 3: chat_messages (The Individual Texts)
-- Stores the actual conversation history.
-- =============================================================================
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'bot')),
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE bot_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- POLICY: bot_knowledge
-- Public (Everyone) can READ
CREATE POLICY "Public can view active knowledge" 
ON bot_knowledge FOR SELECT 
USING (is_active = true);

-- Admins can INSERT/UPDATE/DELETE (Assuming 'service_role' or app_metadata role check)
-- Note: Adjust the role check based on your specific Supabase setup.
CREATE POLICY "Admins can manage knowledge" 
ON bot_knowledge FOR ALL 
USING (
    auth.jwt() ->> 'role' = 'service_role' OR 
    (auth.jwt() -> 'app_metadata' ->> 'role')::text = 'admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role')::text = 'super_admin'
);

-- POLICY: chat_sessions
-- Users can Create their own sessions
CREATE POLICY "Users can create sessions" 
ON chat_sessions FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Users can View their own sessions
CREATE POLICY "Users can view own sessions" 
ON chat_sessions FOR SELECT 
USING (auth.uid() = user_id OR (user_id IS NULL AND id::text = current_setting('request.header.x-session-id', true))); 
-- Note: Guest access typically requires passing a session ID header or similar mechanism. 
-- For strict auth, just (auth.uid() = user_id).

-- POLICY: chat_messages
-- Users can Insert into their own sessions
CREATE POLICY "Users can insert messages" 
ON chat_messages FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM chat_sessions 
        WHERE id = session_id 
        AND (user_id = auth.uid() OR user_id IS NULL)
    )
);

-- Users can View their own messages
CREATE POLICY "Users can view messages" 
ON chat_messages FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM chat_sessions 
        WHERE id = session_id 
        AND (user_id = auth.uid() OR user_id IS NULL)
    )
);

-- =============================================================================
-- SEED DATA (Initial Brain)
-- =============================================================================
INSERT INTO bot_knowledge (trigger_phrase, response_text, category, is_active) VALUES
('hello', 'Welcome to Grade A Realty! How can I help?', 'general', true),
('commission', 'Our selling fee is a competitive 1.5%.', 'sales', true),
('admin help', 'System nominal. Accessing dashboard...', 'admin', true),
('hours', 'We are open Mon-Fri 9am-6pm.', 'general', true);
