import { useMemo, useState } from 'react'
import { MetricCard, SectionContainer } from '@/components/design-system'
import type { ScenarioControls, ScenarioResult } from '@/types/forecasting'
import { applyScenarioControls } from '../adapters/forecastingAdapter'

const DEFAULT_CONTROLS: ScenarioControls = {
  demandIncreasePct: 0,
  discountImpactPct: 0,
  seasonalBoostPct: 0,
  inventoryConstraintPct: 0,
}

interface ScenarioPlannerProps {
  baseScenarios: ScenarioResult[]
  loading?: boolean
}

function formatCurrency(value: number): string {
  return `¥${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
}

function scenarioLabel(scenario: string): string {
  if (scenario === 'optimistic') return 'Optimistic'
  if (scenario === 'pessimistic') return 'Pessimistic'
  return 'Realistic'
}

export function ScenarioPlanner({ baseScenarios, loading }: ScenarioPlannerProps) {
  const [controls, setControls] = useState<ScenarioControls>(DEFAULT_CONTROLS)

  const scenarios = useMemo(
    () => applyScenarioControls(baseScenarios, controls),
    [baseScenarios, controls],
  )

  const sliders: Array<{
    key: keyof ScenarioControls
    label: string
    min: number
    max: number
  }> = [
    { key: 'demandIncreasePct', label: 'Demand increase %', min: -20, max: 30 },
    { key: 'discountImpactPct', label: 'Discount impact %', min: 0, max: 25 },
    { key: 'seasonalBoostPct', label: 'Seasonal boost %', min: 0, max: 30 },
    { key: 'inventoryConstraintPct', label: 'Inventory constraint %', min: 0, max: 25 },
  ]

  return (
    <SectionContainer
      title="Scenario Planning"
      description="Compare optimistic, realistic, and pessimistic revenue scenarios with placeholder planning controls."
    >
      {loading ? (
        <div className="h-40 animate-pulse rounded-xl bg-muted" />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-xl border border-border/80 bg-card p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-foreground">Planning Controls</h3>
            {sliders.map((slider) => (
              <div key={slider.key}>
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor={slider.key}>{slider.label}</label>
                  <span className="font-mono text-muted-foreground">{controls[slider.key]}%</span>
                </div>
                <input
                  id={slider.key}
                  type="range"
                  min={slider.min}
                  max={slider.max}
                  value={controls[slider.key]}
                  onChange={(e) =>
                    setControls((prev) => ({ ...prev, [slider.key]: Number(e.target.value) }))
                  }
                  className="mt-2 w-full accent-primary"
                />
              </div>
            ))}
            <p className="text-xs text-muted-foreground">
              Placeholder controls adjust scenario comparison client-side. Backend scenario API integration
              arrives when planning workflows are wired.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {scenarios.map((scenario) => (
              <article
                key={scenario.scenario}
                className="rounded-xl border border-border/80 bg-card p-4 shadow-sm"
              >
                <h4 className="text-sm font-semibold text-foreground">
                  {scenarioLabel(scenario.scenario)}
                </h4>
                <p className="mt-2 text-xs text-muted-foreground capitalize">{scenario.metric}</p>
                <MetricCard
                  label="Adjusted forecast"
                  value={formatCurrency(scenario.adjusted_value)}
                  change={`${scenario.adjustment_pct >= 0 ? '+' : ''}${scenario.adjustment_pct}%`}
                  trend={scenario.adjustment_pct >= 0 ? 'up' : scenario.adjustment_pct < 0 ? 'down' : 'neutral'}
                  className="mt-2 border-0 p-0 shadow-none"
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Base: {formatCurrency(scenario.base_value)}
                </p>
              </article>
            ))}
          </div>
        </div>
      )}
    </SectionContainer>
  )
}
