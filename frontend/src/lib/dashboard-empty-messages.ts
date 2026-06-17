export const DASHBOARD_EMPTY = {
  sales: {
    title: 'No sales data',
    description: 'Use Sales Intelligence (/sales) or Phase 6 chart modules when filters return no rows.',
  },
  chart: {
    title: 'Chart awaiting data',
    description: 'Interactive charts will expand in Phase 6. Connect /api/v1/analytics or run ETL sample data.',
  },
  table: {
    title: 'No rows to display',
    description: 'Adjust filters or run synthetic generation and ETL to populate warehouse tables.',
  },
  regional: {
    title: 'Regional data pending',
    description: 'Regional visualizations will enhance in Phase 6. Analytics APIs are available now.',
  },
  products: {
    title: 'Product data pending',
    description: 'Product rankings are available via /api/v1/analytics/products and Sales Intelligence.',
  },
  stores: {
    title: 'Store data pending',
    description: 'Store rankings are available via /api/v1/analytics/stores and intelligence pages.',
  },
  widgets: {
    title: 'Widgets awaiting data',
    description: 'BI widgets will connect to Phase 6 visualization components.',
  },
  activity: {
    title: 'No recent activity',
    description: 'Activity feed will reflect pipeline runs and analytics events in Phase 6.',
  },
  alerts: {
    title: 'No active alerts',
    description: 'Anomaly alerts are available via /api/v1/intelligence/anomalies on the executive dashboard.',
  },
} as const
