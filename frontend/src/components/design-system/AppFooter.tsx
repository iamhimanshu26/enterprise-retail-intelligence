import { APP_NAME } from '@/lib/constants'

export function AppFooter() {
  return (
    <footer className="border-t border-border bg-muted/20 px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">{APP_NAME}</p>
          <p className="text-xs text-muted-foreground">
            v0.1.0 · React · Spring Boot · FastAPI · PostgreSQL
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          © 2026 Retail Intelligence Platform. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
