import { cn } from '@/lib/cn'
import {
  AlertCircle,
  Lock,
  RefreshCw,
  ServerOff,
  WifiOff,
} from 'lucide-react'
import type { DashboardErrorType } from '@/lib/dashboard-errors'
import { DASHBOARD_ERROR_PRESETS } from '@/lib/dashboard-errors'

interface ErrorStateProps {
  title?: string
  message?: string
  errorType?: DashboardErrorType
  onRetry?: () => void
  className?: string
  compact?: boolean
}

const ERROR_ICONS: Record<DashboardErrorType, typeof AlertCircle> = {
  network: WifiOff,
  empty: AlertCircle,
  unauthorized: Lock,
  unavailable: ServerOff,
  generic: AlertCircle,
}

export function ErrorState({
  title,
  message,
  errorType = 'generic',
  onRetry,
  className,
  compact = false,
}: ErrorStateProps) {
  const preset = DASHBOARD_ERROR_PRESETS[errorType]
  const Icon = ERROR_ICONS[errorType]

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 text-center',
        compact ? 'px-4 py-10' : 'px-6 py-16',
        className,
      )}
      role="alert"
    >
      <div
        className={cn(
          'mb-4 flex items-center justify-center rounded-2xl bg-destructive/10 text-destructive',
          compact ? 'h-12 w-12' : 'h-14 w-14',
        )}
      >
        <Icon className={cn(compact ? 'h-6 w-6' : 'h-7 w-7')} aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title ?? preset.title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{message ?? preset.message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Try again
        </button>
      )}
    </div>
  )
}
