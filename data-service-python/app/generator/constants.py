"""Shared constants for synthetic retail data generation."""

from typing import Dict, List, Tuple

JAPAN_REGIONS: List[str] = [
    "HOKKAIDO",
    "TOHOKU",
    "KANTO",
    "CHUBU",
    "KANSAI",
    "CHUGOKU",
    "SHIKOKU",
    "KYUSHU",
    "OKINAWA",
]

# Population-weighted regional distribution (approximate Japan retail footprint)
REGION_WEIGHTS: Dict[str, float] = {
    "HOKKAIDO": 0.04,
    "TOHOKU": 0.07,
    "KANTO": 0.37,
    "CHUBU": 0.14,
    "KANSAI": 0.18,
    "CHUGOKU": 0.05,
    "SHIKOKU": 0.03,
    "KYUSHU": 0.08,
    "OKINAWA": 0.02,
}

REGION_PREFECTURES: Dict[str, List[str]] = {
    "HOKKAIDO": ["Hokkaido"],
    "TOHOKU": ["Aomori", "Iwate", "Miyagi", "Akita", "Yamagata", "Fukushima"],
    "KANTO": ["Tokyo", "Kanagawa", "Chiba", "Saitama", "Ibaraki", "Tochigi", "Gunma"],
    "CHUBU": ["Niigata", "Toyama", "Ishikawa", "Fukui", "Yamanashi", "Nagano", "Gifu", "Shizuoka", "Aichi"],
    "KANSAI": ["Mie", "Shiga", "Kyoto", "Osaka", "Hyogo", "Nara", "Wakayama"],
    "CHUGOKU": ["Tottori", "Shimane", "Okayama", "Hiroshima", "Yamaguchi"],
    "SHIKOKU": ["Tokushima", "Kagawa", "Ehime", "Kochi"],
    "KYUSHU": ["Fukuoka", "Saga", "Nagasaki", "Kumamoto", "Oita", "Miyazaki", "Kagoshima"],
    "OKINAWA": ["Okinawa"],
}

STORE_TYPES = ["FLAGSHIP", "STANDARD", "EXPRESS", "OUTLET"]
STORE_STATUSES = ["ACTIVE", "INACTIVE", "RENOVATION"]
PRODUCT_STATUSES = ["ACTIVE", "DISCONTINUED", "SEASONAL"]
PRODUCT_CATEGORIES: List[Tuple[str, List[str]]] = [
    ("Food & Beverage", ["Snacks", "Beverages", "Fresh Produce", "Frozen Foods"]),
    ("Electronics", ["Mobile", "Computers", "Audio", "Accessories"]),
    ("Apparel", ["Men", "Women", "Kids", "Sportswear"]),
    ("Home & Living", ["Furniture", "Kitchen", "Decor", "Bedding"]),
    ("Health & Beauty", ["Skincare", "Cosmetics", "Supplements", "Personal Care"]),
    ("Sports & Outdoors", ["Fitness", "Camping", "Cycling", "Team Sports"]),
]

CUSTOMER_STATUSES = ["ACTIVE", "INACTIVE", "SUSPENDED"]
MEMBERSHIP_TIERS = ["STANDARD", "SILVER", "GOLD", "PLATINUM"]
GENDERS = ["MALE", "FEMALE", "OTHER", "UNKNOWN"]
AGE_GROUPS = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"]

SUPPLIER_STATUSES = ["ACTIVE", "INACTIVE", "ON_HOLD"]
STOCK_STATUSES = ["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK", "OVERSTOCK"]
PAYMENT_METHODS = ["CASH", "CREDIT_CARD", "DEBIT_CARD", "MOBILE_PAY", "GIFT_CARD"]
TRANSACTION_STATUSES = ["COMPLETED", "PENDING", "CANCELLED", "REFUNDED"]
PROMOTION_TYPES = ["PERCENTAGE", "FIXED_AMOUNT", "BUNDLE", "LOYALTY"]
PROMOTION_STATUSES = ["ACTIVE", "PLANNED", "EXPIRED", "CANCELLED"]
RETURN_STATUSES = ["COMPLETED", "PENDING", "REJECTED", "PROCESSING"]
RETURN_REASONS = [
    "Defective product",
    "Wrong item received",
    "Changed mind",
    "Better price elsewhere",
    "Damaged during delivery",
    "Size or fit issue",
    "Expired product",
]

MAX_INVENTORY_CROSS_PRODUCT = 1_000_000
PREVIEW_ROW_LIMIT = 25
