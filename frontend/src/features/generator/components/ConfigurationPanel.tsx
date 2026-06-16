import { Settings2 } from 'lucide-react'
import type { GeneratorConfig } from '@/types/generator'
import { GeneratorCard } from './GeneratorCard'

interface RangeFieldProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  hint?: string
}

function RangeField({ label, value, min, max, step = 1, onChange, hint }: RangeFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums text-muted-foreground">{value.toLocaleString()}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

interface ConfigurationPanelProps {
  config: GeneratorConfig
  inventoryEstimate: number
  onChange: (config: GeneratorConfig) => void
}

export function ConfigurationPanel({ config, inventoryEstimate, onChange }: ConfigurationPanelProps) {
  const updateCounts = (key: keyof GeneratorConfig['counts'], value: number) => {
    onChange({ ...config, counts: { ...config.counts, [key]: value } })
  }

  const updateSimulation = (key: keyof GeneratorConfig['simulation'], value: boolean | number | string) => {
    onChange({ ...config, simulation: { ...config.simulation, [key]: value } })
  }

  const updateQuality = (key: keyof GeneratorConfig['data_quality'], value: number) => {
    onChange({ ...config, data_quality: { ...config.data_quality, [key]: value } })
  }

  return (
    <GeneratorCard
      title="Generator Configuration"
      description="Entity volumes, simulation rules, and data quality parameters"
      icon={<Settings2 className="h-5 w-5" />}
    >
      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium">Dataset name</label>
          <input
            type="text"
            value={config.dataset_name}
            onChange={(e) => onChange({ ...config, dataset_name: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Entity volumes</p>
          <RangeField label="Stores" value={config.counts.stores} min={1} max={500} onChange={(v) => updateCounts('stores', v)} />
          <RangeField label="Products" value={config.counts.products} min={100} max={100000} step={100} onChange={(v) => updateCounts('products', v)} />
          <RangeField label="Customers" value={config.counts.customers} min={100} max={1000000} step={1000} onChange={(v) => updateCounts('customers', v)} />
          <RangeField label="Suppliers" value={config.counts.suppliers} min={10} max={10000} step={10} onChange={(v) => updateCounts('suppliers', v)} />
          <RangeField label="Sales transactions" value={config.counts.sales_transactions} min={1000} max={10000000} step={1000} onChange={(v) => updateCounts('sales_transactions', v)} />
          <RangeField label="Promotions" value={config.counts.promotions} min={0} max={5000} step={10} onChange={(v) => updateCounts('promotions', v)} />
          <RangeField label="Returns" value={config.counts.returns} min={0} max={1000000} step={100} onChange={(v) => updateCounts('returns', v)} />
          <div className="rounded-lg bg-muted/30 px-3 py-2 text-sm">
            <span className="text-muted-foreground">Inventory records</span>
            <p className="font-medium tabular-nums">{inventoryEstimate.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Auto: stores × products (capped at 1M)</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Simulation options</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs text-muted-foreground">Start date</label>
              <input
                type="date"
                value={config.simulation.start_date}
                onChange={(e) => updateSimulation('start_date', e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">End date</label>
              <input
                type="date"
                value={config.simulation.end_date}
                onChange={(e) => updateSimulation('end_date', e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
          {[
            { key: 'seasonal_demand' as const, label: 'Seasonal demand' },
            { key: 'regional_distribution' as const, label: 'Regional distribution' },
            { key: 'store_popularity' as const, label: 'Store popularity' },
            { key: 'product_popularity' as const, label: 'Product popularity' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={config.simulation[key]}
                onChange={(e) => updateSimulation(key, e.target.checked)}
                className="rounded border-border accent-primary"
              />
              {label}
            </label>
          ))}
          <RangeField label="Weekend sales boost" value={config.simulation.weekend_sales_boost} min={0} max={1} step={0.05} onChange={(v) => updateSimulation('weekend_sales_boost', v)} />
          <RangeField label="Holiday sales boost" value={config.simulation.holiday_sales_boost} min={0} max={1} step={0.05} onChange={(v) => updateSimulation('holiday_sales_boost', v)} />
          <RangeField label="Promotion impact" value={config.simulation.promotion_impact} min={0} max={1} step={0.05} onChange={(v) => updateSimulation('promotion_impact', v)} />
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Data quality simulation (%)</p>
          <RangeField label="Missing values" value={config.data_quality.missing_values_pct} min={0} max={50} step={0.5} onChange={(v) => updateQuality('missing_values_pct', v)} />
          <RangeField label="Duplicate rows" value={config.data_quality.duplicate_rows_pct} min={0} max={20} step={0.5} onChange={(v) => updateQuality('duplicate_rows_pct', v)} />
          <RangeField label="Invalid records" value={config.data_quality.invalid_records_pct} min={0} max={20} step={0.5} onChange={(v) => updateQuality('invalid_records_pct', v)} />
          <RangeField label="Outliers" value={config.data_quality.outliers_pct} min={0} max={20} step={0.5} onChange={(v) => updateQuality('outliers_pct', v)} />
          <RangeField label="Null values" value={config.data_quality.null_values_pct} min={0} max={50} step={0.5} onChange={(v) => updateQuality('null_values_pct', v)} />
        </div>
      </div>
    </GeneratorCard>
  )
}
