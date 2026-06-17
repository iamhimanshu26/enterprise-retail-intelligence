import { Loader2, RefreshCw } from 'lucide-react'
import {
  Breadcrumb,
  MetricCard,
  PageHeader,
  SectionContainer,
  StatusBadge,
} from '@/components/design-system'
import { EnterpriseBarChart } from '@/features/visualization/charts'
import { TrendChartCard } from '@/features/visualization/containers/TrendChartCard'
import { DemandForecastTable } from '../components/DemandForecastTable'
import { ForecastAccuracyDashboard } from '../components/ForecastAccuracyCard'
import { ForecastChart } from '../components/ForecastChart'
import { ForecastMethodologyPanel } from '../components/ForecastMethodologyPanel'
import { ForecastOverview } from '../components/ForecastOverview'
import { InventoryRiskForecast } from '../components/InventoryRiskForecast'
import { ModelInformationPanel } from '../components/ModelInformationPanel'
import { ScenarioPlanner } from '../components/ScenarioPlanner'
import { StoreForecastTable } from '../components/StoreForecastTable'
import { useForecastingData } from '../hooks/useForecastingData'

export function ForecastingCenterPage() {
  const { data, isLoading, isFetching, refetch } = useForecastingData()
  const loading = isLoading || isFetching
  const report = data?.report

  return (
    <div className="space-y-8">
      <PageHeader
        title="Forecasting Center"
        description="Enterprise predictive analytics — revenue, sales, demand, inventory, and store forecasts with accuracy dashboard and scenario planning."
        badge={{ status: 'completed', label: 'Forecasting Platform Operational' }}
        actions={
          <button
            type="button"
            onClick={() => refetch()}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh forecast
          </button>
        }
      />
      <Breadcrumb items={[{ label: 'Forecasting Center' }]} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Data source" value={report?.overview.data_source ?? '—'} />
        <MetricCard
          label="Execution time"
          value={report ? `${report.execution_time_seconds}s` : '—'}
        />
        <MetricCard
          label="Models"
          value={String(report?.overview.supported_models.length ?? 4)}
        />
        <div className="flex items-center gap-2 rounded-xl border border-border/80 bg-card p-5 shadow-sm">
          <StatusBadge
            status={data?.source === 'api' ? 'completed' : 'in-progress'}
            label={data?.source === 'api' ? 'Live API' : 'Mock fallback'}
          />
          <span className="text-sm text-muted-foreground">Phase 7 Complete</span>
        </div>
      </div>

      <ForecastOverview kpis={data?.overviewKpis ?? []} loading={isLoading} />

      <SectionContainer
        title="Revenue Forecast"
        description="Historical vs projected revenue with monthly and quarterly forecast horizons."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <ForecastChart
            title="Historical vs Forecast Revenue"
            subtitle="Monthly revenue baseline vs projected"
            data={data?.revenueHistoricalVsForecast ?? []}
            loading={isLoading}
            valueFormat="currency"
            onRefresh={() => refetch()}
          />
          <TrendChartCard
            title="Monthly Revenue Forecast"
            subtitle="Projected monthly revenue with confidence band"
            data={data?.monthlyRevenueForecast ?? []}
            loading={isLoading}
            onRefresh={() => refetch()}
          >
            <EnterpriseBarChart
              data={data?.monthlyRevenueForecast ?? []}
              valueFormat="currency"
              secondaryDataKey="secondary"
              showLegend
            />
          </TrendChartCard>
          <TrendChartCard
            title="Quarterly Revenue Forecast"
            subtitle="Seasonal naive quarterly projection"
            data={data?.quarterlyRevenueForecast ?? []}
            loading={isLoading}
            onRefresh={() => refetch()}
          >
            <EnterpriseBarChart
              data={data?.quarterlyRevenueForecast ?? []}
              valueFormat="currency"
              showLegend={false}
            />
          </TrendChartCard>
        </div>
      </SectionContainer>

      <SectionContainer
        title="Sales Forecast"
        description="Historical vs projected sales volume with weekly forecast trend."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <ForecastChart
            title="Historical vs Forecast Sales"
            subtitle="Weekly sales volume baseline vs projected"
            data={data?.salesHistoricalVsForecast ?? []}
            loading={isLoading}
            onRefresh={() => refetch()}
          />
          <TrendChartCard
            title="Weekly Sales Forecast"
            subtitle="Projected weekly order volume"
            data={data?.weeklySalesForecast ?? []}
            loading={isLoading}
            onRefresh={() => refetch()}
          >
            <EnterpriseBarChart data={data?.weeklySalesForecast ?? []} showLegend={false} />
          </TrendChartCard>
        </div>
      </SectionContainer>

      {report && (
        <>
          <DemandForecastTable
            demand={report.demand}
            categoryChart={data?.categoryDemandChart ?? []}
            growthChart={data?.demandGrowthChart ?? []}
            productChart={data?.productDemandChart ?? []}
            loading={isLoading}
          />
          <SectionContainer
            title="Inventory Forecast"
            description="Stock-out risk scoring and expected usage by SKU."
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <InventoryRiskForecast inventory={report.inventory} loading={isLoading} compact />
              <TrendChartCard
                title="Inventory Risk by Product"
                data={data?.inventoryRiskChart ?? []}
                loading={isLoading}
              >
                <EnterpriseBarChart data={data?.inventoryRiskChart ?? []} valueFormat="percent" />
              </TrendChartCard>
            </div>
          </SectionContainer>
          <SectionContainer title="Store Forecast" description="Store revenue and order performance outlook.">
            <div className="grid gap-4 lg:grid-cols-2">
              <StoreForecastTable stores={report.stores} loading={isLoading} compact />
              <TrendChartCard
                title="Store Performance Forecast"
                data={data?.storePerformanceChart ?? []}
                loading={isLoading}
              >
                <EnterpriseBarChart
                  data={data?.storePerformanceChart ?? []}
                  valueFormat="currency"
                  secondaryDataKey="secondary"
                  showLegend
                />
              </TrendChartCard>
            </div>
          </SectionContainer>
          <ScenarioPlanner baseScenarios={report.scenarios.scenarios} loading={isLoading} />
          <ForecastAccuracyDashboard
            metrics={report.accuracy.metrics}
            overallScore={report.accuracy.overall_accuracy_score}
            loading={isLoading}
          />
          <ModelInformationPanel overview={report.overview} loading={isLoading} />
        </>
      )}

      <ForecastMethodologyPanel />

      <SectionContainer
        title="Forecast Recommendations"
        description="Placeholder for Phase 11 AI business insight integration."
      >
        <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-6 text-sm text-muted-foreground">
          AI-powered forecast recommendations and executive narrative insights will integrate here in Phase 11
          — AI Business Insight Engine. Current forecasts use explainable statistical baselines from the
          Phase 7 forecasting platform.
        </div>
      </SectionContainer>
    </div>
  )
}
