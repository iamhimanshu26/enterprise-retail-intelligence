export type Theme = 'light' | 'dark' | 'system'

export interface User {
  id: string
  email: string
  name: string
  role: string
  avatar?: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  timestamp: string
}

export interface BreadcrumbItem {
  label: string
  href?: string
}

export type StatusVariant = 'planned' | 'in-progress' | 'foundation' | 'future'

export interface ArchitectureSection {
  id: string
  title: string
  description: string
  icon: string
  status: StatusVariant
  phase: number
}

export interface MetricData {
  label: string
  value: string
  change?: string
  trend?: 'up' | 'down' | 'neutral'
}

export interface TableColumn<T> {
  key: keyof T | string
  header: string
  className?: string
  render?: (row: T) => React.ReactNode
}
