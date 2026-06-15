import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopNav } from './TopNav'
import { AppFooter } from './AppFooter'
import { CommandPalette, useCommandPalette } from './CommandPalette'
import { motion } from 'framer-motion'

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { open, setOpen, onClose } = useCommandPalette()

  return (
    <div className="flex min-h-screen bg-background">
      <CommandPalette open={open} onClose={onClose} />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopNav onMenuClick={() => setMobileOpen(true)} onSearchClick={() => setOpen(true)} />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8"
        >
          <Outlet />
        </motion.main>
        <AppFooter />
      </div>
    </div>
  )
}
