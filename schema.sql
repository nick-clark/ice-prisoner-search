CREATE TABLE IF NOT EXISTS detainees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  middle_name TEXT,
  last_name TEXT NOT NULL,
  ice_a_number TEXT NOT NULL,
  facility_name TEXT,
  facility_state TEXT,
  source_type TEXT CHECK (source_type IN ('hotline', 'web', 'import')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_detainees_names ON detainees(last_name, first_name);
