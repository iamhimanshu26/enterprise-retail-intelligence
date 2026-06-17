export interface MonitoringOverview {
  sprint: string
  status: string
  modules: string[]
  data_source: string
}

export interface PipelineModuleStatus {
  module_id: string
  module_name: string
  status: string
  last_run: string
  duration_seconds: number
  quality_score: number
  processed_rows: number
  trend: string
}

export interface ExecutionHistoryRow extends Record<string, unknown> {
  run_id: string
  pipeline: string
  start_time: string
  end_time: string
  duration_seconds: number
  status: string
  rows_processed: number
  failed_rows: number
  trigger_source: string
}

export interface QualityDimension {
  name: string
  score: number
  trend: string
}

export interface QualityHistoryPoint {
  label: string
  value: number
}

export interface QualityCenter {
  dimensions: QualityDimension[]
  overall_quality_index: number
  history: QualityHistoryPoint[]
}

export interface PipelineMetrics {
  success_rate: number
  failure_rate: number
  average_duration: number
  throughput: number
  rows_processed: number
  average_quality_score: number
  slowest_stage: string
  most_common_failure: string
}

export interface FailureRecord extends Record<string, unknown> {
  id: string
  category: string
  severity: string
  pipeline: string
  root_cause_placeholder: string
  suggested_action: string
  retry_recommendation: string
  frequency: number
}

export interface RetryRecord extends Record<string, unknown> {
  id: string
  pipeline: string
  retry_count: number
  retry_recommendation: string
  retryable: boolean
  next_retry_placeholder: string
  status: string
}

export interface LineageNode {
  id: string
  label: string
  description: string
}

export interface ServiceHealthItem {
  service_id: string
  service_name: string
  status: string
  latency_ms?: number | null
  message: string
}

export interface OperationalKpis {
  total_runs: number
  successful_runs: number
  failed_runs: number
  average_quality_score: number
  average_runtime: number
  total_processed_records: number
  platform_health_score: number
}

export interface MonitoringReport {
  overview: MonitoringOverview
  pipeline_modules: PipelineModuleStatus[]
  executions: ExecutionHistoryRow[]
  quality: QualityCenter
  metrics: PipelineMetrics
  failures: FailureRecord[]
  retries: RetryRecord[]
  lineage: LineageNode[]
  service_health: ServiceHealthItem[]
  operational_kpis: OperationalKpis
  execution_time_seconds: number
}

export interface OperationsCenterBundle {
  report: MonitoringReport
  source: 'api' | 'mock'
  failureByCategoryChart: import('@/features/visualization/adapters/chartAdapters').ChartSeriesPoint[]
  failureBySeverityChart: import('@/features/visualization/adapters/chartAdapters').ChartSeriesPoint[]
  failureByPipelineChart: import('@/features/visualization/adapters/chartAdapters').ChartSeriesPoint[]
  qualityHistoryChart: import('@/features/visualization/adapters/chartAdapters').ChartSeriesPoint[]
  metricsChart: import('@/features/visualization/adapters/chartAdapters').ChartSeriesPoint[]
}
