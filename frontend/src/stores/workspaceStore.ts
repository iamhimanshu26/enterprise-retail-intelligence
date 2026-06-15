import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { WORKSPACES } from '@/lib/constants'

interface WorkspaceState {
  currentWorkspaceId: string
  setWorkspace: (id: string) => void
  getCurrentWorkspace: () => (typeof WORKSPACES)[number]
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      currentWorkspaceId: WORKSPACES[0].id,
      setWorkspace: (id) => set({ currentWorkspaceId: id }),
      getCurrentWorkspace: () =>
        WORKSPACES.find((w) => w.id === get().currentWorkspaceId) ?? WORKSPACES[0],
    }),
    { name: 'workspace-storage' },
  ),
)
