import { memo } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { ChartSeriesPoint } from '@/features/visualization/adapters/chartAdapters'
import { TrendChartCard } from '@/features/visualization/containers/TrendChartCard'
import { chartTooltipFormatter } from '@/features/visualization/utils/chartFormatter'
import { CHART_THEME, getChartColor, tooltipStyle } from '@/features/visualization/utils/chartTheme'
import type { ChartValueFormat } from '@/features/visualization/utils/chartFormatter'

interface ForecastChartProps {
  title: string
  subtitle?: string
  data: ChartSeriesPoint[]
  loading?: boolean
  valueFormat?: ChartValueFormat
  historicalKey?: string
  forecastKey?: string
  onRefresh?: () => void
}

export const ForecastChart = memo(function ForecastChart({
  title,
  subtitle,
  data,
  loading,
  valueFormat = 'number',
  historicalKey = 'value',
  forecastKey = 'secondary',
  onRefresh,
}: ForecastChartProps) {
  return (
    <TrendChartCard
      title={title}
      subtitle={subtitle}
      data={data}
      loading={loading}
      onRefresh={onRefresh}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={CHART_THEME.margin}>
          <CartesianGrid
            strokeDasharray={CHART_THEME.grid.strokeDasharray}
            stroke={CHART_THEME.grid.stroke}
            opacity={CHART_THEME.grid.opacity}
          />
          <XAxis dataKey="label" tick={CHART_THEME.axis.tick} stroke={CHART_THEME.axis.stroke} />
          <YAxis tick={CHART_THEME.axis.tick} stroke={CHART_THEME.axis.stroke} />
          <Tooltip
            {...tooltipStyle}
            formatter={(value, name) =>
              chartTooltipFormatter(Number(value), String(name), valueFormat)
            }
          />
          <Legend wrapperStyle={CHART_THEME.legend.wrapperStyle} />
          <Line
            type="monotone"
            dataKey={historicalKey}
            name="Historical"
            stroke={getChartColor(2)}
            strokeWidth={CHART_THEME.strokeWidth}
            dot={{ r: CHART_THEME.dotRadius }}
          />
          <Line
            type="monotone"
            dataKey={forecastKey}
            name="Forecast"
            stroke={getChartColor(0)}
            strokeWidth={CHART_THEME.strokeWidth}
            strokeDasharray="6 4"
            dot={{ r: CHART_THEME.dotRadius }}
          />
        </LineChart>
      </ResponsiveContainer>
    </TrendChartCard>
  )
})
