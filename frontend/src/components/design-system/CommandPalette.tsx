import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Command, Search } from 'lucide-react'
import { NAVIGATION } from '@/lib/constants'

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const commands = NAVIGATION.map((item) => ({
    id: item.id,
    label: item.label,
    description: item.description,
    path: item.path,
    group: 'Navigation',
  }))

  const filtered = commands.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(query.toLowerCase()) ||
      cmd.description.toLowerCase().includes(query.toLowerCase()),
  )

  const handleSelect = useCallback(
    (path: string) => {
      navigate(path)
      onClose()
      setQuery('')
    },
    [navigate, onClose],
  )

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.addEventListener('keydown', onKeyDown)
      return () => document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.15 }}
            className="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-card shadow-xl"
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search modules and pages..."
                className="flex-1 bg-transparent py-3.5 text-sm outline-none placeholder:text-muted-foreground"
              />
              <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium sm:inline">
                ESC
              </kbd>
            </div>
            <div className="max-h-72 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">No results found</p>
              ) : (
                filtered.map((cmd) => (
                  <button
                    key={cmd.id}
                    type="button"
                    onClick={() => handleSelect(cmd.path)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">{cmd.label}</p>
                      <p className="truncate text-xs text-muted-foreground">{cmd.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </button>
                ))
              )}
            </div>
            <div className="border-t border-border px-4 py-2.5 text-[10px] text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Command className="h-3 w-3" />K to open · Navigate modules
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export function useCommandPalette() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  return { open, setOpen, onClose: () => setOpen(false) }
}
