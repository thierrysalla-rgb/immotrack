-- Create the listings table
CREATE TABLE IF NOT EXISTS listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT NOT NULL,
    price_initial NUMERIC NOT NULL,
    price_current NUMERIC NOT NULL,
    location TEXT NOT NULL,
    surface NUMERIC NOT NULL,
    price_drops INTEGER DEFAULT 0,
    image_url TEXT,
    date_created TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold')),
    history JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
-- For this simple project, we'll allow all operations for now, 
-- but in production you'd want to restrict this.
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON listings
    FOR SELECT USING (true);

CREATE POLICY "Allow all for authenticated users" ON listings
    FOR ALL USING (true); -- You can refine this later
