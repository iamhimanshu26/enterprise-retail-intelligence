# Core Retail Data Model

Enterprise retail domain schema for the **Enterprise Retail Intelligence & Forecasting Platform**.

Phase 2 establishes the persistence foundation used by synthetic data generation, ETL, analytics, statistics, forecasting, and business insights.

---

## Schema Overview

All business tables live in the PostgreSQL `retail` schema. Flyway migrations apply versioned DDL from `database/migrations/` (mirrored in `backend-springboot/src/main/resources/db/migration/`).

| Migration | Purpose |
|-----------|---------|
| `V1__core_retail_domain_schema.sql` | Core entity tables and foreign keys |
| `V2__retail_indexes_and_constraints.sql` | Indexes, check constraints, analytics-ready indexes |

Bootstrap (`database/init/01-init.sql`) creates schemas, `uuid-ossp`, and `retail.schema_version`.

---

## Entities

| Entity | Table | Business code | Description |
|--------|-------|---------------|-------------|
| Store | `stores` | `store_code` | Physical retail locations across Japan |
| Product | `products` | `product_code` | Catalog items with pricing and optional supplier |
| Customer | `customers` | `customer_code` | Retail customers and membership tier |
| Supplier | `suppliers` | `supplier_code` | Vendors and reliability scoring |
| Inventory | `inventory` | — | Per-store stock levels and reorder thresholds |
| SalesTransaction | `sales_transactions` | `transaction_code` | Sales order / receipt header |
| SalesTransactionItem | `sales_transaction_items` | — | Line items linked to transactions |
| Promotion | `promotions` | `promotion_code` | Campaigns and discount rules |
| ReturnTransaction | `return_transactions` | `return_code` | Returns and refunds |

Primary keys are **UUID** with `created_at` / `updated_at` audit timestamps.

---

## Relationships

```text
Store 1──* Inventory *──1 Product
Store 1──* SalesTransaction *──1 Customer (optional)
SalesTransaction 1──* SalesTransactionItem *──1 Product
SalesTransaction 1──* ReturnTransaction
Supplier 1──* Product (optional)
Promotion — independent (future linkage in analytics phases)
```

JPA uses lazy associations and DTO mapping to avoid entity serialization cycles.

---

## Enumerations

Java enums in `com.retail.intelligence.common.enums` map to VARCHAR columns with PostgreSQL CHECK constraints:

- **Region** — HOKKAIDO, TOHOKU, KANTO, CHUBU, KANSAI, CHUGOKU, SHIKOKU, KYUSHU, OKINAWA
- **StoreStatus**, **StoreType**, **ProductStatus**, **CustomerStatus**, **SupplierStatus**
- **StockStatus**, **PaymentMethod**, **TransactionStatus**
- **PromotionType**, **PromotionStatus**, **ReturnStatus**, **MembershipTier**

---

## Backend Package Structure

```text
com.retail.intelligence.domain.{module}/
  entity/       JPA entities
  repository/   Spring Data JPA repositories
  dto/          Request/response DTOs (validation on requests)
  mapper/       Entity ↔ DTO mapping
  service/      Readiness + list skeletons
  controller/   /api/v1/* placeholder REST APIs
```

Modules: `store`, `product`, `customer`, `supplier`, `inventory`, `sales`, `promotion`, `returns`.

---

## API Placeholders (Phase 2)

| Path | Controller | Endpoints |
|------|------------|-----------|
| `/api/v1/stores` | `StoreController` | `GET /readiness`, `GET /` |
| `/api/v1/products` | `ProductController` | `GET /readiness`, `GET /` |
| `/api/v1/customers` | `CustomerController` | `GET /readiness`, `GET /` |
| `/api/v1/suppliers` | `SupplierController` | `GET /readiness`, `GET /` |
| `/api/v1/inventory` | `InventoryController` | `GET /readiness`, `GET /` |
| `/api/v1/sales` | `SalesController` | `GET /readiness`, `GET /` |
| `/api/v1/promotions` | `PromotionController` | `GET /readiness`, `GET /` |
| `/api/v1/returns` | `ReturnController` | `GET /readiness`, `GET /` |

Responses use `ApiResponse<T>`. Full CRUD and write APIs are planned for Phase 3+.

OpenAPI documentation: `/swagger-ui.html`

---

## Future Integration

| Phase | Integration |
|-------|-------------|
| Phase 3 | Synthetic data generator seeds reference and transactional data |
| Phase 3–4 | ETL loads CSV/Excel/JSON into retail tables |
| Phase 4–5 | Analytics engine queries normalized schema |
| Phase 6 | Forecasting reads sales and inventory history |
| Phase 5+ | Executive dashboard replaces mock layer with REST APIs |

---

## Seed / Reference Data

Reference catalog structure (no generated transactional data in Phase 2):

- `database/seed/README.md` — seeding strategy and column contracts
- Future: `database/seed/reference/` for static lookup files

Synthetic generation is intentionally deferred to Phase 3.
