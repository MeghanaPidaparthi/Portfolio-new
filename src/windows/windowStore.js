import { create } from 'zustand'

const DEFAULT_SIZE = { w: 560, h: 400 }
const EDGE_MARGIN = 12

let nextId = 1

function clampSize(size) {
  return {
    w: Math.min(size.w, Math.max(280, window.innerWidth - EDGE_MARGIN * 2)),
    h: Math.min(size.h, Math.max(200, window.innerHeight - 30 - EDGE_MARGIN * 2)),
  }
}

/** Id of the focused window: the visible window with the highest z. */
export function getActiveId(windows) {
  let active = null
  for (const win of windows) {
    if (!win.minimised && (!active || win.z > active.z)) active = win
  }
  return active?.id ?? null
}

/**
 * Central window manager. Apps never manage their own windows: they only
 * render content inside the shared Window frame.
 */
export const useWindowStore = create((set) => ({
  windows: [],
  topZ: 10,

  /**
   * Open a window, or focus it if one with the same key is already open.
   * @param {{ key: string, appId: string, title: string, icon?: string, props?: object, size?: { w: number, h: number }, dialog?: boolean, center?: boolean }} options
   */
  open: ({ key, appId, title, icon, props = {}, size = DEFAULT_SIZE, dialog = false, center = false }) =>
    set((state) => {
      const existing = state.windows.find((win) => win.key === key)
      const z = state.topZ + 1

      if (existing) {
        return {
          topZ: z,
          windows: state.windows.map((win) =>
            win.id === existing.id ? { ...win, minimised: false, z } : win,
          ),
        }
      }

      const { w, h } = clampSize(size)
      const step = state.windows.length % 6
      const cascadeX = Math.min(260 + step * 28, window.innerWidth - w - EDGE_MARGIN)
      const cascadeY = Math.min(56 + step * 28, window.innerHeight - h - 30 - EDGE_MARGIN)
      const x = Math.max(0, center ? (window.innerWidth - w) / 2 : cascadeX)
      const y = Math.max(0, center ? (window.innerHeight - h) / 2 : cascadeY)

      return {
        topZ: z,
        windows: [
          ...state.windows,
          { id: nextId++, key, appId, title, icon, props, dialog, x, y, w, h, z, minimised: false, maximised: false },
        ],
      }
    }),

  close: (id) => set((state) => ({ windows: state.windows.filter((win) => win.id !== id) })),

  minimise: (id) =>
    set((state) => ({
      windows: state.windows.map((win) => (win.id === id ? { ...win, minimised: true } : win)),
    })),

  restore: (id) =>
    set((state) => ({
      topZ: state.topZ + 1,
      windows: state.windows.map((win) =>
        win.id === id ? { ...win, minimised: false, z: state.topZ + 1 } : win,
      ),
    })),

  toggleMaximise: (id) =>
    set((state) => ({
      windows: state.windows.map((win) =>
        win.id === id ? { ...win, maximised: !win.maximised } : win,
      ),
    })),

  focus: (id) =>
    set((state) => ({
      topZ: state.topZ + 1,
      windows: state.windows.map((win) => (win.id === id ? { ...win, z: state.topZ + 1 } : win)),
    })),

  move: (id, x, y) =>
    set((state) => ({
      windows: state.windows.map((win) => (win.id === id ? { ...win, x, y } : win)),
    })),

  closeAll: () => set({ windows: [] }),
}))