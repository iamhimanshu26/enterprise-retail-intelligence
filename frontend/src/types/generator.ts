export interface EntityCountsConfig {
  stores: number
  products: number
  customers: number
  suppliers: number
  sales_transactions: number
  promotions: number
  returns: number
}

export interface SimulationConfig {
  start_date: string
  end_date: string
  seasonal_demand: boolean
  weekend_sales_boost: number
  holiday_sales_boost: number
  promotion_impact: number
  regional_distribution: boolean
  store_popularity: boolean
  product_popularity: boolean
}

export interface DataQualityConfig {
  missing_values_pct: number
  duplicate_rows_pct: number
  invalid_records_pct: number
  outliers_pct: number
  null_values_pct: number
}

export interface GeneratorConfig {
  dataset_name: string
  counts: EntityCountsConfig
  simulation: SimulationConfig
  data_quality: DataQualityConfig
  seed?: number
}

export interface GenerationSummary {
  entity_counts: Record<string, number>
  total_records: number
  estimated_size_bytes: number
  estimated_size_mb: number
  generation_duration_seconds: number
  region_breakdown: Record<string, number>
  inventory_records: number
  seed: number
}

export interface GenerationJobStatus {
  job_id: string
  dataset_name: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
  current_step: string
  started_at?: string
  completed_at?: string
  elapsed_seconds: number
  estimated_remaining_seconds?: number
  error?: string
  summary?: GenerationSummary
}

export interface PreviewData {
  entity: string
  row_count: number
  columns: string[]
  rows: Record<string, string>[]
}

export interface GeneratorDefaults {
  counts: EntityCountsConfig
  simulation: SimulationConfig
  data_quality: DataQualityConfig
  entities: string[]
}

export interface GenerationHistoryEntry {
  id: string
  dataset_name: string
  timestamp: string
  record_count: number
  export_format?: string
  duration_seconds: number
  job_id: string
}

export type ExportFormat = 'csv' | 'json' | 'xlsx' | 'parquet'

export const ENTITY_LABELS: Record<string, string> = {
  stores: 'Stores',
  suppliers: 'Suppliers',
  products: 'Products',
  customers: 'Customers',
  inventory: 'Inventory',
  promotions: 'Promotions',
  sales_transactions: 'Sales Transactions',
  sales_transaction_items: 'Sales Line Items',
  returns: 'Returns',
}

export const JAPAN_REGIONS = [
  'HOKKAIDO',
  'TOHOKU',
  'KANTO',
  'CHUBU',
  'KANSAI',
  'CHUGOKU',
  'SHIKOKU',
  'KYUSHU',
  'OKINAWA',
]
