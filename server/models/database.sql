-- Database schema for Veritas application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Claims table
CREATE TABLE claims (
    claim_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submitted_by UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    source_url TEXT NOT NULL,
    claim_statement TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Votes table
CREATE TABLE votes (
    vote_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    claim_id UUID NOT NULL REFERENCES claims(claim_id) ON DELETE CASCADE,
    vote_type VARCHAR(20) NOT NULL CHECK (vote_type IN ('true', 'false', 'misleading')),
    voted_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, claim_id) -- Prevent multiple votes from same user on same claim
);

-- Evidence table
CREATE TABLE evidence (
    evidence_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    claim_id UUID NOT NULL REFERENCES claims(claim_id) ON DELETE CASCADE,
    evidence_link TEXT,
    comment TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_claims_submitted_by ON claims(submitted_by);
CREATE INDEX idx_claims_status ON claims(status);
CREATE INDEX idx_votes_user_id ON votes(user_id);
CREATE INDEX idx_votes_claim_id ON votes(claim_id);
CREATE INDEX idx_evidence_user_id ON evidence(user_id);
CREATE INDEX idx_evidence_claim_id ON evidence(claim_id);
