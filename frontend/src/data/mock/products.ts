import type { ChartDataPoint, ProductRow } from '@/types/dashboard'

export const BASE_INVENTORY_DISTRIBUTION: ChartDataPoint[] = [
  { label: 'In Stock', value: 62 },
  { label: 'Low Stock', value: 18 },
  { label: 'In Transit', value: 12 },
  { label: 'Reserved', value: 8 },
]

export const BASE_TOP_PRODUCTS: ProductRow[] = [
  { id: 'p1', product: 'UltraBook Pro 16"', category: 'Electronics', revenue: 2_840_000, unitsSold: 4_820, growth: 22.4, status: 'active' },
  { id: 'p2', product: 'SmartWatch Series X', category: 'Electronics', revenue: 2_120_000, unitsSold: 8_640, growth: 18.6, status: 'promoted' },
  { id: 'p3', product: 'Premium Denim Collection', category: 'Apparel', revenue: 1_680_000, unitsSold: 12_400, growth: 11.2, status: 'active' },
  { id: 'p4', product: 'Organic Coffee Blend', category: 'Grocery', revenue: 980_000, unitsSold: 24_800, growth: 8.4, status: 'active' },
  { id: 'p5', product: 'Smart Home Hub', category: 'Electronics', revenue: 920_000, unitsSold: 6_120, growth: 26.8, status: 'promoted' },
  { id: 'p6', product: 'Luxury Skincare Set', category: 'Health & Beauty', revenue: 840_000, unitsSold: 5_680, growth: 14.2, status: 'active' },
  { id: 'p7', product: 'Outdoor Patio Set', category: 'Home & Garden', revenue: 720_000, unitsSold: 1_840, growth: -3.6, status: 'low-stock' },
  { id: 'p8', product: 'Wireless Earbuds Pro', category: 'Electronics', revenue: 680_000, unitsSold: 9_200, growth: 19.4, status: 'active' },
]

export const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Apparel', label: 'Apparel' },
  { value: 'Home & Garden', label: 'Home & Garden' },
  { value: 'Grocery', label: 'Grocery' },
  { value: 'Health & Beauty', label: 'Health & Beauty' },
]
