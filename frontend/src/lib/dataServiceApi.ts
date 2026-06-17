import axios from 'axios'
import { DATA_SERVICE_URL } from './constants'
import type {
  GeneratorConfig,
  GeneratorDefaults,
  GenerationJobStatus,
  PreviewData,
} from '@/types/generator'

export interface DataServiceApiResponse<T> {
  success: boolean
  message: string
  data: T
  timestamp: string
}

export const dataServiceClient = axios.create({
  baseURL: `${DATA_SERVICE_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 120000,
})

export async function getGeneratorDefaults(): Promise<GeneratorDefaults> {
  const response = await dataServiceClient.get<DataServiceApiResponse<GeneratorDefaults>>(
    '/generator/defaults',
  )
  return response.data.data
}

export interface GenerationStartResponse {
  job_id: string
  dataset_name: string
  status: string
}

export async function startGeneration(config: GeneratorConfig): Promise<GenerationStartResponse> {
  const response = await dataServiceClient.post<DataServiceApiResponse<GenerationStartResponse>>(
    '/generator/start',
    config,
  )
  return response.data.data
}

export async function getJobStatus(jobId: string): Promise<GenerationJobStatus> {
  const response = await dataServiceClient.get<DataServiceApiResponse<GenerationJobStatus>>(
    `/generator/jobs/${jobId}`,
  )
  return response.data.data
}

export async function getPreview(jobId: string, entity: string): Promise<PreviewData> {
  const response = await dataServiceClient.get<DataServiceApiResponse<PreviewData>>(
    `/generator/jobs/${jobId}/preview/${entity}`,
  )
  return response.data.data
}

export function getExportUrl(jobId: string, entity: string, format: string): string {
  return `${DATA_SERVICE_URL}/api/v1/generator/jobs/${jobId}/export/${entity}/${format}`
}

export async function getEtlOverview(): Promise<import('@/types/etl').EtlOverview> {
  const response = await dataServiceClient.get<DataServiceApiResponse<import('@/types/etl').EtlOverview>>(
    '/etl/overview',
  )
  return response.data.data
}

export async function getWarehouseSummary(): Promise<import('@/types/etl').WarehouseSummary> {
  const response = await dataServiceClient.get<
    DataServiceApiResponse<import('@/types/etl').WarehouseSummary>
  >('/etl/warehouse/summary')
  return response.data.data
}

export async function getExecutionHistory(limit = 20): Promise<{
  executions: import('@/types/etl').ExecutionRecord[]
  total: number
}> {
  const response = await dataServiceClient.get<
    DataServiceApiResponse<{ executions: import('@/types/etl').ExecutionRecord[]; total: number }>
  >('/etl/history', { params: { limit } })
  return response.data.data
}

export async function getQualityDashboard(): Promise<import('@/types/etl').QualityScore> {
  const response = await dataServiceClient.get<DataServiceApiResponse<import('@/types/etl').QualityScore>>(
    '/etl/quality/dashboard',
  )
  return response.data.data
}

export async function getSampleLineage(): Promise<import('@/types/etl').LineageData> {
  const response = await dataServiceClient.get<DataServiceApiResponse<import('@/types/etl').LineageData>>(
    '/etl/lineage/sample',
  )
  return response.data.data
}

export async function runEtlSample(): Promise<import('@/types/etl').EtlRunResult> {
  const response = await dataServiceClient.post<DataServiceApiResponse<import('@/types/etl').EtlRunResult>>(
    '/etl/run/sample',
  )
  return response.data.data
}

export async function getStatisticsOverview(): Promise<import('@/types/statistics').StatisticsOverview> {
  const response = await dataServiceClient.get<
    DataServiceApiResponse<import('@/types/statistics').StatisticsOverview>
  >('/statistics/overview')
  return response.data.data
}

export async function runStatisticsSample(): Promise<import('@/types/statistics').UnifiedStatisticsReport> {
  const response = await dataServiceClient.post<
    DataServiceApiResponse<import('@/types/statistics').UnifiedStatisticsReport>
  >('/statistics/run-sample')
  return response.data.data
}

export async function getAnalyticsOverview(): Promise<import('@/types/analytics').AnalyticsOverview> {
  const response = await dataServiceClient.get<
    DataServiceApiResponse<import('@/types/analytics').AnalyticsOverview>
  >('/analytics/overview')
  return response.data.data
}

export async function getAnalyticsKpis(): Promise<import('@/types/analytics').AnalyticsKpiAnalytics> {
  const response = await dataServiceClient.get<
    DataServiceApiResponse<import('@/types/analytics').AnalyticsKpiAnalytics>
  >('/analytics/kpis')
  return response.data.data
}

export async function getAnalyticsSales(): Promise<import('@/types/analytics').SalesAnalytics> {
  const response = await dataServiceClient.get<
    DataServiceApiResponse<import('@/types/analytics').SalesAnalytics>
  >('/analytics/sales')
  return response.data.data
}

export async function getAnalyticsStores(): Promise<import('@/types/analytics').StoreAnalytics> {
  const response = await dataServiceClient.get<
    DataServiceApiResponse<import('@/types/analytics').StoreAnalytics>
  >('/analytics/stores')
  return response.data.data
}

export async function getAnalyticsProducts(): Promise<import('@/types/analytics').ProductAnalytics> {
  const response = await dataServiceClient.get<
    DataServiceApiResponse<import('@/types/analytics').ProductAnalytics>
  >('/analytics/products')
  return response.data.data
}

export async function getAnalyticsCustomers(): Promise<import('@/types/analytics').CustomerAnalytics> {
  const response = await dataServiceClient.get<
    DataServiceApiResponse<import('@/types/analytics').CustomerAnalytics>
  >('/analytics/customers')
  return response.data.data
}

export async function getAnalyticsInventory(): Promise<import('@/types/analytics').InventoryAnalytics> {
  const response = await dataServiceClient.get<
    DataServiceApiResponse<import('@/types/analytics').InventoryAnalytics>
  >('/analytics/inventory')
  return response.data.data
}

export async function getAnalyticsSuppliers(): Promise<import('@/types/analytics').SupplierAnalytics> {
  const response = await dataServiceClient.get<
    DataServiceApiResponse<import('@/types/analytics').SupplierAnalytics>
  >('/analytics/suppliers')
  return response.data.data
}

export async function getAnalyticsPromotions(): Promise<import('@/types/analytics').PromotionAnalytics> {
  const response = await dataServiceClient.get<
    DataServiceApiResponse<import('@/types/analytics').PromotionAnalytics>
  >('/analytics/promotions')
  return response.data.data
}

export async function runAnalyticsSample(): Promise<import('@/types/analytics').BusinessAnalyticsReport> {
  const response = await dataServiceClient.post<
    DataServiceApiResponse<import('@/types/analytics').BusinessAnalyticsReport>
  >('/analytics/run-sample')
  return response.data.data
}
