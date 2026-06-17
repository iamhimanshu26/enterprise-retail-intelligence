import { memo } from 'react'
import {
  Bar,
  BarChart,
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

export const EnterpriseStackedBarChart = memo(function EnterpriseStackedBarChart({
  data,
  dataKey = 'value',
  secondaryDataKey = 'secondary',
  valueFormat = 'number',
  showLegend = true,
  height = 'h-full',
  className,
}: BaseChartProps) {
  if (!data.length) return null

  return (
    <div className={className ?? height}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={CHART_THEME.marginWithLegend}>
          <CartesianGrid strokeDasharray={CHART_THEME.grid.strokeDasharray} stroke={CHART_THEME.grid.stroke} opacity={CHART_THEME.grid.opacity} />
          <XAxis dataKey="label" tick={CHART_THEME.axis.tick} stroke={CHART_THEME.axis.stroke} />
          <YAxis tick={CHART_THEME.axis.tick} stroke={CHART_THEME.axis.stroke} />
          <Tooltip
            {...tooltipStyle}
            formatter={(value, name) => chartTooltipFormatter(Number(value), String(name), valueFormat)}
          />
          {showLegend && <Legend wrapperStyle={CHART_THEME.legend.wrapperStyle} />}
          <Bar dataKey={dataKey} name="Primary" stackId="stack" fill={getChartColor(0)} radius={CHART_THEME.barRadius} />
          <Bar dataKey={secondaryDataKey} name="Secondary" stackId="stack" fill={getChartColor(1)} radius={CHART_THEME.barRadius} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
})
