# Database Migrations

Versioned SQL migrations for the Enterprise Retail Intelligence platform.

## Tooling

- **Production / Docker:** Flyway (Spring Boot `backend-springboot`)
- **Location:** `database/migrations/` (canonical) mirrored to `backend-springboot/src/main/resources/db/migration/`

## Phase 2 migrations

| Version | File | Description |
|---------|------|-------------|
| V1 | `V1__core_retail_domain_schema.sql` | Core retail domain tables |
| V2 | `V2__retail_indexes_and_constraints.sql` | Indexes and CHECK constraints |

Bootstrap schema and `retail.schema_version` are created by `database/init/01-init.sql` on first PostgreSQL container start.

## Naming convention

Flyway standard:

```text
V{version}__{description}.sql
```

## Running migrations

Migrations run automatically when the Spring Boot backend starts with Flyway enabled.

Manual apply (optional):

```bash
psql -h localhost -p 5433 -U retail_admin -d retail_intelligence -f database/migrations/V1__core_retail_domain_schema.sql
```

## Future phases

Phase 3+ may add analytics views, materialized tables, and audit extensions under `audit` schema.
