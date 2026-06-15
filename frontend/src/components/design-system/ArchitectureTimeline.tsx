import { motion } from 'framer-motion'
import { CheckCircle2, Lock, Circle } from 'lucide-react'
import { PROJECT_ROADMAP, type ProjectPhase } from '@/lib/roadmap'
import { TechBadge } from './TechBadge'
import { cn } from '@/lib/cn'

function PhaseIcon({ status }: { status: ProjectPhase['status'] }) {
  if (status === 'completed') return <CheckCircle2 className="h-5 w-5 text-success" />
  if (status === 'locked') return <Lock className="h-4 w-4 text-muted-foreground/50" />
  return <Circle className="h-4 w-4 text-primary" />
}

export function ArchitectureTimeline() {
  return (
    <div className="relative">
      <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border" />
      <div className="space-y-4">
        {PROJECT_ROADMAP.map((phase, index) => (
          <motion.div
            key={phase.phase}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.04 }}
            className={cn(
              'relative flex gap-4 rounded-xl border p-4 transition-all duration-300',
              phase.status === 'completed' &&
                'border-success/30 bg-success/5 shadow-sm hover:shadow-md',
              phase.status === 'current' &&
                'border-primary/30 bg-primary/5 shadow-sm hover:shadow-md',
              phase.status === 'locked' &&
                'border-border/60 bg-muted/20 opacity-75 hover:opacity-100',
            )}
          >
            <div
              className={cn(
                'relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 bg-card',
                phase.status === 'completed' && 'border-success',
                phase.status === 'current' && 'border-primary',
                phase.status === 'locked' && 'border-border',
              )}
            >
              <PhaseIcon status={phase.status} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Phase {phase.phase}
                </span>
                {phase.status === 'completed' && (
                  <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">
                    Completed
                  </span>
                )}
                {phase.status === 'locked' && (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    Locked
                  </span>
                )}
              </div>
              <h3 className="mt-1 font-semibold text-foreground">{phase.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{phase.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {phase.technologies.map((tech) => (
                  <TechBadge key={tech} label={tech} />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
