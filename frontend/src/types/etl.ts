export interface EtlStage {
  id: string
  title: string
  description: string
  status: string
  order: number
}

export interface EtlOverview {
  pipeline_flow: string[]
  cleaning_flow?: string[]
  warehouse_flow?: string[]
  stages: EtlStage[]
  cleaning_stages?: EtlStage[]
  supported_sources: string[]
  supported_load_targets: string[]
  warehouse_tables?: string[]
  load_strategies?: string[]
  entities: string[]
  sprint: string
  status: string
  phase?: string
}

export interface QualityScore {
  completeness: number
  accuracy: number
  consistency: number
  validity: number
  timeliness: number
  uniqueness: number
  data_quality_index: number
  overall: number
}

export interface WarehouseSummary {
  stores: number
  products: number
  customers: number
  suppliers: number
  sales: number
  returns: number
  tables: Record<string, number>
  loaded_tables: string[]
}

export interface EtlMetrics {
  execution_time_seconds: number
  rows_processed: number
  successful_records: number
  failed_records: number
  throughput_rows_per_second: number
  memory_usage_mb: number
  cpu_usage_percent: number
}

export interface ExecutionRecord {
  pipeline_id: string
  pipeline_name: string
  entity: string
  start_time: string
  end_time: string
  duration_seconds: number
  status: string
  processed_rows: number
  failed_rows: number
  quality_score: number
  metrics: EtlMetrics
}

export interface LineageData {
  nodes: Array<{ id: string; name: string; type: string; metadata?: Record<string, unknown> }>
  edges: Array<{ source: string; target: string; transformation: string }>
  flow: string[]
}

export interface EtlRunResult {
  success: boolean
  report: Record<string, unknown>
  entity?: string
  pipeline_id?: string
  rows_in_output?: number
  quality_score?: QualityScore
  lineage?: LineageData
  metrics?: EtlMetrics
  warehouse_summary?: WarehouseSummary
  error?: string
}

export const FINAL_ETL_FLOW = [
  'Synthetic Data', 'Extract', 'Validate', 'Profile', 'Clean',
  'Normalize', 'Transform', 'Business Rules', 'Aggregate',
  'Load', 'Analytics Warehouse', 'Quality Dashboard', 'Execution Report',
]

export const WAREHOUSE_FLOW = [
  'Operational Data', 'ETL Pipeline', 'Transformation',
  'Warehouse', 'Analytics', 'Forecasting', 'AI Insights',
]

export const CLEANING_ENGINE_FLOW = [
  'Profile', 'Validate', 'Detect Missing', 'Detect Duplicates',
  'Clean', 'Normalize', 'Transform', 'Business Rules',
  'Quality Score', 'Analytics Ready',
]

export const CLEANING_UI_STAGES = [
  { id: 'profile', title: 'Data Profiling', description: 'Row/column statistics and distributions' },
  { id: 'missing_values', title: 'Missing Values', description: 'Null, empty, and placeholder handling' },
  { id: 'duplicate_detection', title: 'Duplicate Detection', description: 'Exact and business-key duplicates' },
  { id: 'standardize', title: 'Standardization', description: 'Store names, categories, customer names' },
  { id: 'transform', title: 'Transformation', description: 'Dates, currency, derived metrics' },
  { id: 'business_rules', title: 'Validation', description: 'Enterprise business rule checks' },
  { id: 'quality_score', title: 'Quality Score', description: 'Completeness, consistency, validity' },
  { id: 'audit_log', title: 'Audit Log', description: 'Traceable transformation history' },
]

export const ETL_STAGE_ICONS: Record<string, string> = {
  extract: 'upload',
  validate: 'shield',
  clean: 'sparkles',
  transform: 'settings',
  normalize: 'layers',
  aggregate: 'bar-chart',
  load: 'database',
  report: 'file-text',
  profile: 'bar-chart',
  missing_values: 'sparkles',
  duplicate_detection: 'shield',
  standardize: 'layers',
  business_rules: 'shield',
  quality_score: 'file-text',
  audit_log: 'file-text',
  warehouse: 'database',
  lineage: 'workflow',
}

export const DEFAULT_PIPELINE_FLOW = [
  'Extract', 'Validate', 'Clean', 'Transform',
  'Normalize', 'Aggregate', 'Load', 'Report',
]

export const QUALITY_DIMENSIONS = [
  { key: 'completeness', label: 'Completeness' },
  { key: 'accuracy', label: 'Accuracy' },
  { key: 'consistency', label: 'Consistency' },
  { key: 'validity', label: 'Validity' },
  { key: 'timeliness', label: 'Timeliness' },
  { key: 'uniqueness', label: 'Uniqueness' },
] as const
