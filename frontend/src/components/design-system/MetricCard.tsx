import { cn } from '@/lib/cn'
import type { MetricData } from '@/types'
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { motion } from 'framer-motion'

interface MetricCardProps extends MetricData {
  className?: string
  icon?: React.ReactNode
}

export function MetricCard({ label, value, change, trend = 'neutral', className, icon }: MetricCardProps) {
  const TrendIcon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'rounded-xl border border-border/80 bg-card p-5 shadow-sm transition-all duration-300 hover:border-primary/15 hover:shadow-md',
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
      {change && (
        <div className="mt-2 flex items-center gap-1 text-xs">
          <TrendIcon
            className={cn(
              'h-3.5 w-3.5',
              trend === 'up' && 'text-success',
              trend === 'down' && 'text-destructive',
              trend === 'neutral' && 'text-muted-foreground',
            )}
          />
          <span
            className={cn(
              'font-medium',
              trend === 'up' && 'text-success',
              trend === 'down' && 'text-destructive',
              trend === 'neutral' && 'text-muted-foreground',
            )}
          >
            {change}
          </span>
          <span className="text-muted-foreground">vs last period</span>
        </div>
      )}
    </motion.div>
  )
}
