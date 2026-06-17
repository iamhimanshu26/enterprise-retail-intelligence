import { memo } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { chartTooltipFormatter } from '../utils/chartFormatter'
import { CHART_THEME, getChartColor, tooltipStyle } from '../utils/chartTheme'
import type { BaseChartProps } from './types'

export const EnterpriseAreaChart = memo(function EnterpriseAreaChart({
  data,
  dataKey = 'value',
  valueFormat = 'number',
  showLegend = false,
  height = 'h-full',
  className,
}: BaseChartProps) {
  if (!data.length) return null
  const color = getChartColor(0)
  const gradientId = `area-gradient-${dataKey}`

  return (
    <div className={className ?? height}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={CHART_THEME.margin}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray={CHART_THEME.grid.strokeDasharray} stroke={CHART_THEME.grid.stroke} opacity={CHART_THEME.grid.opacity} />
          <XAxis dataKey="label" tick={CHART_THEME.axis.tick} stroke={CHART_THEME.axis.stroke} />
          <YAxis tick={CHART_THEME.axis.tick} stroke={CHART_THEME.axis.stroke} />
          <Tooltip
            {...tooltipStyle}
            formatter={(value, name) => chartTooltipFormatter(Number(value), String(name), valueFormat)}
          />
          {showLegend && <Legend wrapperStyle={CHART_THEME.legend.wrapperStyle} />}
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            fill={`url(#${gradientId})`}
            strokeWidth={CHART_THEME.strokeWidth}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
})
