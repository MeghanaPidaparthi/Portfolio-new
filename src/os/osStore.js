/** @typedef {'boot' | 'login' | 'desktop' | 'shutdown'} OsState */

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export const useOsStore = create(
  persist(
    (set) => ({
      /** @type {OsState} */
      osState: 'boot',
      /** @param {OsState} osState */
      setOsState: (osState) => set({ osState }),
      muted: true,
      /** @param {boolean} muted */
      setMuted: (muted) => set({ muted }),
    }),
    {
      name: 'meghana-os-preferences',
      storage: createJSONStorage(() => localStorage),
      partialize: ({ muted }) => ({ muted }),
    },
  ),
)
