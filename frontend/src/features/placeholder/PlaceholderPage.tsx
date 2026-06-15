import {
  Breadcrumb,
  DateRangeSelector,
  EmptyState,
  FilterBar,
  PageHeader,
  SectionContainer,
  StatusBadge,
} from '@/components/design-system'
import type { NavItem } from '@/lib/constants'
import { NAVIGATION } from '@/lib/constants'
import { motion } from 'framer-motion'

interface PlaceholderPageProps {
  navId: string
}

function getNavItem(navId: string): NavItem | undefined {
  return NAVIGATION.find((item) => item.id === navId)
}

export function PlaceholderPage({ navId }: PlaceholderPageProps) {
  const navItem = getNavItem(navId)

  if (!navItem) {
    return null
  }

  const Icon = navItem.icon
  const status = navItem.phase === 0 ? 'foundation' : navItem.phase <= 1 ? 'planned' : 'future'

  return (
    <div className="space-y-8">
      <PageHeader
        title={navItem.label}
        description={navItem.description}
        badge={{ status, label: `Phase ${navItem.phase}` }}
        actions={<DateRangeSelector />}
      />

      <Breadcrumb items={[{ label: navItem.label }]} />

      <FilterBar searchPlaceholder={`Search ${navItem.label.toLowerCase()}...`} />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <SectionContainer
          title="Module Preview"
          description={`This module will be fully implemented in Phase ${navItem.phase}.`}
        >
          <EmptyState
            icon={Icon}
            title={`${navItem.label} — Coming in Phase ${navItem.phase}`}
            description={`The ${navItem.label} module is architecturally prepared but not yet implemented. The enterprise foundation in Phase 0 provides the infrastructure, routing, and UI shell required for this feature.`}
            action={
              <StatusBadge
                status={status}
                label={`Scheduled for Phase ${navItem.phase}`}
              />
            }
          />
        </SectionContainer>
      </motion.div>
    </div>
  )
}
