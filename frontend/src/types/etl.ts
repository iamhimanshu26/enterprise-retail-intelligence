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
  stages: EtlStage[]
  cleaning_stages?: EtlStage[]
  supported_sources: string[]
  supported_load_targets: string[]
  entities: string[]
  sprint: string
  status: string
}

export const CLEANING_ENGINE_FLOW = [
  'Profile',
  'Validate',
  'Detect Missing',
  'Detect Duplicates',
  'Clean',
  'Normalize',
  'Transform',
  'Business Rules',
  'Quality Score',
  'Analytics Ready',
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
}

export const DEFAULT_PIPELINE_FLOW = [
  'Extract',
  'Validate',
  'Clean',
  'Transform',
  'Normalize',
  'Aggregate',
  'Load',
  'Report',
]
