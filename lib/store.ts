import { create } from "zustand"
import type { FilterState } from "./types"

interface AppStore extends FilterState {
  setDateRange: (range: FilterState["dateRange"]) => void
  setStore: (store: string | undefined) => void
  setCustomRange: (range: { start: Date; end: Date } | undefined) => void
  reset: () => void
}

const initialState: FilterState = {
  dateRange: "HOY",
  store: "GUARANI", // Default to GUARANI plant
  customRange: undefined,
}

export const useAppStore = create<AppStore>((set) => ({
  ...initialState,
  setDateRange: (dateRange) => set({ dateRange }),
  setStore: (store) => set({ store }),
  setCustomRange: (customRange) => set({ customRange }),
  reset: () => set(initialState),
}))

export const PLANTS = {
  GUARANI: "GUARANI",
  PANAMBI: "PANAMBI",
  "TERCERIZADA 2": "TERCERIZADA 2",
  "TERCERIZADA 3": "TERCERIZADA 3",
} as const

export const PLANT_OPTIONS = [
  { value: "GUARANI", label: "Guaraní (Principal)" },
  { value: "PANAMBI", label: "Panambi (Secundaria)" },
  { value: "TERCERIZADA 2", label: "Tercerizada 2" },
  { value: "TERCERIZADA 3", label: "Tercerizada 3" },
]
