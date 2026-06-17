import { CHART_THEME, getChartColor } from '../utils/chartTheme'
import type { ChartSeriesPoint } from '../adapters/chartAdapters'

interface ChartLegendProps {
  data: ChartSeriesPoint[]
  className?: string
}

export function ChartLegend({ data, className }: ChartLegendProps) {
  if (!data.length) return null

  return (
    <ul className={className ?? 'mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground'}>
      {data.slice(0, 6).map((item, index) => (
        <li key={item.label} className="flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: getChartColor(index) }}
            aria-hidden="true"
          />
          <span>{item.label}</span>
        </li>
      ))}
      {data.length > 6 && <li>+{data.length - 6} more</li>}
    </ul>
  )
}

export const chartLegendStyle = CHART_THEME.legend
