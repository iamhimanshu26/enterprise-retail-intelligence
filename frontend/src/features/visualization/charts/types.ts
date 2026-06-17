import type { ReactNode } from 'react'
import type { ChartSeriesPoint } from '../adapters/chartAdapters'
import type { ChartValueFormat } from '../utils/chartFormatter'

export type { ChartSeriesPoint }

export interface BaseChartProps {
  data: ChartSeriesPoint[]
  dataKey?: string
  secondaryDataKey?: string
  loading?: boolean
  empty?: boolean
  height?: string
  valueFormat?: ChartValueFormat
  showLegend?: boolean
  className?: string
  children?: ReactNode
}

export const DEFAULT_CHART_HEIGHT = 'h-64'
