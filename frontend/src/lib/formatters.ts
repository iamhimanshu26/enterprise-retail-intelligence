export function formatCurrency(value: number, compact = false): string {
  if (compact) {
    if (Math.abs(value) >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`
    if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
    if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(1)}K`
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: compact ? 1 : 0,
  }).format(value)
}

export function formatNumber(value: number, compact = false): string {
  if (compact) {
    if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
    if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  }
  return new Intl.NumberFormat('en-US').format(Math.round(value))
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`
}

export function formatKpiValue(value: number, format: 'currency' | 'number' | 'percent'): string {
  switch (format) {
    case 'currency':
      return formatCurrency(value, true)
    case 'percent':
      return `${value.toFixed(1)}%`
    default:
      return formatNumber(value, true)
  }
}

export function formatRelativeTime(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
