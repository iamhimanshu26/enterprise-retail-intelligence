import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary'
import { AppSplash } from '@/components/design-system/AppSplash'
import { ToastContainer } from '@/components/design-system/ToastContainer'
import { useThemeStore } from '@/stores/themeStore'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function ThemeInitializer({ children }: { children: React.ReactNode }) {
  const setTheme = useThemeStore((s) => s.setTheme)
  const theme = useThemeStore((s) => s.theme)

  useEffect(() => {
    setTheme(theme)
  }, [setTheme, theme])

  return <>{children}</>
}

function SplashGate({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <AnimatePresence>{showSplash && <AppSplash visible={showSplash} />}</AnimatePresence>
      {children}
    </>
  )
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeInitializer>
          <ErrorBoundary>
            <SplashGate>
              {children}
              <ToastContainer />
            </SplashGate>
          </ErrorBoundary>
        </ThemeInitializer>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
