import { motion } from 'framer-motion'
import { BarChart3 } from 'lucide-react'
import { APP_NAME } from '@/lib/constants'

interface AppSplashProps {
  visible: boolean
}

export function AppSplash({ visible }: AppSplashProps) {
  if (!visible) return null

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative flex flex-col items-center gap-6"
      >
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-3 rounded-2xl border border-primary/20 border-t-primary/60"
          />
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <BarChart3 className="h-8 w-8" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold tracking-tight text-foreground">{APP_NAME}</p>
          <p className="mt-1 text-sm text-muted-foreground">Loading enterprise platform...</p>
        </div>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              className="h-1.5 w-1.5 rounded-full bg-primary"
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
