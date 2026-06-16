import { create } from 'zustand'

export type ToastVariant = 'info' | 'success' | 'warning'

export interface Toast {
  id: string
  title: string
  message?: string
  variant: ToastVariant
}

interface ToastState {
  toasts: Toast[]
  showToast: (toast: Omit<Toast, 'id'>) => void
  dismissToast: (id: string) => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  showToast: (toast) => {
    const id = crypto.randomUUID()
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }))
    window.setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((item) => item.id !== id),
      }))
    }, 4200)
  },
  dismissToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((item) => item.id !== id),
    }))
  },
}))

/** Placeholder notifications for dashboard actions not yet implemented. */
export function showDashboardPlaceholder(action: string, detail?: string) {
  useToastStore.getState().showToast({
    title: action,
    message: detail ?? 'This action is a UI placeholder. API integration arrives in a future phase.',
    variant: 'info',
  })
}
