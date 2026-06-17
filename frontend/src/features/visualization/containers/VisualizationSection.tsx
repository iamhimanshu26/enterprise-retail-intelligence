import type { ReactNode } from 'react'
import { SectionContainer } from '@/components/design-system'

interface VisualizationSectionProps {
  title: string
  description?: string
  children: ReactNode
}

export function VisualizationSection({ title, description, children }: VisualizationSectionProps) {
  return (
    <SectionContainer title={title} description={description}>
      <div className="grid gap-6 lg:grid-cols-2">{children}</div>
    </SectionContainer>
  )
}
