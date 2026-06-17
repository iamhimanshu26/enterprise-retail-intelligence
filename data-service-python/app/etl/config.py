"""ETL configuration, entity schemas, and pipeline settings."""

from enum import Enum
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


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


class LoadConfig(BaseModel):
    target: LoadTarget = LoadTarget.DUCKDB
    dry_run: bool = False
    table_prefix: str = "retail_"


class PipelineConfig(BaseModel):
    pipeline_name: str = "retail_etl_pipeline"
    entity: str = "stores"
    extract: ExtractConfig = Field(default_factory=ExtractConfig)
    clean: CleanConfig = Field(default_factory=CleanConfig)
    transform: TransformConfig = Field(default_factory=TransformConfig)
    load: LoadConfig = Field(default_factory=LoadConfig)
    run_aggregations: bool = True


class StageInfo(BaseModel):
    id: str
    title: str
    description: str
    status: str = "foundation_ready"
    order: int


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
