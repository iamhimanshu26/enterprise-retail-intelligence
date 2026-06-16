import type { CustomerOverviewMetrics } from '@/types/dashboard'

export const BASE_CUSTOMER_OVERVIEW: CustomerOverviewMetrics = {
  totalCustomers: 2_420_000,
  newCustomers: 184_200,
  returningCustomers: 1_892_400,
  customerGrowth: 8.6,
  averageOrderValue: 139.8,
  retentionRate: 78.4,
}

export function buildCustomerOverview(multiplier: number): CustomerOverviewMetrics {
  return {
    totalCustomers: Math.round(BASE_CUSTOMER_OVERVIEW.totalCustomers * multiplier),
    newCustomers: Math.round(BASE_CUSTOMER_OVERVIEW.newCustomers * multiplier),
    returningCustomers: Math.round(BASE_CUSTOMER_OVERVIEW.returningCustomers * multiplier),
    customerGrowth: BASE_CUSTOMER_OVERVIEW.customerGrowth,
    averageOrderValue: BASE_CUSTOMER_OVERVIEW.averageOrderValue * (0.85 + multiplier * 0.15),
    retentionRate: BASE_CUSTOMER_OVERVIEW.retentionRate,
  }
}
