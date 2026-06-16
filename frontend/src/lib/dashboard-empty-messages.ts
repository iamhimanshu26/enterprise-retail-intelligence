/** Guided empty-state copy for dashboard widgets — Phase-aware messaging. */
export const DASHBOARD_EMPTY = {
  sales: {
    title: 'No sales data available yet.',
    description: 'Generate synthetic retail data in Phase 2 to populate this dashboard.',
  },
  forecast: {
    title: 'No forecast available.',
    description: 'Forecasting will be enabled in Phase 6.',
  },
  chart: {
    title: 'No chart data available.',
    description: 'Connect analytics APIs in Phase 5 to populate visualizations.',
  },
  table: {
    title: 'No records found.',
    description: 'Adjust filters or generate synthetic retail data in Phase 2.',
  },
  alerts: {
    title: 'No alerts to display.',
    description: 'Operational alerts will appear when monitoring services are connected.',
  },
  activity: {
    title: 'No recent activity.',
    description: 'Enterprise events will stream here once backend integrations are enabled.',
  },
  regional: {
    title: 'No regional performance data.',
    description: 'Regional analytics will populate after Phase 2 data generation.',
  },
  products: {
    title: 'No product rankings available.',
    description: 'Product intelligence requires retail catalog data from Phase 2.',
  },
  stores: {
    title: 'No store performance data.',
    description: 'Store rankings will appear once retail locations are seeded in Phase 2.',
  },
  widgets: {
    title: 'No executive widgets available.',
    description: 'Distribution widgets will load from the analytics API in future phases.',
  },
} as const
