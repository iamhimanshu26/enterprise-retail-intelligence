-- Phase 2: Indexes, check constraints, and analytics-ready indexes

SET search_path TO retail, public;

-- Stores
CREATE INDEX IF NOT EXISTS idx_stores_region ON stores (region);
CREATE INDEX IF NOT EXISTS idx_stores_status ON stores (status);
CREATE INDEX IF NOT EXISTS idx_stores_prefecture ON stores (prefecture);

ALTER TABLE stores
    ADD CONSTRAINT chk_stores_status
    CHECK (status IN ('ACTIVE', 'INACTIVE', 'CLOSED', 'UNDER_RENOVATION'));

ALTER TABLE stores
    ADD CONSTRAINT chk_stores_store_type
    CHECK (store_type IN ('FLAGSHIP', 'STANDARD', 'OUTLET', 'WAREHOUSE', 'POPUP'));

ALTER TABLE stores
    ADD CONSTRAINT chk_stores_region
    CHECK (region IN ('HOKKAIDO', 'TOHOKU', 'KANTO', 'CHUBU', 'KANSAI', 'CHUGOKU', 'SHIKOKU', 'KYUSHU', 'OKINAWA'));

-- Suppliers
CREATE INDEX IF NOT EXISTS idx_suppliers_region ON suppliers (region);
CREATE INDEX IF NOT EXISTS idx_suppliers_status ON suppliers (status);

ALTER TABLE suppliers
    ADD CONSTRAINT chk_suppliers_status
    CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PREFERRED'));

ALTER TABLE suppliers
    ADD CONSTRAINT chk_suppliers_reliability_score
    CHECK (reliability_score >= 0 AND reliability_score <= 100);

-- Products
CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products (status);
CREATE INDEX IF NOT EXISTS idx_products_supplier_id ON products (supplier_id);

ALTER TABLE products
    ADD CONSTRAINT chk_products_status
    CHECK (status IN ('ACTIVE', 'DISCONTINUED', 'SEASONAL', 'PENDING'));

ALTER TABLE products
    ADD CONSTRAINT chk_products_unit_price_positive
    CHECK (unit_price >= 0);

ALTER TABLE products
    ADD CONSTRAINT chk_products_cost_price_positive
    CHECK (cost_price >= 0);

-- Customers
CREATE INDEX IF NOT EXISTS idx_customers_prefecture ON customers (prefecture);
CREATE INDEX IF NOT EXISTS idx_customers_membership_tier ON customers (membership_tier);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers (status);

ALTER TABLE customers
    ADD CONSTRAINT chk_customers_status
    CHECK (status IN ('ACTIVE', 'INACTIVE', 'BLOCKED', 'VIP'));

ALTER TABLE customers
    ADD CONSTRAINT chk_customers_membership_tier
    CHECK (membership_tier IN ('STANDARD', 'SILVER', 'GOLD', 'PLATINUM', 'CORPORATE'));

-- Inventory
CREATE INDEX IF NOT EXISTS idx_inventory_store_id ON inventory (store_id);
CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON inventory (product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_stock_status ON inventory (stock_status);

ALTER TABLE inventory
    ADD CONSTRAINT chk_inventory_quantity_non_negative
    CHECK (quantity_on_hand >= 0);

ALTER TABLE inventory
    ADD CONSTRAINT chk_inventory_stock_status
    CHECK (stock_status IN ('IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK', 'OVERSTOCK', 'ON_ORDER'));

-- Promotions
CREATE INDEX IF NOT EXISTS idx_promotions_status ON promotions (status);
CREATE INDEX IF NOT EXISTS idx_promotions_start_date ON promotions (start_date);
CREATE INDEX IF NOT EXISTS idx_promotions_end_date ON promotions (end_date);

ALTER TABLE promotions
    ADD CONSTRAINT chk_promotions_status
    CHECK (status IN ('ACTIVE', 'SCHEDULED', 'EXPIRED', 'CANCELLED'));

ALTER TABLE promotions
    ADD CONSTRAINT chk_promotions_type
    CHECK (promotion_type IN ('PERCENTAGE_OFF', 'FIXED_AMOUNT', 'BUY_ONE_GET_ONE', 'BUNDLE', 'SEASONAL'));

ALTER TABLE promotions
    ADD CONSTRAINT chk_promotions_date_range
    CHECK (end_date >= start_date);

-- Sales transactions
CREATE INDEX IF NOT EXISTS idx_sales_transactions_store_id ON sales_transactions (store_id);
CREATE INDEX IF NOT EXISTS idx_sales_transactions_customer_id ON sales_transactions (customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_transactions_transaction_date ON sales_transactions (transaction_date);
CREATE INDEX IF NOT EXISTS idx_sales_transactions_status ON sales_transactions (transaction_status);

ALTER TABLE sales_transactions
    ADD CONSTRAINT chk_sales_transactions_payment_method
    CHECK (payment_method IN ('CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'MOBILE_WALLET', 'GIFT_CARD', 'STORE_CREDIT'));

ALTER TABLE sales_transactions
    ADD CONSTRAINT chk_sales_transactions_status
    CHECK (transaction_status IN ('COMPLETED', 'PENDING', 'CANCELLED', 'REFUNDED', 'PARTIALLY_REFUNDED'));

-- Sales transaction items
CREATE INDEX IF NOT EXISTS idx_sales_transaction_items_transaction_id ON sales_transaction_items (sales_transaction_id);
CREATE INDEX IF NOT EXISTS idx_sales_transaction_items_product_id ON sales_transaction_items (product_id);

ALTER TABLE sales_transaction_items
    ADD CONSTRAINT chk_sales_transaction_items_quantity_positive
    CHECK (quantity > 0);

-- Return transactions
CREATE INDEX IF NOT EXISTS idx_return_transactions_sales_id ON return_transactions (sales_transaction_id);
CREATE INDEX IF NOT EXISTS idx_return_transactions_store_id ON return_transactions (store_id);
CREATE INDEX IF NOT EXISTS idx_return_transactions_customer_id ON return_transactions (customer_id);
CREATE INDEX IF NOT EXISTS idx_return_transactions_return_date ON return_transactions (return_date);
CREATE INDEX IF NOT EXISTS idx_return_transactions_status ON return_transactions (status);

ALTER TABLE return_transactions
    ADD CONSTRAINT chk_return_transactions_status
    CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'PROCESSED', 'REFUNDED'));

ALTER TABLE return_transactions
    ADD CONSTRAINT chk_return_transactions_quantity_positive
    CHECK (quantity > 0);

INSERT INTO retail.schema_version (version, description)
VALUES ('2.0.1', 'Phase 2 - Retail indexes and constraints');
