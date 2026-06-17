import { ArrowDown } from 'lucide-react'
import { SectionContainer } from '@/components/design-system'
import { METHODOLOGY_STEPS } from './dashboardGalleryConfig'

export function VisualizationMethodologyPanel() {
  return (
    <SectionContainer
      title="Visualization Methodology"
      description="How statistics, analytics, and intelligence feed executive visuals — and where forecasting plugs in."
    >
      <div className="space-y-3">
        {METHODOLOGY_STEPS.map((step, index) => (
          <div key={step.title} className="relative rounded-xl border border-border/80 bg-card p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {index + 1}
              </span>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            </div>
            {index < METHODOLOGY_STEPS.length - 1 && (
              <ArrowDown className="absolute -bottom-3 left-6 h-4 w-4 text-muted-foreground/60" aria-hidden="true" />
            )}
          </div>
        ))}
      </div>
    </SectionContainer>
  )
}
