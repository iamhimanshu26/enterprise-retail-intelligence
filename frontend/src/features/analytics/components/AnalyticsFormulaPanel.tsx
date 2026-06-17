import type { FormulaReference } from '@/types/analytics'
import { GeneratorCard } from '@/features/generator/components/GeneratorCard'

function FormulaCard({ formula }: { formula: FormulaReference }) {
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

export function AnalyticsFormulaPanel({ formulas }: { formulas: FormulaReference[] }) {
  return (
    <GeneratorCard title="Formula & Explanation Panel" description="Key business analytics definitions">
      <div className="grid gap-3 md:grid-cols-2">
        {formulas.map((f) => (
          <FormulaCard key={f.name} formula={f} />
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Metrics are computed by the Business Analytics Engine via `/api/v1/analytics/*` endpoints.
      </p>
    </GeneratorCard>
  )
}
