-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
ALTER DEFAULT PRIVILEGES GRANT ALL ON TABLES TO portfolio_user;
ALTER DEFAULT PRIVILEGES GRANT ALL ON SEQUENCES TO portfolio_user;
ALTER DEFAULT PRIVILEGES GRANT ALL ON FUNCTIONS TO portfolio_user;
