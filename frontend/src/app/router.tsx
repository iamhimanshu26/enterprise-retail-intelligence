import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/design-system'
import { LoginPage } from '@/features/auth/LoginPage'
import { LandingPage } from '@/features/landing/LandingPage'
import { ExecutiveDashboard } from '@/features/dashboard/ExecutiveDashboard'
import { EngineeringArchitecture } from '@/features/engineering/EngineeringArchitecture'
import { PlaceholderPage } from '@/features/placeholder/PlaceholderPage'
import { useAuthStore } from '@/stores/authStore'

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
        <Route index element={<ExecutiveDashboard />} />
        <Route path="sales" element={<PlaceholderPage navId="sales-intelligence" />} />
        <Route path="inventory" element={<PlaceholderPage navId="inventory-intelligence" />} />
        <Route path="customers" element={<PlaceholderPage navId="customer-analytics" />} />
        <Route path="suppliers" element={<PlaceholderPage navId="supplier-analytics" />} />
        <Route path="statistics" element={<PlaceholderPage navId="statistics-lab" />} />
        <Route path="forecasting" element={<PlaceholderPage navId="forecasting-center" />} />
        <Route path="etl" element={<PlaceholderPage navId="etl-pipeline-studio" />} />
        <Route path="generator" element={<PlaceholderPage navId="synthetic-data-generator" />} />
        <Route path="pipeline" element={<PlaceholderPage navId="pipeline-monitor" />} />
        <Route path="insights" element={<PlaceholderPage navId="business-insights" />} />
        <Route path="engineering" element={<EngineeringArchitecture />} />
        <Route path="settings" element={<PlaceholderPage navId="system-settings" />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
