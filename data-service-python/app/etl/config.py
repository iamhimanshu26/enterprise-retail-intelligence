"""ETL configuration, entity schemas, and pipeline settings."""

from enum import Enum
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class LoadStrategy(str, Enum):
    FULL = "full"
    INCREMENTAL = "incremental"
    APPEND = "append"
    REPLACE = "replace"


class SourceFormat(str, Enum):
    CSV = "csv"
    EXCEL = "xlsx"
    JSON = "json"
    POSTGRES = "postgres"
    MEMORY = "memory"


class LoadTarget(str, Enum):
    POSTGRES = "postgres"
    DUCKDB = "duckdb"
    MEMORY = "memory"


class PipelineStage(str, Enum):
    EXTRACT = "extract"
    VALIDATE = "validate"
    CLEAN = "clean"
    TRANSFORM = "transform"
    NORMALIZE = "normalize"
    AGGREGATE = "aggregate"
    LOAD = "load"
    REPORT = "report"


class CleaningEngineStage(str, Enum):
    PROFILE = "profile"
    MISSING_VALUES = "missing_values"
    DUPLICATE_DETECTION = "duplicate_detection"
    CLEAN = "clean"
    STANDARDIZE = "standardize"
    NORMALIZE = "normalize"
    TRANSFORM = "transform"
    BUSINESS_RULES = "business_rules"
    QUALITY_SCORE = "quality_score"
    AUDIT_LOG = "audit_log"


CLEANING_STAGE_ORDER: List[CleaningEngineStage] = [
    CleaningEngineStage.PROFILE,
    CleaningEngineStage.MISSING_VALUES,
    CleaningEngineStage.DUPLICATE_DETECTION,
    CleaningEngineStage.CLEAN,
    CleaningEngineStage.STANDARDIZE,
    CleaningEngineStage.NORMALIZE,
    CleaningEngineStage.TRANSFORM,
    CleaningEngineStage.BUSINESS_RULES,
    CleaningEngineStage.QUALITY_SCORE,
    CleaningEngineStage.AUDIT_LOG,
]


STAGE_ORDER: List[PipelineStage] = [
    PipelineStage.EXTRACT,
    PipelineStage.VALIDATE,
    PipelineStage.CLEAN,
    PipelineStage.TRANSFORM,
    PipelineStage.NORMALIZE,
    PipelineStage.AGGREGATE,
    PipelineStage.LOAD,
    PipelineStage.REPORT,
]

REGION_ENUM = [
    "HOKKAIDO", "TOHOKU", "KANTO", "CHUBU", "KANSAI",
    "CHUGOKU", "SHIKOKU", "KYUSHU", "OKINAWA",
]

STORE_STATUS_ENUM = ["ACTIVE", "INACTIVE", "RENOVATION"]
STORE_TYPE_ENUM = ["FLAGSHIP", "STANDARD", "EXPRESS", "OUTLET"]
PAYMENT_METHOD_ENUM = ["CASH", "CREDIT_CARD", "DEBIT_CARD", "MOBILE_PAY", "GIFT_CARD"]
TRANSACTION_STATUS_ENUM = ["COMPLETED", "PENDING", "CANCELLED", "REFUNDED"]

ENTITY_SCHEMAS: Dict[str, Dict[str, Any]] = {
    "stores": {
        "primary_key": "store_code",
        "required_columns": [
            "store_code", "store_name", "region", "prefecture",
            "city", "address", "store_type", "opening_date", "status",
        ],
        "types": {
            "store_code": "string",
            "store_name": "string",
            "region": "string",
            "prefecture": "string",
            "city": "string",
            "address": "string",
            "store_type": "string",
            "opening_date": "date",
            "status": "string",
        },
        "enums": {
            "region": REGION_ENUM,
            "status": STORE_STATUS_ENUM,
            "store_type": STORE_TYPE_ENUM,
        },
    },
    "products": {
        "primary_key": "product_code",
        "required_columns": [
            "product_code", "product_name", "category", "unit_price",
            "cost_price", "status",
        ],
        "types": {
            "product_code": "string",
            "product_name": "string",
            "category": "string",
            "sub_category": "string",
            "brand": "string",
            "unit_price": "numeric",
            "cost_price": "numeric",
            "status": "string",
        },
        "enums": {
            "status": ["ACTIVE", "DISCONTINUED", "SEASONAL"],
        },
    },
    "sales_transactions": {
        "primary_key": "transaction_code",
        "required_columns": [
            "transaction_code", "transaction_date", "payment_method",
            "total_amount", "transaction_status",
        ],
        "types": {
            "transaction_code": "string",
            "transaction_date": "datetime",
            "payment_method": "string",
            "total_amount": "numeric",
            "total_cost": "numeric",
            "gross_profit": "numeric",
            "discount_amount": "numeric",
            "tax_amount": "numeric",
            "transaction_status": "string",
        },
        "enums": {
            "payment_method": PAYMENT_METHOD_ENUM,
            "transaction_status": TRANSACTION_STATUS_ENUM,
        },
    },
}

REGION_ALIASES: Dict[str, str] = {
    "kanto": "KANTO",
    "Kanto": "KANTO",
    "KANTO REGION": "KANTO",
    "kansai": "KANSAI",
    "Kansai": "KANSAI",
}

PAYMENT_ALIASES: Dict[str, str] = {
    "credit card": "CREDIT_CARD",
    "Credit Card": "CREDIT_CARD",
    "mobile pay": "MOBILE_PAY",
    "Mobile Pay": "MOBILE_PAY",
    "cash": "CASH",
}

STATUS_ALIASES: Dict[str, str] = {
    "active": "ACTIVE",
    "inactive": "INACTIVE",
    "completed": "COMPLETED",
    "pending": "PENDING",
}

PREFECTURE_ALIASES: Dict[str, str] = {
    "TOKYO": "Tokyo",
    "tokyo": "Tokyo",
    "東京都": "Tokyo",
    "OSAKA": "Osaka",
    "osaka": "Osaka",
    "大阪府": "Osaka",
    "KANAGAWA": "Kanagawa",
    "kanagawa": "Kanagawa",
    "神奈川県": "Kanagawa",
    "HOKKAIDO": "Hokkaido",
    "hokkaido": "Hokkaido",
    "北海道": "Hokkaido",
}


class ExtractConfig(BaseModel):
    source_format: SourceFormat = SourceFormat.CSV
    entity: str = "stores"
    connection_string: Optional[str] = None
    table_name: Optional[str] = None


class CleanConfig(BaseModel):
    null_strategy: str = Field("mark", description="mark | fill | drop")
    remove_duplicates: bool = True
    trim_whitespace: bool = True
    standardize_strings: bool = True
    detect_invalid: bool = True


class TransformConfig(BaseModel):
    compute_gross_margin: bool = True
    parse_dates: bool = True
    currency_precision: int = 2


class LoadStrategy(str, Enum):
    FULL = "full"
    INCREMENTAL = "incremental"
    APPEND = "append"
    REPLACE = "replace"


class LoadConfig(BaseModel):
    target: LoadTarget = LoadTarget.DUCKDB
    dry_run: bool = False
    table_prefix: str = "retail_"
    strategy: LoadStrategy = LoadStrategy.REPLACE


class WarehouseConfig(BaseModel):
    target: LoadTarget = LoadTarget.DUCKDB
    strategy: LoadStrategy = LoadStrategy.REPLACE
    enabled: bool = True


class PipelineConfig(BaseModel):
    pipeline_name: str = "retail_etl_pipeline"
    entity: str = "stores"
    extract: ExtractConfig = Field(default_factory=ExtractConfig)
    clean: CleanConfig = Field(default_factory=CleanConfig)
    transform: TransformConfig = Field(default_factory=TransformConfig)
    load: LoadConfig = Field(default_factory=LoadConfig)
    warehouse: WarehouseConfig = Field(default_factory=WarehouseConfig)
    run_aggregations: bool = True
    use_cleaning_engine: bool = True
    use_warehouse: bool = True


class StageInfo(BaseModel):
    id: str
    title: str
    description: str
    status: str = "foundation_ready"
    order: int


def get_cleaning_engine_stages() -> List[StageInfo]:
    meta = {
        CleaningEngineStage.PROFILE: ("Data Profiling", "Row/column stats, nulls, duplicates, distributions"),
        CleaningEngineStage.MISSING_VALUES: ("Missing Values", "Detect and handle nulls, empties, placeholders"),
        CleaningEngineStage.DUPLICATE_DETECTION: ("Duplicate Detection", "Exact, partial, and business-key duplicates"),
        CleaningEngineStage.CLEAN: ("Data Cleaning", "Tracked cleaning with audit trail"),
        CleaningEngineStage.STANDARDIZE: ("Standardization", "Store names, categories, customer names"),
        CleaningEngineStage.NORMALIZE: ("Normalization", "Regions, prefectures, cities, payment methods"),
        CleaningEngineStage.TRANSFORM: ("Transformation", "Dates, currency, derived metrics"),
        CleaningEngineStage.BUSINESS_RULES: ("Business Rules", "Revenue, inventory, discount, date rules"),
        CleaningEngineStage.QUALITY_SCORE: ("Quality Score", "Completeness, consistency, validity, uniqueness"),
        CleaningEngineStage.AUDIT_LOG: ("Audit Log", "Every transformation recorded with timestamp"),
    }
    return [
        StageInfo(
            id=stage.value,
            title=meta[stage][0],
            description=meta[stage][1],
            status="engine_ready",
            order=i + 1,
        )
        for i, stage in enumerate(CLEANING_STAGE_ORDER)
    ]


def get_pipeline_stages() -> List[StageInfo]:
    descriptions = {
        PipelineStage.EXTRACT: "Load data from CSV, Excel, JSON, or PostgreSQL sources",
        PipelineStage.VALIDATE: "Schema, types, keys, enums, and date format validation",
        PipelineStage.CLEAN: "Null handling, duplicates, trimming, invalid record tracking",
        PipelineStage.TRANSFORM: "Currency, dates, derived metrics, calculated totals",
        PipelineStage.NORMALIZE: "Regions, categories, payment methods, status consistency",
        PipelineStage.AGGREGATE: "Sales by region, store, category, and month",
        PipelineStage.LOAD: "PostgreSQL and DuckDB load abstractions",
        PipelineStage.REPORT: "Execution metrics, quality score, success rate",
    }
    titles = {
        PipelineStage.EXTRACT: "Extract",
        PipelineStage.VALIDATE: "Validate",
        PipelineStage.CLEAN: "Clean",
        PipelineStage.TRANSFORM: "Transform",
        PipelineStage.NORMALIZE: "Normalize",
        PipelineStage.AGGREGATE: "Aggregate",
        PipelineStage.LOAD: "Load",
        PipelineStage.REPORT: "Report",
    }
    return [
        StageInfo(
            id=stage.value,
            title=titles[stage],
            description=descriptions[stage],
            order=i + 1,
        )
        for i, stage in enumerate(STAGE_ORDER)
    ]
