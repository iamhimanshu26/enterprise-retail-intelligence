import { NavLink } from 'react-router-dom'
import { APP_NAME, NAVIGATION } from '@/lib/constants'
import { cn } from '@/lib/cn'
import { StatusBadge } from './StatusBadge'
import { BarChart3, X } from 'lucide-react'
import { motion } from 'framer-motion'

interface SidebarProps {
  collapsed?: boolean
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export function Sidebar({ collapsed = false, mobileOpen = false, onMobileClose }: SidebarProps) {
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 lg:static lg:translate-x-0',
          collapsed ? 'w-[72px]' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <BarChart3 className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{APP_NAME.split(' ')[0]}</p>
                <p className="truncate text-[10px] text-sidebar-muted">Intelligence Suite</p>
              </div>
            )}
          </div>
          {mobileOpen && (
            <button
              type="button"
              onClick={onMobileClose}
              className="rounded-lg p-1 text-sidebar-muted hover:text-sidebar-foreground lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {NAVIGATION.map((item, index) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  onClick={onMobileClose}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all',
                      isActive
                        ? 'bg-sidebar-accent text-white shadow-sm'
                        : 'text-sidebar-muted hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
                      collapsed && 'justify-center px-2',
                    )
                  }
                >
                  <item.icon className="h-[18px] w-[18px] shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.phase > 0 && (
                        <StatusBadge
                          status={item.phase === 0 ? 'foundation' : 'future'}
                          label={`P${item.phase}`}
                          className="scale-90 opacity-70 group-hover:opacity-100"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </motion.li>
            ))}
          </ul>
        </nav>

        {!collapsed && (
          <div className="border-t border-sidebar-border p-4">
            <div className="rounded-lg bg-sidebar-accent/50 p-3">
              <p className="text-xs font-medium text-sidebar-foreground">Phase 2 — Data Generator</p>
              <p className="mt-1 text-[10px] text-sidebar-muted">
                Enterprise architecture ready for scale
              </p>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
