import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  Brain,
  Building2,
  LayoutDashboard,
  MapPin,
  Package,
  Tags,
  TrendingUp,
  Users,
} from 'lucide-react'

export interface DashboardGalleryItem {
  id: string
  title: string
  description: string
  path: string
  icon: LucideIcon
  status: 'completed' | 'in-progress'
  chartCount: number
  dataSource: string
  lastUpdated: string
}

export const DASHBOARD_GALLERY_ITEMS: DashboardGalleryItem[] = [
  {
    id: 'executive-overview',
    title: 'Executive Overview',
    description: 'C-suite KPIs, business summary, and executive widgets.',
    path: '/',
    icon: LayoutDashboard,
    status: 'completed',
    chartCount: 6,
    dataSource: 'Executive Dashboard API',
    lastUpdated: '2 min ago',
  },
  {
    id: 'sales-intelligence',
    title: 'Sales Intelligence',
    description: 'Revenue trends, regional breakdowns, and store comparisons.',
    path: '/sales',
    icon: TrendingUp,
    status: 'completed',
    chartCount: 8,
    dataSource: 'Business Analytics',
    lastUpdated: '5 min ago',
  },
  {
    id: 'inventory-intelligence',
    title: 'Inventory Intelligence',
    description: 'Stock risk, movement distribution, and reorder candidates.',
    path: '/inventory',
    icon: Package,
    status: 'completed',
    chartCount: 7,
    dataSource: 'Business Analytics',
    lastUpdated: '5 min ago',
  },
  {
    id: 'customer-analytics',
    title: 'Customer Analytics',
    description: 'Growth, segmentation, membership tiers, and purchase behavior.',
    path: '/customers',
    icon: Users,
    status: 'completed',
    chartCount: 6,
    dataSource: 'Analytics + Statistics',
    lastUpdated: '6 min ago',
  },
  {
    id: 'supplier-analytics',
    title: 'Supplier Analytics',
    description: 'Reliability, risk ranking, and delivery performance.',
    path: '/suppliers',
    icon: Building2,
    status: 'completed',
    chartCount: 6,
    dataSource: 'Business Analytics',
    lastUpdated: '6 min ago',
  },
  {
    id: 'product-analytics',
    title: 'Product Analytics',
    description: 'Top products, category contribution, and profit distribution.',
    path: '/products',
    icon: Tags,
    status: 'completed',
    chartCount: 7,
    dataSource: 'Business Analytics',
    lastUpdated: '7 min ago',
  },
  {
    id: 'regional-analytics',
    title: 'Regional Analytics',
    description: 'Japanese regional revenue, orders, and store performance.',
    path: '/regional',
    icon: MapPin,
    status: 'completed',
    chartCount: 6,
    dataSource: 'Statistics + Analytics',
    lastUpdated: '7 min ago',
  },
  {
    id: 'etl-quality',
    title: 'ETL Quality',
    description: 'Data quality dimensions, pipeline execution, and lineage.',
    path: '/etl-quality',
    icon: Activity,
    status: 'completed',
    chartCount: 5,
    dataSource: 'ETL Quality API',
    lastUpdated: '10 min ago',
  },
  {
    id: 'business-health',
    title: 'Business Health',
    description: 'Health score, KPI status, benchmarks, and executive scorecard.',
    path: '/executive-intelligence',
    icon: Brain,
    status: 'completed',
    chartCount: 6,
    dataSource: 'Executive Intelligence',
    lastUpdated: '3 min ago',
  },
]

export const METHODOLOGY_STEPS = [
  {
    title: 'Statistics Engine',
    description: 'Descriptive, time-series, regional, and distribution metrics computed on warehouse-ready data.',
  },
  {
    title: 'Business Analytics Engine',
    description: 'KPIs, sales, inventory, customer, supplier, and product analytics aggregated from warehouse tables.',
  },
  {
    title: 'Executive Intelligence Engine',
    description: 'Rule-based benchmarks, anomalies, recommendations, and business health scorecard.',
  },
  {
    title: 'Visualization Adapters',
    description: 'chartAdapters and dashboardAdapters transform API outputs into ChartSeriesPoint[] for Recharts.',
  },
  {
    title: 'Executive Visualization Studio',
    description: 'Premium BI experience combining KPI boards, target vs actual, anomalies, and dashboard gallery.',
  },
  {
    title: 'Forecasting (Phase 7)',
    description: 'Historical series will extend trend charts with projected bands and scenario overlays.',
  },
]
