export interface ProduccionRecord {
  ID: number
  MOVIMIENTO: "ALTA" | "DESCARGA" | "BAJA" | "TRASLADO"
  ORIGEN: string
  DESTINO: string
  TIPO: string
  PESO: number
  DATE_TIME: string
  OBJETO: "BOLSONES" | "SILO"
  STORE: string
  IDPROD?: string
  LOTE?: string
}

export interface LoteRecord {
  ID: number
  LOTE: string
  ESTADO: "ABIERTO" | "EN PROCESO" | "FINALIZADO" | "OBSERVACIÓN" | "DESPACHADO"
  PRODUCTO: string
  NPALLETS: number
  NBOLSAS: number
  KGBOLSAS: number
  TOTALKG: number
  LABORATORIO: string
  ETIQUETAS: string
  ESTIBADO: string
  DESPACHADO: string
  NEXPORT: string
  CLIENTE: string
  STORE: string
}

export interface BasculaRecord {
  ID: number
  FECHA: string
  TICNUM: string
  PROVEEDOR: string
  PRODUCTO: string
  NETO: number
  DESTINO: string
  PATENTE: string
  CHOFER: string
}

export interface RemitoRecord {
  ID: number
  FECHAINICIO: number // epoch ms
  ORIGEN: string
  DESTINO: string
  ESTADO: "ACTIVO" | "ACEPTADO"
  BOLSON_ID: string
  STORE: string
  PUESTO: string
}

export interface FilterState {
  dateRange: "HOY" | "SEMANA" | "MES" | "ZAFRA"
  store?: string
  customRange?: {
    start: Date
    end: Date
  }
}

export interface DateRange {
  start: Date
  end: Date
  label: string
}

export interface ComparativeData<T> {
  current: T
  previous: T
  change: number
  changePercent: number
}
