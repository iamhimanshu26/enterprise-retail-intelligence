export interface IntelligenceOverview {
  sprint: string
  status: string
  modules: string[]
  data_source: string
}

export interface ExecutiveSummaryData {
  summary: string
  highlights: string[]
  tags: string[]
  recommendation?: string | null
}

export type KpiHealthStatus = 'excellent' | 'good' | 'warning' | 'critical'
export type KpiTrendDirection = 'upward' | 'downward' | 'stable'

export interface KpiIntelligenceItem {
  id: string
  label: string
  value: number
  unit: string
  status: KpiHealthStatus
  trend: KpiTrendDirection
  benchmark_pct?: number | null
  change_pct?: number | null
  health_indicator: string
}

export interface TrendAnalysisItem {
  metric: string
  direction: string
  change_pct: number
  description: string
  seasonal_note?: string | null
}

export interface BenchmarkItem {
  metric: string
  actual: number
  target: number
  achievement_pct: number
  unit: string
}

export interface AnomalyItem {
  id: string
  anomaly_type: string
  severity: string
  metric: string
  value: number
  expected_range: string
  explanation: string
}

export interface RecommendationItem {
  id: string
  priority: string
  title: string
  description: string
  action: string
  area: string
}

export interface ScorecardDimension {
  name: string
  score: number
  status: string
  explanation: string
}

export interface ExecutiveScorecard {
  dimensions: ScorecardDimension[]
  overall_score: number
  overall_status: string
  methodology: string
}

export interface BusinessHealthCenter {
  overall_score: number
  overall_status: string
  strongest_area: string
  weakest_area: string
  highest_risk: string
  biggest_opportunity: string
}

export interface ExecutiveIntelligenceReport {
  overview: IntelligenceOverview
  executive_summary: ExecutiveSummaryData
  kpi_intelligence: KpiIntelligenceItem[]
  trends: TrendAnalysisItem[]
  benchmarks: BenchmarkItem[]
  anomalies: AnomalyItem[]
  recommendations: RecommendationItem[]
  scorecard: ExecutiveScorecard
  business_health: BusinessHealthCenter
  execution_time_seconds: number
}

export interface FormulaReference {
  name: string
  formula: string
  description?: string
}

export const INTELLIGENCE_FORMULAS: FormulaReference[] = [
  {
    name: 'Business Health Score',
    formula: 'Average of Revenue, Profit, Customer, Inventory, Store, Product, and Supplier scores',
    description: 'Composite 0–100 executive health index.',
  },
  {
    name: 'KPI Status',
    formula: 'Threshold bands: Excellent ≥ top tier · Good ≥ mid tier · Warning ≥ low tier · Critical below',
    description: 'Configurable per KPI in kpi_monitor.py.',
  },
  {
    name: 'Benchmark %',
    formula: 'Achievement % = Actual / Target × 100',
    description: 'Targets derived from operational baseline factors.',
  },
  {
    name: 'Trend Classification',
    formula: 'change > 15% acceleration · > 5% upward · < -15% slowdown · < -5% downward · else stable',
    description: 'Deterministic rules on period-over-period change.',
  },
  {
    name: 'Anomaly Threshold',
    formula: 'Z-score ≥ 2.0 (warning) · Z-score ≥ 3.0 (critical) · IQR 1.5× for discounts',
    description: 'Statistical thresholds — no ML.',
  },
  {
    name: 'Recommendation Rules',
    formula: 'IF inventory_risk > 50 THEN replenish · IF return_rate > 10% THEN investigate · etc.',
    description: 'Deterministic business rules from KPIs and anomalies.',
  },
]
