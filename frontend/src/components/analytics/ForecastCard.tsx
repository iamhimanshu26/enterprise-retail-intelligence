import { cn } from '@/lib/cn'

interface ForecastCardProps {
  horizon: string
  forecast?: string
  confidence?: string
  className?: string
}

export function ForecastCard({
  horizon,
  forecast = '—',
  confidence = '—',
  className,
}: ForecastCardProps) {
  return (
    <div className={cn('rounded-xl border border-border/80 bg-card p-5 shadow-sm', className)}>
      <p className="text-sm font-medium text-muted-foreground">{horizon} Forecast</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{forecast}</p>
      <p className="mt-1 text-xs text-muted-foreground">Confidence: {confidence}</p>
    </div>
  )
}
