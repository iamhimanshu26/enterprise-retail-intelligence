import type { ExecutiveWidget } from '@/types/dashboard'
import { scaleChartData } from './sales'

export const BASE_EXECUTIVE_WIDGETS: ExecutiveWidget[] = [
  {
    id: 'w-categories',
    title: 'Top Categories',
    description: 'Revenue share by category (%)',
    items: [
      { label: 'Electronics', value: 34.2 },
      { label: 'Apparel', value: 22.8 },
      { label: 'Home & Garden', value: 16.5 },
      { label: 'Grocery', value: 14.1 },
    ],
  },
  {
    id: 'w-suppliers',
    title: 'Top Suppliers',
    description: 'Fulfillment volume share (%)',
    items: [
      { label: 'Pacific Goods Co.', value: 28.4 },
      { label: 'Nordic Retail Supply', value: 22.1 },
      { label: 'Asia Direct Ltd.', value: 18.6 },
      { label: 'Euro Logistics', value: 14.2 },
    ],
  },
  {
    id: 'w-store-growth',
    title: 'Store Growth',
    description: 'YoY store revenue growth (%)',
    items: [
      { label: 'Tokyo Flagship', value: 18.2 },
      { label: 'Manhattan Central', value: 14.6 },
      { label: 'Osaka Shinsaibashi', value: 12.8 },
      { label: 'Singapore Marina', value: 16.4 },
    ],
  },
  {
    id: 'w-product-dist',
    title: 'Product Distribution',
    description: 'SKU performance tiers (%)',
    items: [
      { label: 'High Performers', value: 42 },
      { label: 'Stable', value: 38 },
      { label: 'Underperforming', value: 14 },
      { label: 'New Launches', value: 6 },
    ],
  },
  {
    id: 'w-customer-segments',
    title: 'Customer Segments',
    description: 'Active customer mix (%)',
    items: [
      { label: 'Premium', value: 22 },
      { label: 'Regular', value: 48 },
      { label: 'Occasional', value: 22 },
      { label: 'New', value: 8 },
    ],
  },
  {
    id: 'w-revenue-dist',
    title: 'Revenue Distribution',
    description: 'Channel contribution (%)',
    items: [
      { label: 'In-Store', value: 52 },
      { label: 'E-Commerce', value: 32 },
      { label: 'Mobile App', value: 12 },
      { label: 'B2B', value: 4 },
    ],
  },
]

export function buildExecutiveWidgets(multiplier: number): ExecutiveWidget[] {
  return BASE_EXECUTIVE_WIDGETS.map((widget) => ({
    ...widget,
    items: scaleChartData(widget.items, multiplier),
  }))
}
