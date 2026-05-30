-- AI Discoverability Platform Schema Definition
-- PostgreSQL / Supabase Schema Definition for Phase 2 Integration

-- Enable UUID extension (standard for Supabase UUID primary keys)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
-- Tracks application users, authentication linkages, and system settings.
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. BUSINESSES TABLE
-- Tracks the target companies/brands being analyzed by users.
CREATE TABLE IF NOT EXISTS businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    website_url VARCHAR(255) UNIQUE NOT NULL,
    industry VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. VISIBILITY REPORTS TABLE
-- Stores historical snapshots of how discoverable a brand is across various AI models.
CREATE TABLE IF NOT EXISTS visibility_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    overall_score INT CHECK (overall_score >= 0 AND overall_score <= 100),
    chatgpt_score INT CHECK (chatgpt_score >= 0 AND chatgpt_score <= 100),
    claude_score INT CHECK (claude_score >= 0 AND claude_score <= 100),
    gemini_score INT CHECK (gemini_score >= 0 AND gemini_score <= 100),
    perplexity_score INT CHECK (perplexity_score >= 0 AND perplexity_score <= 100),
    recommendations JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. COMPETITORS TABLE
-- Tracks brand-to-competitor mappings for gap analysis and benchmarking.
CREATE TABLE IF NOT EXISTS competitors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    competitor_name VARCHAR(255) NOT NULL,
    competitor_url VARCHAR(255),
    competitor_score INT CHECK (competitor_score >= 0 AND competitor_score <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (business_id, competitor_name)
);

-- 5. REAL COMPETITOR RECORDS TABLE
-- Stores real competitors discovered from live Google search crawls.
CREATE TABLE IF NOT EXISTS real_competitor_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    competitor_name VARCHAR(255) NOT NULL,
    website VARCHAR(255),
    query_source VARCHAR(255) DEFAULT 'Google Search Organic / Maps',
    ranking INT,
    ai_mention_frequency INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for lookup optimizations
CREATE INDEX IF NOT EXISTS idx_businesses_user_id ON businesses(user_id);
CREATE INDEX IF NOT EXISTS idx_visibility_reports_business_id ON visibility_reports(business_id);
CREATE INDEX IF NOT EXISTS idx_real_competitor_records_business ON real_competitor_records(business_name);
CREATE INDEX IF NOT EXISTS idx_competitors_business_id ON competitors(business_id);

-- Simple trigger function to automate updating 'updated_at' columns on modification
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create update triggers
CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_businesses_modtime BEFORE UPDATE ON businesses FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_competitors_modtime BEFORE UPDATE ON competitors FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
