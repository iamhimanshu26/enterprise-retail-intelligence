-- Enterprise Retail Intelligence Platform
-- Phase 0: Database initialization

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Audit schema placeholder for future phases
CREATE SCHEMA IF NOT EXISTS audit;

-- Application schema
CREATE SCHEMA IF NOT EXISTS retail;

COMMENT ON SCHEMA retail IS 'Core retail data schema — Phase 2 domain model';
COMMENT ON SCHEMA audit IS 'Audit trail schema - populated in Phase 1+';

-- Health check table for connectivity verification
CREATE TABLE IF NOT EXISTS retail.schema_version (
    id SERIAL PRIMARY KEY,
    version VARCHAR(50) NOT NULL,
    description TEXT,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO retail.schema_version (version, description)
VALUES ('0.1.0', 'Phase 0 - Enterprise foundation')
ON CONFLICT DO NOTHING;
