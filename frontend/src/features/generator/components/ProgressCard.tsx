import { Clock, Loader2 } from 'lucide-react'
import { GeneratorCard } from './GeneratorCard'

interface ProgressCardProps {
  progress: number
  currentStep: string
  elapsedSeconds: number
  estimatedRemainingSeconds?: number
  status: string
}

export function ProgressCard({
  progress,
  currentStep,
  elapsedSeconds,
  estimatedRemainingSeconds,
  status,
}: ProgressCardProps) {
  const isActive = status === 'running' || status === 'pending'

  return (
    <GeneratorCard
      title="Generation Progress"
      description="Background generation with live progress tracking"
      icon={isActive ? <Loader2 className="h-5 w-5 animate-spin" /> : <Clock className="h-5 w-5" />}
    >
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{currentStep.replace(/_/g, ' ')}</span>
            <span>{progress.toFixed(1)}%</span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-muted/40 px-3 py-2">
            <p className="text-xs text-muted-foreground">Elapsed</p>
            <p className="font-medium">{elapsedSeconds.toFixed(1)}s</p>
          </div>
          <div className="rounded-lg bg-muted/40 px-3 py-2">
            <p className="text-xs text-muted-foreground">Est. remaining</p>
            <p className="font-medium">
              {estimatedRemainingSeconds != null ? `${estimatedRemainingSeconds.toFixed(1)}s` : '—'}
            </p>
          </div>
        </div>
      </div>
    </GeneratorCard>
  )
}
