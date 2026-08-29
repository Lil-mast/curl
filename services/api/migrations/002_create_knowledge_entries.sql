CREATE TABLE IF NOT EXISTS knowledge_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL,
    domain TEXT NOT NULL,
    language TEXT NOT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    body TEXT NOT NULL,
    source_name TEXT NOT NULL,
    source_url TEXT,
    contact_name TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    contact_url TEXT,
    last_reviewed DATE NOT NULL,
    review_cadence_days INTEGER NOT NULL DEFAULT 90,
    is_verified BOOLEAN NOT NULL DEFAULT TRUE,
    tags TEXT[] NOT NULL DEFAULT '{}',
    search_vector tsvector NOT NULL DEFAULT ''::tsvector,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT knowledge_entries_slug_language_unique UNIQUE (slug, language),
    CONSTRAINT knowledge_entries_domain_check CHECK (
        domain IN ('services', 'education', 'jobs', 'scholarships', 'community', 'cv-help')
    ),
    CONSTRAINT knowledge_entries_language_check CHECK (language IN ('en', 'so')),
    CONSTRAINT knowledge_entries_review_cadence_check CHECK (review_cadence_days > 0),
    CONSTRAINT knowledge_entries_source_name_check CHECK (length(btrim(source_name)) > 0)
);
CREATE OR REPLACE FUNCTION knowledge_entries_search_vector_update()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('simple', coalesce(NEW.title, '')), 'A')
        || setweight(to_tsvector('simple', coalesce(NEW.summary, '')), 'B')
        || setweight(to_tsvector('simple', coalesce(array_to_string(NEW.tags, ' '), '')), 'B')
        || setweight(to_tsvector('simple', coalesce(NEW.body, '')), 'C');
    RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS knowledge_entries_search_vector_trg ON knowledge_entries;
CREATE TRIGGER knowledge_entries_search_vector_trg
    BEFORE INSERT OR UPDATE OF title, summary, body, tags
    ON knowledge_entries
    FOR EACH ROW
    EXECUTE FUNCTION knowledge_entries_search_vector_update();
CREATE INDEX IF NOT EXISTS knowledge_entries_search_idx ON knowledge_entries USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS knowledge_entries_trgm_title_idx ON knowledge_entries USING GIN (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS knowledge_entries_domain_language_idx ON knowledge_entries (domain, language);
CREATE INDEX IF NOT EXISTS knowledge_entries_last_reviewed_idx ON knowledge_entries (last_reviewed DESC);
