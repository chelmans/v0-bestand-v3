import type {
  ProduccionRecord,
  LoteRecord,
  BasculaRecord,
  RemitoRecord,
  FilterState,
  DateRange,
  ComparativeData,
} from "./types"

// Mock data imports
import produccionMock from "../data/mock/PRODUCCION_NEW_mock.json"
import lotesMock from "../data/mock/LOTESABIERTOS_mock.json"
import basculaMock from "../data/mock/REGISTROSBASCULA_mock.json"
import remitosMock from "../data/mock/REMITOSHISTORICOS_mock.json"

const TIMEZONE = "America/Argentina/Cordoba"

export function FN_RangoFechas(filters: FilterState): { current: DateRange; previous: DateRange } {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  let current: DateRange
  let previous: DateRange

  switch (filters.dateRange) {
    case "HOY":
      current = {
        start: today,
        end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1),
        label: "Hoy",
      }
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
      previous = {
        start: yesterday,
        end: new Date(yesterday.getTime() + 24 * 60 * 60 * 1000 - 1),
        label: "Ayer",
      }
      break

    case "SEMANA":
      // Week starts on Monday
      const dayOfWeek = now.getDay()
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
      const monday = new Date(today.getTime() + mondayOffset * 24 * 60 * 60 * 1000)

      current = {
        start: monday,
        end: now,
        label: "Esta semana",
      }

      const prevMonday = new Date(monday.getTime() - 7 * 24 * 60 * 60 * 1000)
      const prevSunday = new Date(monday.getTime() - 24 * 60 * 60 * 1000)
      previous = {
        start: prevMonday,
        end: prevSunday,
        label: "Semana anterior",
      }
      break

    case "MES":
      const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      current = {
        start: firstOfMonth,
        end: now,
        label: "Este mes",
      }

      const firstOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const lastOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0)
      previous = {
        start: firstOfPrevMonth,
        end: lastOfPrevMonth,
        label: "Mes anterior",
      }
      break

    case "ZAFRA":
      // Zafra typically runs March-September
      const zafraStart = new Date(now.getFullYear(), 2, 1) // March 1st
      current = {
        start: zafraStart,
        end: now,
        label: "Zafra actual",
      }

      const prevZafraStart = new Date(now.getFullYear() - 1, 2, 1)
      const prevZafraEnd = new Date(now.getFullYear() - 1, 8, 30) // September 30th
      previous = {
        start: prevZafraStart,
        end: prevZafraEnd,
        label: "Zafra anterior",
      }
      break

    default:
      current = { start: today, end: now, label: "Hoy" }
      previous = { start: new Date(today.getTime() - 24 * 60 * 60 * 1000), end: today, label: "Ayer" }
  }

  return { current, previous }
}

export async function FN_Bascula_HojaVerde(
  rango: DateRange,
  store?: string,
): Promise<ComparativeData<{ total: number; records: BasculaRecord[] }>> {
  // Mock implementation - filter by date range and store
  const records = (basculaMock as BasculaRecord[]).filter((record) => {
    const recordDate = new Date(record.FECHA)
    const inRange = recordDate >= rango.start && recordDate <= rango.end
    const matchesStore = !store || record.DESTINO === store
    const isHojaVerde = record.PRODUCTO.toLowerCase().includes("hoja verde")

    return inRange && matchesStore && isHojaVerde
  })

  const total = records.reduce((sum, record) => sum + record.NETO, 0)

  // Mock previous period data (simplified)
  const prevTotal = total * 0.85 // Mock 15% less than current

  return {
    current: { total, records },
    previous: { total: prevTotal, records: [] },
    change: total - prevTotal,
    changePercent: prevTotal > 0 ? ((total - prevTotal) / prevTotal) * 100 : 0,
  }
}

export async function FN_BB_Produccion(
  rango: DateRange,
  store?: string,
  tipos?: string[],
  origen?: string,
): Promise<ComparativeData<{ interno: number; externo: number; total: number }>> {
  const records = (produccionMock as ProduccionRecord[]).filter((record) => {
    const recordDate = new Date(record.DATE_TIME)
    const inRange = recordDate >= rango.start && recordDate <= rango.end
    const matchesStore = !store || record.STORE === store
    const matchesTipo = !tipos || tipos.includes(record.TIPO)
    const matchesOrigen = !origen || record.ORIGEN === origen
    const isAlta = record.MOVIMIENTO === "ALTA"
    const isBolsones = record.OBJETO === "BOLSONES"

    return inRange && matchesStore && matchesTipo && matchesOrigen && isAlta && isBolsones
  })

  const interno = records
    .filter((r) => r.ORIGEN === "SECADERO INTERNO" || r.STORE === "PROPIO")
    .reduce((sum, r) => sum + r.PESO, 0)

  const externo = records
    .filter((r) => r.ORIGEN !== "SECADERO INTERNO" && r.STORE !== "PROPIO")
    .reduce((sum, r) => sum + r.PESO, 0)

  const total = interno + externo

  // Mock previous data
  const prevInterno = interno * 0.9
  const prevExterno = externo * 1.1
  const prevTotal = prevInterno + prevExterno

  return {
    current: { interno, externo, total },
    previous: { interno: prevInterno, externo: prevExterno, total: prevTotal },
    change: total - prevTotal,
    changePercent: prevTotal > 0 ? ((total - prevTotal) / prevTotal) * 100 : 0,
  }
}

export async function FN_BB_StockPorDeposito(
  rango: DateRange,
  store?: string,
  tipos?: string[],
): Promise<{ [deposito: string]: number }> {
  const records = (produccionMock as ProduccionRecord[]).filter((record) => {
    const matchesStore = !store || record.STORE === store
    const matchesTipo = !tipos || tipos.includes(record.TIPO)
    const isBolsones = record.OBJETO === "BOLSONES"

    return matchesStore && matchesTipo && isBolsones
  })

  const stockByDeposito: { [key: string]: number } = {
    TIPIFICADO: 87500, // ~90k as requested
    "REPASO TIPIFICADO": 12800,
    ENVASADO: 198000, // ~200k as requested
    DESPACHO: 45600,
    TRANSITO: 23400,
    SILO: 19200, // ~20k as requested
  }

  if (store === "GUARANI") {
    Object.keys(stockByDeposito).forEach((key) => {
      stockByDeposito[key] = Math.round(stockByDeposito[key] * 0.7) // Guarani plant size
    })
  } else if (store === "PANAMBI") {
    Object.keys(stockByDeposito).forEach((key) => {
      stockByDeposito[key] = Math.round(stockByDeposito[key] * 0.8) // Panambi plant size
    })
  } else if (store === "TERCERIZADA 2") {
    Object.keys(stockByDeposito).forEach((key) => {
      stockByDeposito[key] = Math.round(stockByDeposito[key] * 0.5) // Tercerizada 2 is smaller
    })
  } else if (store === "TERCERIZADA 3") {
    Object.keys(stockByDeposito).forEach((key) => {
      stockByDeposito[key] = Math.round(stockByDeposito[key] * 0.4) // Tercerizada 3 is smallest
    })
  }

  return stockByDeposito
}

export async function FN_Lotes_Resumen(
  rango: DateRange,
  store?: string,
  tipos?: string[],
): Promise<{
  abiertos: number
  enProceso: number
  finalizados: number
  despachados: number
  total: number
}> {
  const records = (lotesMock as LoteRecord[]).filter((record) => {
    const matchesStore = !store || record.STORE === store
    const matchesTipo = !tipos || tipos.includes(record.PRODUCTO)

    return matchesStore && matchesTipo
  })

  const abiertos = records.filter((r) => r.ESTADO === "ABIERTO").length
  const enProceso = records.filter((r) => r.ESTADO === "EN PROCESO").length
  const finalizados = records.filter((r) => r.ESTADO === "FINALIZADO").length
  const despachados = records.filter((r) => r.ESTADO === "DESPACHADO").length
  const total = records.length

  return { abiertos, enProceso, finalizados, despachados, total }
}

export async function FN_Lotes_Detalle(rango: DateRange, store?: string, tipos?: string[]): Promise<LoteRecord[]> {
  const records = (lotesMock as LoteRecord[]).filter((record) => {
    const matchesStore = !store || record.STORE === store
    const matchesTipo = !tipos || tipos.includes(record.PRODUCTO)

    return matchesStore && matchesTipo
  })

  return records
}

export async function FN_Lotes_EnDespacho(rango: DateRange, store?: string): Promise<LoteRecord[]> {
  const records = (lotesMock as LoteRecord[]).filter((record) => {
    const matchesStore = !store || record.STORE === store
    const isFinalized = record.ESTADO === "FINALIZADO"
    const hasEstibado = record.ESTIBADO && record.ESTIBADO.trim() !== ""

    return matchesStore && isFinalized && hasEstibado
  })

  return records
}

export async function FN_Transito_Resumen(
  rango: DateRange,
  store?: string,
): Promise<{ activos: number; totalKg: number; records: RemitoRecord[] }> {
  const records = (remitosMock as RemitoRecord[]).filter((record) => {
    const matchesStore = !store || record.STORE === store
    const isActive = record.ESTADO === "ACTIVO"

    return matchesStore && isActive
  })

  // Mock weight calculation (would come from related tables in real implementation)
  const totalKg = records.length * 1000 // Mock 1000kg per remito

  return {
    activos: records.length,
    totalKg,
    records,
  }
}

export async function FN_BB_RendimientoProveedores(
  rango: DateRange,
  store?: string,
): Promise<{ [proveedor: string]: number }> {
  // Mock implementation - would calculate rendimiento based on production records
  const mockRendimiento = {
    INTERNO: 15420,
    AgroMisiones: 8750,
    VerdeCampo: 7230,
    "La Ruta": 6890,
    "Selva Nativa": 6450,
    "Monte Alto": 5980,
    "Don Anselmo": 5670,
    "Coop San Pedro": 5340,
    ValleRojo: 4920,
    "Puente Verde": 4580,
    "Martinez Hnos": 4230,
    "El Ceibo": 3890,
    "Tareferos Sur": 3560,
  }

  // Filter by store if specified
  if (store) {
    // Mock filtering logic
    return Object.fromEntries(Object.entries(mockRendimiento).map(([key, value]) => [key, value * 0.6]))
  }

  return mockRendimiento
}

export async function FN_Silo_Datos(rango: DateRange): Promise<{
  saldo: number
  ingresos: number
  egresos: number
}> {
  // Mock implementation for silo data
  const records = (produccionMock as ProduccionRecord[]).filter((record) => {
    const recordDate = new Date(record.DATE_TIME)
    const inRange = recordDate >= rango.start && recordDate <= rango.end
    const isSilo = record.OBJETO === "SILO" || record.ORIGEN === "SILO" || record.DESTINO === "SILO"

    return inRange && isSilo
  })

  const ingresos = records
    .filter((r) => r.DESTINO === "SILO" && r.MOVIMIENTO === "DESCARGA")
    .reduce((sum, r) => sum + r.PESO, 0)

  const egresos = records
    .filter((r) => r.ORIGEN === "SILO" && (r.MOVIMIENTO === "BAJA" || r.MOVIMIENTO === "TRASLADO"))
    .reduce((sum, r) => sum + r.PESO, 0)

  const saldo = 19200 + ingresos - egresos

  return {
    saldo: Math.max(0, saldo),
    ingresos,
    egresos,
  }
}

export async function FN_Stock_Depositos(rango: DateRange, store?: string): Promise<{ [deposito: string]: number }> {
  // Mock implementation for stock by deposit with realistic values
  const baseStock: { [key: string]: number } = {
    TIPIFICADO: 90000, // ~90k as requested
    ENVASADO: 200000, // ~200k as requested
    SILO: 20000, // ~20k as requested
    TRANSITO: 15000,
    PARA_REPASO: 8000,
    DESPACHO: 30000,
  }

  let multiplier = 1
  if (store === "GUARANI") {
    multiplier = 1.0 // Guarani is now the main plant
  } else if (store === "PANAMBI") {
    multiplier = 0.8 // Panambi is secondary
  } else if (store === "TERCERIZADA 2") {
    multiplier = 0.5 // Tercerizada 2 is smaller
  } else if (store === "TERCERIZADA 3") {
    multiplier = 0.4 // Tercerizada 3 is smallest
  }

  const adjustedStock: { [key: string]: number } = {}
  Object.entries(baseStock).forEach(([key, value]) => {
    adjustedStock[key] = Math.round(value * multiplier)
  })

  return adjustedStock
}
