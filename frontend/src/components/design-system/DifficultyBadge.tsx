import { cn } from '@/lib/cn'

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'

const difficultyStyles: Record<DifficultyLevel, string> = {
  beginner: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400',
  intermediate: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400',
  advanced: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400',
  expert: 'bg-rose-500/10 text-rose-700 border-rose-500/20 dark:text-rose-400',
}

interface DifficultyBadgeProps {
  level: DifficultyLevel
  className?: string
}

export function DifficultyBadge({ level, className }: DifficultyBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
        difficultyStyles[level],
        className,
      )}
    >
      {level}
    </span>
  )
}
