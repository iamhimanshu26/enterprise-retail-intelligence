import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Breadcrumb, PageHeader, TableSkeleton } from '@/components/design-system'
import type { StatusVariant } from '@/types'
import { DashboardExportToolbar } from './DashboardExportToolbar'
import { DashboardFilterPanel } from './DashboardFilterPanel'

interface AnalyticsDashboardLayoutProps {
  title: string
  description: string
  badge?: { status: StatusVariant; label: string }
  breadcrumb: string
  children: ReactNode
  loading?: boolean
  onRefresh?: () => void
  refreshing?: boolean
  insight?: ReactNode
}

export function AnalyticsDashboardLayout({
  title,
  description,
  badge,
  breadcrumb,
  children,
  loading,
  onRefresh,
  refreshing,
  insight,
}: AnalyticsDashboardLayoutProps) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} badge={badge} />
      <Breadcrumb items={[{ label: breadcrumb }]} />
      <DashboardFilterPanel />
      <DashboardExportToolbar onRefresh={onRefresh} refreshing={refreshing} />
      {insight}
      {loading ? (
        <TableSkeleton rows={6} />
      ) : (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {children}
        </motion.div>
      )}
    </div>
  )
}
