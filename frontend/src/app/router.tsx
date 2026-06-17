import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell, CardSkeleton } from '@/components/design-system'
import { LoginPage } from '@/features/auth/LoginPage'
import { LandingPage } from '@/features/landing/LandingPage'
import { PlaceholderPage } from '@/features/placeholder/PlaceholderPage'
import { useAuthStore } from '@/stores/authStore'

const ExecutiveDashboard = lazy(() =>
  import('@/features/dashboard/ExecutiveDashboard').then((m) => ({
    default: m.ExecutiveDashboard,
  })),
)

const EngineeringArchitecture = lazy(() =>
  import('@/features/engineering/EngineeringArchitecture').then((m) => ({
    default: m.EngineeringArchitecture,
  })),
)

const SyntheticDataGenerator = lazy(() =>
  import('@/features/generator/SyntheticDataGenerator').then((m) => ({
    default: m.SyntheticDataGenerator,
  })),
)

const StatisticsLab = lazy(() =>
  import('@/features/statistics/StatisticsLab').then((m) => ({
    default: m.StatisticsLab,
  })),
)

const EtlPipelineStudio = lazy(() =>
  import('@/features/etl/EtlPipelineStudio').then((m) => ({
    default: m.EtlPipelineStudio,
  })),
)

const VisualizationStudio = lazy(() =>
  import('@/features/visualization/pages/VisualizationStudio').then((m) => ({
    default: m.VisualizationStudio,
  })),
)

const SalesIntelligence = lazy(() =>
  import('@/features/analytics/SalesIntelligence').then((m) => ({
    default: m.SalesIntelligence,
  })),
)

const InventoryIntelligence = lazy(() =>
  import('@/features/analytics/InventoryIntelligence').then((m) => ({
    default: m.InventoryIntelligence,
  })),
)

const CustomerAnalyticsPage = lazy(() =>
  import('@/features/analytics/CustomerAnalyticsPage').then((m) => ({
    default: m.CustomerAnalyticsPage,
  })),
)

const SupplierAnalyticsPage = lazy(() =>
  import('@/features/analytics/SupplierAnalyticsPage').then((m) => ({
    default: m.SupplierAnalyticsPage,
  })),
)

function DashboardFallback() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}

export function AppRouter() {
  return (
    <Routes>
      <Route
        path="/welcome"
        element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            <Suspense fallback={<DashboardFallback />}>
              <ExecutiveDashboard />
            </Suspense>
          }
        />
        <Route
          path="sales"
          element={
            <Suspense fallback={<DashboardFallback />}>
              <SalesIntelligence />
            </Suspense>
          }
        />
        <Route
          path="inventory"
          element={
            <Suspense fallback={<DashboardFallback />}>
              <InventoryIntelligence />
            </Suspense>
          }
        />
        <Route
          path="customers"
          element={
            <Suspense fallback={<DashboardFallback />}>
              <CustomerAnalyticsPage />
            </Suspense>
          }
        />
        <Route
          path="suppliers"
          element={
            <Suspense fallback={<DashboardFallback />}>
              <SupplierAnalyticsPage />
            </Suspense>
          }
        />
        <Route path="statistics" element={
          <Suspense fallback={<DashboardFallback />}>
            <StatisticsLab />
          </Suspense>
        } />
        <Route
          path="visualization"
          element={
            <Suspense fallback={<DashboardFallback />}>
              <VisualizationStudio />
            </Suspense>
          }
        />
        <Route path="forecasting" element={<PlaceholderPage navId="forecasting-center" />} />
        <Route path="etl" element={
          <Suspense fallback={<DashboardFallback />}>
            <EtlPipelineStudio />
          </Suspense>
        } />
        <Route path="generator" element={
          <Suspense fallback={<DashboardFallback />}>
            <SyntheticDataGenerator />
          </Suspense>
        } />
        <Route path="pipeline" element={<PlaceholderPage navId="pipeline-monitor" />} />
        <Route path="insights" element={<PlaceholderPage navId="business-insights" />} />
        <Route
          path="engineering"
          element={
            <Suspense fallback={<DashboardFallback />}>
              <EngineeringArchitecture />
            </Suspense>
          }
        />
        <Route path="settings" element={<PlaceholderPage navId="system-settings" />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
