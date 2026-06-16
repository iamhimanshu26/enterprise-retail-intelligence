import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useToastStore, type ToastVariant } from '@/stores/toastStore'

const VARIANT_STYLES: Record<
  ToastVariant,
  { icon: typeof Info; className: string }
> = {
  info: { icon: Info, className: 'border-border bg-card text-foreground' },
  success: { icon: CheckCircle2, className: 'border-success/30 bg-success/5 text-foreground' },
  warning: { icon: XCircle, className: 'border-warning/30 bg-warning/5 text-foreground' },
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)
  const dismissToast = useToastStore((s) => s.dismissToast)

  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2 sm:bottom-6 sm:right-6"
      aria-live="polite"
      aria-label="Notifications"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const config = VARIANT_STYLES[toast.variant]
          const Icon = config.icon

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'pointer-events-auto rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm',
                config.className,
              )}
              role="status"
            >
              <div className="flex items-start gap-3">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{toast.title}</p>
                  {toast.message && (
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{toast.message}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => dismissToast(toast.id)}
                  className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                  aria-label="Dismiss notification"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
