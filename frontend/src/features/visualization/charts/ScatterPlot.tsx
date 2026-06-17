import { memo } from 'react'
import {
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts'
import { chartTooltipFormatter } from '../utils/chartFormatter'
import { CHART_THEME, getChartColor, tooltipStyle } from '../utils/chartTheme'
import type { BaseChartProps } from './types'

export const EnterpriseScatterPlot = memo(function EnterpriseScatterPlot({
  data,
  dataKey = 'value',
  valueFormat = 'number',
  showLegend = false,
  height = 'h-full',
  className,
}: BaseChartProps) {
  if (!data.length) return null

  const scatterData = data.map((point) => ({
    label: point.label,
    x: point.value,
    y: typeof point.secondary === 'number' ? point.secondary : point.value * 0.8,
    z: point.value,
  }))

  return (
    <div className={className ?? height}>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={CHART_THEME.margin}>
          <CartesianGrid strokeDasharray={CHART_THEME.grid.strokeDasharray} stroke={CHART_THEME.grid.stroke} opacity={CHART_THEME.grid.opacity} />
          <XAxis type="number" dataKey="x" name="X" tick={CHART_THEME.axis.tick} stroke={CHART_THEME.axis.stroke} />
          <YAxis type="number" dataKey="y" name="Y" tick={CHART_THEME.axis.tick} stroke={CHART_THEME.axis.stroke} />
          <ZAxis type="number" dataKey="z" range={[60, 400]} />
          <Tooltip
            {...tooltipStyle}
            formatter={(value, name) => chartTooltipFormatter(Number(value), String(name), valueFormat)}
            labelFormatter={(_, payload) => payload?.[0]?.payload?.label ?? ''}
          />
          {showLegend && <Legend wrapperStyle={CHART_THEME.legend.wrapperStyle} />}
          <Scatter name={dataKey} data={scatterData} fill={getChartColor(2)} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
})
