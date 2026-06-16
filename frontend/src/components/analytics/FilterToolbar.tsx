import { Calendar, Filter, RotateCcw, Store, Tag } from 'lucide-react'
import { cn } from '@/lib/cn'
import {
  CATEGORY_OPTIONS,
  REGION_OPTIONS,
  STORE_OPTIONS,
} from '@/data/mock/dashboard'
import { DATE_RANGE_OPTIONS, useDashboardStore } from '@/stores/dashboardStore'

interface FilterToolbarProps {
  className?: string
}

const DEFAULT_FILTERS = {
  dateRange: '30d',
  region: 'all',
  store: 'all',
  category: 'all',
} as const

function isActiveFilter(key: keyof typeof DEFAULT_FILTERS, value: string): boolean {
  return value !== DEFAULT_FILTERS[key]
}

export function FilterToolbar({ className }: FilterToolbarProps) {
  const dateRange = useDashboardStore((s) => s.dateRange)
  const region = useDashboardStore((s) => s.region)
  const store = useDashboardStore((s) => s.store)
  const category = useDashboardStore((s) => s.category)
  const setDateRange = useDashboardStore((s) => s.setDateRange)
  const setRegion = useDashboardStore((s) => s.setRegion)
  const setStore = useDashboardStore((s) => s.setStore)
  const setCategory = useDashboardStore((s) => s.setCategory)
  const resetFilters = useDashboardStore((s) => s.resetFilters)

  const activeCount = [
    isActiveFilter('dateRange', dateRange),
    isActiveFilter('region', region),
    isActiveFilter('store', store),
    isActiveFilter('category', category),
  ].filter(Boolean).length

  const selectClass = (active: boolean) =>
    cn(
      'rounded-lg border bg-background px-3 py-2 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
      active
        ? 'border-primary/40 bg-primary/5 font-medium text-foreground'
        : 'border-input',
    )

  return (
    <div
      className={cn(
        'space-y-3 rounded-xl border border-border bg-card p-4 shadow-sm',
        className,
      )}
      role="search"
      aria-label="Dashboard filters"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Filter className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span>Filters</span>
          {activeCount > 0 && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              {activeCount} active
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={resetFilters}
          disabled={activeCount === 0}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Reset all dashboard filters"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Reset
        </button>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <Calendar className="h-3 w-3" aria-hidden="true" />
            Date Range
          </span>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
            className={selectClass(isActiveFilter('dateRange', dateRange))}
            aria-label="Date range filter"
          >
            {DATE_RANGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">Region</span>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className={selectClass(isActiveFilter('region', region))}
            aria-label="Region filter"
          >
            {REGION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <Store className="h-3 w-3" aria-hidden="true" />
            Store
          </span>
          <select
            value={store}
            onChange={(e) => setStore(e.target.value)}
            className={selectClass(isActiveFilter('store', store))}
            aria-label="Store filter"
          >
            {STORE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <Tag className="h-3 w-3" aria-hidden="true" />
            Category
          </span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={selectClass(isActiveFilter('category', category))}
            aria-label="Category filter"
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}
