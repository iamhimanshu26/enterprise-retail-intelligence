import type { FormulaReference } from '@/types/statistics'
import { GeneratorCard } from '@/features/generator/components/GeneratorCard'

interface FormulaCardProps {
  formula: FormulaReference
}

export function FormulaCard({ formula }: FormulaCardProps) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/20 px-4 py-3">
      <p className="text-sm font-medium">{formula.name}</p>
      <p className="mt-1 font-mono text-xs text-primary">{formula.formula}</p>
      {formula.description && (
        <p className="mt-1 text-xs text-muted-foreground">{formula.description}</p>
      )}
    </div>
  )
}

interface MetricFormulaPanelProps {
  formulas: FormulaReference[]
}

export function MetricFormulaPanel({ formulas }: MetricFormulaPanelProps) {
  return (
    <GeneratorCard title="Formula Reference" description="Business definitions for computed statistics">
      <div className="grid gap-3 md:grid-cols-2">
        {formulas.map((f) => (
          <FormulaCard key={f.name} formula={f} />
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Future API integration: executive dashboard and forecasting modules will consume these metrics from
        `/api/v1/statistics/*` endpoints.
      </p>
    </GeneratorCard>
  )
}
