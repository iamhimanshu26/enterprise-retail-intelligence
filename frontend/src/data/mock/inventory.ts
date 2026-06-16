import type { InventoryOverviewMetrics } from '@/types/dashboard'

export const BASE_INVENTORY_OVERVIEW: InventoryOverviewMetrics = {
  inventoryValue: 48_200_000,
  lowStockCount: 342,
  overstockCount: 128,
  outOfStockCount: 24,
  fastMovingCount: 89,
}

export function buildInventoryOverview(multiplier: number): InventoryOverviewMetrics {
  return {
    inventoryValue: Math.round(BASE_INVENTORY_OVERVIEW.inventoryValue * multiplier),
    lowStockCount: Math.round(BASE_INVENTORY_OVERVIEW.lowStockCount * (multiplier > 1 ? 1.1 : 1)),
    overstockCount: BASE_INVENTORY_OVERVIEW.overstockCount,
    outOfStockCount: BASE_INVENTORY_OVERVIEW.outOfStockCount,
    fastMovingCount: BASE_INVENTORY_OVERVIEW.fastMovingCount,
  }
}
