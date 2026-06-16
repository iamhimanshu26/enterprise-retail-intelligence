import type { GenerationHistoryEntry } from '@/types/generator'

const HISTORY_KEY = 'retail_generator_history'
const MAX_ENTRIES = 50

export function getGenerationHistory(): GenerationHistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    return JSON.parse(raw) as GenerationHistoryEntry[]
  } catch {
    return []
  }
}

export function addGenerationHistory(entry: GenerationHistoryEntry): GenerationHistoryEntry[] {
  const history = getGenerationHistory()
  const updated = [entry, ...history].slice(0, MAX_ENTRIES)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
  return updated
}

export function clearGenerationHistory(): void {
  localStorage.removeItem(HISTORY_KEY)
}
