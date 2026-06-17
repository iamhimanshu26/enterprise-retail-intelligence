import { CalendarClock, Download, FileSpreadsheet, FileText, RefreshCw, Share2, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { Breadcrumb, DateRangeSelector } from '@/components/design-system'
import { DATE_RANGE_OPTIONS, useDashboardStore } from '@/stores/dashboardStore'
import { showDashboardPlaceholder } from '@/stores/toastStore'
import { cn } from '@/lib/cn'
import type { BreadcrumbItem } from '@/types'

interface DashboardPageHeaderProps {
  title: string
  description: string
  badge?: string
  breadcrumbItems?: BreadcrumbItem[]
  lastUpdated?: string
  onRefresh?: () => void
  refreshing?: boolean
  className?: string
}

export function DashboardPageHeader({
  title,
  description,
  badge = 'Sprint 1.3 — Release Readiness',
  breadcrumbItems = [{ label: 'Executive Dashboard' }],
  lastUpdated,
  onRefresh,
  refreshing = false,
  className,
}: DashboardPageHeaderProps) {
  const dateRange = useDashboardStore((s) => s.dateRange)
  const setDateRange = useDashboardStore((s) => s.setDateRange)

  function handleRefresh() {
    onRefresh?.()
    showDashboardPlaceholder(
      'Dashboard refreshed',
      'Mock data reloaded. Live intelligence refresh uses /api/v1/intelligence when the data service is running.',
    )
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/8 via-card to-accent/5 p-6 shadow-sm sm:p-8',
        className,
      )}
    >
      <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-primary/5 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-accent/5 blur-2xl" aria-hidden="true" />

      <div className="relative space-y-5">
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              {badge}
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">{description}</p>
            {lastUpdated && (
              <p className="mt-2 text-xs text-muted-foreground">
                Last updated: <time dateTime={lastUpdated}>{lastUpdated}</time>
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="header-date-range">
              Date range
            </label>
            <select
              id="header-date-range"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-label="Date range"
            >
              {DATE_RANGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <DateRangeSelector
              label={DATE_RANGE_OPTIONS.find((o) => o.value === dateRange)?.label}
              className="hidden sm:inline-flex"
            />
            <button
              type="button"
              onClick={handleRefresh}
              disabled={!onRefresh || refreshing}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-50"
              aria-label="Refresh dashboard"
            >
              <RefreshCw className={cn('h-4 w-4', refreshing && 'animate-spin')} aria-hidden="true" />
              Refresh
            </button>
            <button
              type="button"
              onClick={() => showDashboardPlaceholder('Export CSV', 'CSV export will be enabled when analytics APIs are connected.')}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              aria-label="Export dashboard as CSV"
            >
              <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">CSV</span>
            </button>
            <button
              type="button"
              onClick={() => showDashboardPlaceholder('Export PDF', 'PDF report generation is planned for Phase 6.')}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              aria-label="Export dashboard as PDF"
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">PDF</span>
            </button>
            <button
              type="button"
              onClick={() => showDashboardPlaceholder('Schedule report', 'Scheduled reporting will be available in a future enterprise release.')}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              aria-label="Schedule dashboard report"
            >
              <CalendarClock className="h-4 w-4" aria-hidden="true" />
              <span className="hidden md:inline">Schedule</span>
            </button>
            <button
              type="button"
              onClick={() => showDashboardPlaceholder('Share dashboard', 'Shareable dashboard links will be enabled with authenticated API access.')}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              aria-label="Share dashboard"
            >
              <Share2 className="h-4 w-4" aria-hidden="true" />
              <span className="hidden md:inline">Share</span>
            </button>
            <button
              type="button"
              onClick={() => showDashboardPlaceholder('Export dashboard', 'Choose CSV or PDF export when analytics APIs are connected.')}
              className="inline-flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-sm font-medium text-primary shadow-sm transition-colors hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              aria-label="Export dashboard options"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Export
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
