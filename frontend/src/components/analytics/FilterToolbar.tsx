import { Filter } from 'lucide-react'
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

  const selectClass =
    'rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'

  return (
    <div
      className={cn(
        'flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4 shadow-sm',
        className,
      )}
      role="search"
      aria-label="Dashboard filters"
    >
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Filter className="h-4 w-4" aria-hidden="true" />
        <span>Filters</span>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">Date Range</span>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
          className={selectClass}
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
          className={selectClass}
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
        <span className="text-xs font-medium text-muted-foreground">Store</span>
        <select
          value={store}
          onChange={(e) => setStore(e.target.value)}
          className={selectClass}
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
        <span className="text-xs font-medium text-muted-foreground">Category</span>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={selectClass}
          aria-label="Category filter"
        >
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        onClick={resetFilters}
        className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
      >
        Reset
      </button>
    </div>
  )
}
