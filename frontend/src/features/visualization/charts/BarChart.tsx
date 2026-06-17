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

interface BarChartProps extends BaseChartProps {
  horizontal?: boolean
}

export const EnterpriseBarChart = memo(function EnterpriseBarChart({
  data,
  dataKey = 'value',
  secondaryDataKey,
  valueFormat = 'number',
  showLegend = false,
  horizontal = false,
  height = 'h-full',
  className,
}: BarChartProps) {
  if (!data.length) return null

  return (
    <div className={className ?? height}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout={horizontal ? 'vertical' : 'horizontal'}
          margin={horizontal ? { top: 8, right: 16, left: 8, bottom: 0 } : CHART_THEME.margin}
        >
          <CartesianGrid strokeDasharray={CHART_THEME.grid.strokeDasharray} stroke={CHART_THEME.grid.stroke} opacity={CHART_THEME.grid.opacity} />
          {horizontal ? (
            <>
              <XAxis type="number" tick={CHART_THEME.axis.tick} stroke={CHART_THEME.axis.stroke} />
              <YAxis dataKey="label" type="category" width={100} tick={CHART_THEME.axis.tick} stroke={CHART_THEME.axis.stroke} />
            </>
          ) : (
            <>
              <XAxis dataKey="label" tick={CHART_THEME.axis.tick} stroke={CHART_THEME.axis.stroke} />
              <YAxis tick={CHART_THEME.axis.tick} stroke={CHART_THEME.axis.stroke} />
            </>
          )}
          <Tooltip
            {...tooltipStyle}
            formatter={(value, name) => chartTooltipFormatter(Number(value), String(name), valueFormat)}
          />
          {showLegend && <Legend wrapperStyle={CHART_THEME.legend.wrapperStyle} />}
          <Bar
            dataKey={dataKey}
            name="Value"
            fill={getChartColor(0)}
            radius={horizontal ? CHART_THEME.barRadiusHorizontal : CHART_THEME.barRadius}
          />
          {secondaryDataKey && (
            <Bar
              dataKey={secondaryDataKey}
              name="Secondary"
              fill={getChartColor(1)}
              radius={horizontal ? CHART_THEME.barRadiusHorizontal : CHART_THEME.barRadius}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
})
