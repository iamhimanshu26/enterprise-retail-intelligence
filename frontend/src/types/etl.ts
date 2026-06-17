export interface EtlStage {
  id: string
  title: string
  description: string
  status: string
  order: number
}

export interface EtlOverview {
  pipeline_flow: string[]
  stages: EtlStage[]
  supported_sources: string[]
  supported_load_targets: string[]
  entities: string[]
  sprint: string
  status: string
}

export const ETL_STAGE_ICONS: Record<string, string> = {
  extract: 'upload',
  validate: 'shield',
  clean: 'sparkles',
  transform: 'settings',
  normalize: 'layers',
  aggregate: 'bar-chart',
  load: 'database',
  report: 'file-text',
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
