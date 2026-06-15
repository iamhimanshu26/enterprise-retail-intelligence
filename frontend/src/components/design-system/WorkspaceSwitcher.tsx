import { useState, useRef, useEffect } from 'react'
import { Check, ChevronsUpDown, Globe } from 'lucide-react'
import { WORKSPACES } from '@/lib/constants'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { motion, AnimatePresence } from 'framer-motion'

export function WorkspaceSwitcher() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { currentWorkspaceId, setWorkspace, getCurrentWorkspace } = useWorkspaceStore()
  const current = getCurrentWorkspace()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-sm transition-colors hover:bg-muted/60"
      >
        <Globe className="h-4 w-4 text-muted-foreground" />
        <span className="hidden font-medium sm:inline">{current.label}</span>
        <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
          {current.region}
        </span>
        <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            className="absolute left-0 top-full z-50 mt-2 w-56 rounded-xl border border-border bg-card py-1 shadow-lg"
          >
            {WORKSPACES.map((workspace) => (
              <button
                key={workspace.id}
                type="button"
                onClick={() => {
                  setWorkspace(workspace.id)
                  setOpen(false)
                }}
                className="flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-muted"
              >
                <span>{workspace.label}</span>
                {currentWorkspaceId === workspace.id && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
