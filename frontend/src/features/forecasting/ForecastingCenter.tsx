import { Breadcrumb, PageHeader, SectionContainer, StatusBadge } from '@/components/design-system'
import { LineChart } from 'lucide-react'

const FORECAST_MODULES = [
  { name: 'Sales Forecast', endpoint: '/api/v1/forecasting/sales', description: 'Daily, weekly, and monthly sales volume' },
  { name: 'Revenue Forecast', endpoint: '/api/v1/forecasting/revenue', description: 'Daily, weekly, monthly, and quarterly revenue' },
  { name: 'Demand Forecast', endpoint: '/api/v1/forecasting/demand', description: 'Product, category, fast/slow-moving demand' },
  { name: 'Inventory Forecast', endpoint: '/api/v1/forecasting/inventory', description: 'Stock usage, risk, and reorder placeholders' },
  { name: 'Store Forecast', endpoint: '/api/v1/forecasting/stores', description: 'Store revenue, orders, and performance risk' },
  { name: 'Accuracy Report', endpoint: '/api/v1/forecasting/accuracy', description: 'MAE, RMSE, MAPE, bias, accuracy score' },
  { name: 'Scenario Planning', endpoint: '/api/v1/forecasting/scenarios', description: 'Optimistic, realistic, pessimistic scenarios' },
]

const API_ENDPOINTS = [
  '/api/v1/forecasting/overview',
  '/api/v1/forecasting/run-sample',
  ...FORECAST_MODULES.map((m) => m.endpoint),
]

export function ForecastingCenter() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Forecasting Center"
        description="Phase 7.1 forecasting engine — sales, revenue, demand, inventory, and store prediction APIs."
        badge={{ status: 'in-progress', label: 'Phase 7.1 · API Ready' }}
      />
      <Breadcrumb items={[{ label: 'Forecasting Center' }]} />

      <SectionContainer
        title="Forecasting Engine Status"
        description="Backend foundation is live. Interactive forecast UI, scenario workspace, and accuracy dashboard arrive in Phase 7.2."
      >
        <div className="rounded-xl border border-border/80 bg-card p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <LineChart className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Forecasting Engine — Sprint 7.1 Complete</p>
              <p className="text-sm text-muted-foreground">
                Moving average, linear regression, seasonal naive, and exponential smoothing models on warehouse-ready data.
              </p>
            </div>
            <StatusBadge status="in-progress" label="Phase 7.2 UI Next" />
          </div>
        </div>
      </SectionContainer>

      <SectionContainer title="Available Forecast Modules" description="Each module is exposed via FastAPI under /api/v1/forecasting.">
        <div className="grid gap-4 sm:grid-cols-2">
          {FORECAST_MODULES.map((module) => (
            <article key={module.name} className="rounded-xl border border-border/80 bg-card p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-foreground">{module.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{module.description}</p>
              <p className="mt-2 font-mono text-xs text-muted-foreground">{module.endpoint}</p>
            </article>
          ))}
        </div>
      </SectionContainer>

      <SectionContainer title="API Endpoints" description="Use POST /api/v1/forecasting/run-sample for the unified forecasting report.">
        <ul className="space-y-2 rounded-xl border border-border/80 bg-muted/20 p-4 font-mono text-xs text-muted-foreground">
          {API_ENDPOINTS.map((endpoint) => (
            <li key={endpoint}>{endpoint}</li>
          ))}
        </ul>
      </SectionContainer>
    </div>
  )
}
