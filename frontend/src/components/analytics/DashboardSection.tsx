import { SectionContainer } from '@/components/design-system/SectionContainer'
import { SectionHeader } from './SectionHeader'

interface DashboardSectionProps {
  title: string
  description?: string
  headerAction?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function DashboardSection({
  title,
  description,
  headerAction,
  children,
  className,
}: DashboardSectionProps) {
  return (
    <section className={className} aria-labelledby={`section-${title.replace(/\s+/g, '-').toLowerCase()}`}>
      <SectionContainer title={title} description={description} headerAction={headerAction}>
        {children}
      </SectionContainer>
    </section>
  )
}

/** Lightweight section wrapper without SectionContainer padding semantics */
export function DashboardSectionHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return <SectionHeader title={title} description={description} action={action} />
}
