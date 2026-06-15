import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  BarChart3,
  Brain,
  Building2,
  FlaskConical,
  LayoutDashboard,
  LineChart,
  Package,
  Settings,
  Sparkles,
  TrendingUp,
  Users,
  Workflow,
} from 'lucide-react'

export const APP_NAME = 'Retail Intelligence Platform'
export const APP_TAGLINE = 'Enterprise forecasting & analytics suite'

export interface NavItem {
  id: string
  label: string
  path: string
  icon: LucideIcon
  description: string
  phase: number
}

export const NAVIGATION: NavItem[] = [
  {
    id: 'executive-dashboard',
    label: 'Executive Dashboard',
    path: '/',
    icon: LayoutDashboard,
    description: 'High-level KPIs and executive insights',
    phase: 1,
  },
  {
    id: 'sales-intelligence',
    label: 'Sales Intelligence',
    path: '/sales',
    icon: TrendingUp,
    description: 'Revenue analytics and sales performance',
    phase: 2,
  },
  {
    id: 'inventory-intelligence',
    label: 'Inventory Intelligence',
    path: '/inventory',
    icon: Package,
    description: 'Stock levels, turnover, and optimization',
    phase: 2,
  },
  {
    id: 'customer-analytics',
    label: 'Customer Analytics',
    path: '/customers',
    icon: Users,
    description: 'Customer segmentation and behavior',
    phase: 2,
  },
  {
    id: 'supplier-analytics',
    label: 'Supplier Analytics',
    path: '/suppliers',
    icon: Building2,
    description: 'Supplier performance and risk analysis',
    phase: 2,
  },
  {
    id: 'statistics-lab',
    label: 'Statistics Lab',
    path: '/statistics',
    icon: FlaskConical,
    description: 'Statistical modeling and hypothesis testing',
    phase: 3,
  },
  {
    id: 'forecasting-center',
    label: 'Forecasting Center',
    path: '/forecasting',
    icon: LineChart,
    description: 'Demand forecasting and scenario planning',
    phase: 4,
  },
  {
    id: 'etl-pipeline-studio',
    label: 'ETL Pipeline Studio',
    path: '/etl',
    icon: Workflow,
    description: 'Design and manage data pipelines',
    phase: 1,
  },
  {
    id: 'synthetic-data-generator',
    label: 'Synthetic Data Generator',
    path: '/generator',
    icon: Sparkles,
    description: 'Generate realistic retail datasets',
    phase: 1,
  },
  {
    id: 'pipeline-monitor',
    label: 'Pipeline Monitor',
    path: '/pipeline',
    icon: Activity,
    description: 'Real-time pipeline health and metrics',
    phase: 1,
  },
  {
    id: 'business-insights',
    label: 'Business Insights',
    path: '/insights',
    icon: BarChart3,
    description: 'AI-powered business recommendations',
    phase: 5,
  },
  {
    id: 'engineering-architecture',
    label: 'Engineering Architecture',
    path: '/engineering',
    icon: Brain,
    description: 'System architecture and engineering docs',
    phase: 0,
  },
  {
    id: 'system-settings',
    label: 'System Settings',
    path: '/settings',
    icon: Settings,
    description: 'Platform configuration and preferences',
    phase: 0,
  },
]

export const WORKSPACES = [
  { id: 'north-america', label: 'North America', region: 'NA' },
  { id: 'europe', label: 'Europe', region: 'EU' },
  { id: 'asia-pacific', label: 'Asia Pacific', region: 'APAC' },
]

export const DEMO_CREDENTIALS = {
  email: 'executive@retailcorp.com',
  password: 'Enterprise2026!',
}

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
export const DATA_SERVICE_URL = import.meta.env.VITE_DATA_SERVICE_URL || 'http://localhost:8000'
