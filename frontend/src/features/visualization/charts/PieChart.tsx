import { memo } from 'react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { chartTooltipFormatter } from '../utils/chartFormatter'
import { CHART_THEME, getChartColor, tooltipStyle } from '../utils/chartTheme'
import type { BaseChartProps } from './types'

export const EnterprisePieChart = memo(function EnterprisePieChart({
  data,
  dataKey = 'value',
  valueFormat = 'percent',
  showLegend = true,
  height = 'h-full',
  className,
}: BaseChartProps) {
  if (!data.length) return null

  return (
    <div className={className ?? height}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey={dataKey} nameKey="label" cx="50%" cy="50%" outerRadius={90} paddingAngle={2}>
            {data.map((_, index) => (
              <Cell key={index} fill={getChartColor(index)} />
            ))}
          </Pie>
          <Tooltip
            {...tooltipStyle}
            formatter={(value, name) => chartTooltipFormatter(Number(value), String(name), valueFormat)}
          />
          {showLegend && <Legend wrapperStyle={CHART_THEME.legend.wrapperStyle} />}
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
})
