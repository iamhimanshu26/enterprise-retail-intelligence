import { formatCurrency, formatNumber, formatPercent } from '@/lib/formatters'

export type ChartValueFormat = 'number' | 'currency' | 'percent' | 'compact'

export function formatChartValue(value: number, format: ChartValueFormat = 'number'): string {
  switch (format) {
    case 'currency':
      return formatCurrency(value, true)
    case 'percent':
      return formatPercent(value)
    case 'compact':
      return formatNumber(value, true)
    default:
      return formatNumber(value)
  }
}

export function chartTooltipFormatter(
  value: number,
  name: string,
  format: ChartValueFormat = 'number',
): [string, string] {
  return [formatChartValue(value, format), name]
}

export function shortenLabel(label: string, max = 12): string {
  if (label.length <= max) return label
  return `${label.slice(0, max - 1)}…`
}
