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
import { chartTooltipFormatter } from '../utils/chartFormatter'
import { CHART_THEME, getChartColor, tooltipStyle } from '../utils/chartTheme'
import type { BaseChartProps } from './types'

export const EnterpriseLineChart = memo(function EnterpriseLineChart({
  data,
  dataKey = 'value',
  valueFormat = 'number',
  showLegend = false,
  height = 'h-full',
  className,
}: BaseChartProps) {
  if (!data.length) return null

  return (
    <div className={className ?? height}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={CHART_THEME.margin}>
          <CartesianGrid strokeDasharray={CHART_THEME.grid.strokeDasharray} stroke={CHART_THEME.grid.stroke} opacity={CHART_THEME.grid.opacity} />
          <XAxis dataKey="label" tick={CHART_THEME.axis.tick} stroke={CHART_THEME.axis.stroke} />
          <YAxis tick={CHART_THEME.axis.tick} stroke={CHART_THEME.axis.stroke} />
          <Tooltip
            {...tooltipStyle}
            formatter={(value, name) => chartTooltipFormatter(Number(value), String(name), valueFormat)}
          />
          {showLegend && <Legend wrapperStyle={CHART_THEME.legend.wrapperStyle} />}
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={getChartColor(0)}
            strokeWidth={CHART_THEME.strokeWidth}
            dot={{ r: CHART_THEME.dotRadius }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
})
