import { SectionContainer } from '@/components/design-system'
import { DASHBOARD_GALLERY_ITEMS } from './dashboardGalleryConfig'
import { DashboardGalleryCard } from './DashboardGalleryCard'

export function DashboardGallery() {
  return (
    <SectionContainer
      title="Dashboard Gallery"
      description="Explore enterprise analytics dashboards — each powered by the visualization framework and adapter layer."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {DASHBOARD_GALLERY_ITEMS.map((item) => (
          <DashboardGalleryCard key={item.id} item={item} />
        ))}
      </div>
    </SectionContainer>
  )
}
