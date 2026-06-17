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
