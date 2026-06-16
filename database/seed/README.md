# Reference & Seed Data Structure

Phase 2 defines the **schema and domain contracts** only. No synthetic transactional data is generated in this phase.

## Purpose

Provide a clear structure for Phase 3 synthetic data generation and manual reference imports.

## Planned layout

```text
database/seed/
  README.md
  reference/
    store-types.json          # optional lookup metadata
    membership-tiers.json
    regions.json
  transactional/              # Phase 3 — generated CSV/JSON batches
```

## Seeding approach (Phase 3+)

1. **Reference data** — static enums and lookup values aligned with `common.enums` packages.
2. **Transactional data** — stores, products, customers, suppliers, inventory, sales, promotions, returns.
3. **Load path** — FastAPI generator → PostgreSQL `retail` schema (or Spring Boot admin APIs).

## Column contracts

All seed files must respect unique business codes:

| Entity | Required unique code |
|--------|---------------------|
| Store | `store_code` |
| Product | `product_code` |
| Customer | `customer_code` |
| Supplier | `supplier_code` |
| Sales | `transaction_code` |
| Promotion | `promotion_code` |
| Return | `return_code` |

Foreign keys must reference persisted UUIDs or resolvable business codes during ETL load.
