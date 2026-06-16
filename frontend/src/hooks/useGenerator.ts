import { useCallback, useEffect, useRef, useState } from 'react'
import {
  getGeneratorDefaults,
  getJobStatus,
  getPreview,
  startGeneration,
} from '@/lib/dataServiceApi'
import { addGenerationHistory } from '@/lib/generatorHistory'
import type {
  GeneratorConfig,
  GeneratorDefaults,
  GenerationJobStatus,
  PreviewData,
} from '@/types/generator'

export function useGenerator() {
  const [defaults, setDefaults] = useState<GeneratorDefaults | null>(null)
  const [config, setConfig] = useState<GeneratorConfig | null>(null)
  const [job, setJob] = useState<GenerationJobStatus | null>(null)
  const [preview, setPreview] = useState<PreviewData | null>(null)
  const [previewEntity, setPreviewEntity] = useState('stores')
  const [loadingDefaults, setLoadingDefaults] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const loadDefaults = useCallback(async () => {
    setLoadingDefaults(true)
    setError(null)
    try {
      const data = await getGeneratorDefaults()
      setDefaults(data)
      setConfig({
        dataset_name: 'retail_dataset',
        counts: data.counts,
        simulation: data.simulation,
        data_quality: data.data_quality,
      })
      setPreviewEntity(data.entities[0] ?? 'stores')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load generator defaults. Ensure the data service is running.',
      )
    } finally {
      setLoadingDefaults(false)
    }
  }, [])

  useEffect(() => {
    loadDefaults()
  }, [loadDefaults])

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }, [])

  const pollJob = useCallback(
    (jobId: string) => {
      stopPolling()
      pollRef.current = setInterval(async () => {
        try {
          const status = await getJobStatus(jobId)
          setJob(status)

          if (status.status === 'completed' || status.status === 'failed') {
            stopPolling()
            if (status.status === 'completed' && status.summary) {
              addGenerationHistory({
                id: jobId,
                job_id: jobId,
                dataset_name: status.dataset_name,
                timestamp: status.completed_at ?? new Date().toISOString(),
                record_count: status.summary.total_records,
                duration_seconds: status.summary.generation_duration_seconds,
              })
              const previewData = await getPreview(jobId, previewEntity)
              setPreview(previewData)
            }
          }
        } catch {
          stopPolling()
        }
      }, 800)
    },
    [previewEntity, stopPolling],
  )

  const runGeneration = useCallback(async () => {
    if (!config) return
    setError(null)
    setPreview(null)
    try {
      const started = await startGeneration(config)
      const initialJob: GenerationJobStatus = {
        job_id: started.job_id,
        dataset_name: started.dataset_name,
        status: started.status as GenerationJobStatus['status'],
        progress: 0,
        current_step: 'queued',
        elapsed_seconds: 0,
      }
      setJob(initialJob)
      pollJob(started.job_id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start generation')
    }
  }, [config, pollJob])

  const loadPreview = useCallback(
    async (entity: string) => {
      if (!job?.job_id || job.status !== 'completed') return
      setPreviewEntity(entity)
      try {
        const data = await getPreview(job.job_id, entity)
        setPreview(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load preview')
      }
    },
    [job],
  )

  useEffect(() => {
    return () => stopPolling()
  }, [stopPolling])

  const updateConfig = useCallback((partial: Partial<GeneratorConfig>) => {
    setConfig((prev) => (prev ? { ...prev, ...partial } : prev))
  }, [])

  const inventoryEstimate = config
    ? Math.min(config.counts.stores * config.counts.products, 1_000_000)
    : 0

  return {
    defaults,
    config,
    job,
    preview,
    previewEntity,
    loadingDefaults,
    error,
    inventoryEstimate,
    loadDefaults,
    runGeneration,
    loadPreview,
    updateConfig,
    setPreviewEntity,
  }
}
