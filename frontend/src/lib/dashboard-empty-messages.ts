export const DASHBOARD_EMPTY = {
  sales: {
    title: 'No sales data',
    description: 'Sales overview will connect to warehouse analytics APIs in Phase 5.',
  },
  chart: {
    title: 'Chart awaiting data',
    description: 'Connect analytics APIs in Phase 5 or run the ETL pipeline on generated datasets.',
  },
  table: {
    title: 'No rows to display',
    description: 'Adjust filters or run synthetic generation and ETL to populate warehouse tables.',
  },
  regional: {
    title: 'Regional data pending',
    description: 'Regional analytics will use warehouse dimensions in Phase 5.',
  },
  products: {
    title: 'Product data pending',
    description: 'Product intelligence will query dim_product after Phase 5 analytics APIs.',
  },
  stores: {
    title: 'Store data pending',
    description: 'Store rankings will use dim_store from the analytics warehouse in Phase 5.',
  },
  widgets: {
    title: 'Widgets awaiting data',
    description: 'BI widgets will use live analytics from the warehouse in Phase 5.',
  },
  activity: {
    title: 'No recent activity',
    description: 'Activity feed will reflect pipeline runs and analytics events in Phase 5.',
  },
  alerts: {
    title: 'No active alerts',
    description: 'Business alerts will use warehouse quality and anomaly rules in Phase 5.',
  },
} as const
