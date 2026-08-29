CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    language TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT sessions_language_check CHECK (
        language IS NULL OR language IN ('en', 'so')
    )
);
CREATE INDEX IF NOT EXISTS sessions_last_seen_idx ON sessions (last_seen_at DESC);
