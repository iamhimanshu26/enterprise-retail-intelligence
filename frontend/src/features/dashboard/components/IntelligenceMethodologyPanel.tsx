import { GeneratorCard } from '@/features/generator/components/GeneratorCard'
import { INTELLIGENCE_FORMULAS } from '@/types/intelligence'

export function IntelligenceMethodologyPanel() {
  return (
    <GeneratorCard title="Formula & Methodology Panel" description="Transparent scoring and detection rules">
      <div className="grid gap-3 md:grid-cols-2">
        {INTELLIGENCE_FORMULAS.map((f) => (
          <div key={f.name} className="rounded-lg border border-border/60 bg-muted/20 px-4 py-3">
            <p className="text-sm font-medium">{f.name}</p>
            <p className="mt-1 font-mono text-xs text-primary">{f.formula}</p>
            {f.description && <p className="mt-1 text-xs text-muted-foreground">{f.description}</p>}
          </div>
        ))}
      </div>
    </GeneratorCard>
  )
}
