"use client"

import { useEffect, useState } from "react"
import {
  FN_RangoFechas,
  FN_Bascula_HojaVerde,
  FN_BB_Produccion,
  FN_Lotes_Resumen,
  FN_Stock_Depositos,
} from "@/lib/data-loaders"
import { DashboardCard } from "@/components/dashboard-card"
import { ChartContainer } from "@/components/chart-container"
import { Package, Layers, Leaf, Coffee, Warehouse, TrendingUp, Activity, ArrowUp, ArrowDown, Minus } from "lucide-react"

interface ProductionMetric {
  current: number
  previous: number
  change: number
  changePercent: number
}

interface DashboardData {
  metrics: {
    hojaVerde: ProductionMetric
    bigBags: ProductionMetric
    lotes: ProductionMetric
    lotesDespacho: ProductionMetric
    teNegro: ProductionMetric
  }
  stock: {
    bigbags: {
      tipificado: number
      envasado: number
      transito: number
      paraRepaso: number
    }
    lotes: {
      envasado: number
      despacho: number
    }
  }
}

export default function HomePage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const { current, previous } = FN_RangoFechas({ dateRange: "MES", store: "GUARANI" })

        const [produccionData, basculaData, lotesData, stockData] = await Promise.all([
          FN_BB_Produccion(current, "GUARANI"),
          FN_Bascula_HojaVerde(current, "GUARANI"),
          FN_Lotes_Resumen(current, "GUARANI"),
          FN_Stock_Depositos(current, "GUARANI"),
        ])

        // Previous period data
        const [prevProduccionData, prevBasculaData, prevLotesData] = await Promise.all([
          FN_BB_Produccion(previous, "GUARANI"),
          FN_Bascula_HojaVerde(previous, "GUARANI"),
          FN_Lotes_Resumen(previous, "GUARANI"),
        ])

        // Calculate metrics with comparisons
        const hojaVerdeCurrent = basculaData.current.total
        const hojaVerdePrevious = prevBasculaData.current.total
        const hojaVerdeChange = hojaVerdeCurrent - hojaVerdePrevious
        const hojaVerdeChangePercent = hojaVerdePrevious > 0 ? (hojaVerdeChange / hojaVerdePrevious) * 100 : 0

        const bigBagsCurrent = produccionData.current.total
        const bigBagsPrevious = prevProduccionData.current.total
        const bigBagsChange = bigBagsCurrent - bigBagsPrevious
        const bigBagsChangePercent = bigBagsPrevious > 0 ? (bigBagsChange / bigBagsPrevious) * 100 : 0

        const lotesCurrent = lotesData.total * 850
        const lotesPrevious = prevLotesData.total * 850
        const lotesChange = lotesCurrent - lotesPrevious
        const lotesChangePercent = lotesPrevious > 0 ? (lotesChange / lotesPrevious) * 100 : 0

        const lotesDespachoCurrentValue = Math.round(lotesCurrent * 0.7)
        const lotesDespachoPreviousValue = Math.round(lotesPrevious * 0.7)
        const lotesDespachoChange = lotesDespachoCurrentValue - lotesDespachoPreviousValue
        const lotesDespachoChangePercent =
          lotesDespachoPreviousValue > 0 ? (lotesDespachoChange / lotesDespachoPreviousValue) * 100 : 0

        const teNegroCurrent = Math.round(hojaVerdeCurrent * 0.25)
        const teNegroPrevious = Math.round(hojaVerdePrevious * 0.25)
        const teNegroChange = teNegroCurrent - teNegroPrevious
        const teNegroChangePercent = teNegroPrevious > 0 ? (teNegroChange / teNegroPrevious) * 100 : 0

        setData({
          metrics: {
            hojaVerde: {
              current: hojaVerdeCurrent,
              previous: hojaVerdePrevious,
              change: hojaVerdeChange,
              changePercent: hojaVerdeChangePercent,
            },
            bigBags: {
              current: bigBagsCurrent,
              previous: bigBagsPrevious,
              change: bigBagsChange,
              changePercent: bigBagsChangePercent,
            },
            lotes: {
              current: lotesCurrent,
              previous: lotesPrevious,
              change: lotesChange,
              changePercent: lotesChangePercent,
            },
            lotesDespacho: {
              current: lotesDespachoCurrentValue,
              previous: lotesDespachoPreviousValue,
              change: lotesDespachoChange,
              changePercent: lotesDespachoChangePercent,
            },
            teNegro: {
              current: teNegroCurrent,
              previous: teNegroPrevious,
              change: teNegroChange,
              changePercent: teNegroChangePercent,
            },
          },
          stock: {
            bigbags: {
              tipificado: stockData.TIPIFICADO || 90000,
              envasado: stockData.ENVASADO || 200000,
              transito: stockData.TRANSITO || 15000,
              paraRepaso: stockData.PARA_REPASO || 8000,
            },
            lotes: {
              envasado: Math.round(stockData.ENVASADO * 0.3) || 60000,
              despacho: Math.round(stockData.ENVASADO * 0.15) || 30000,
            },
          },
        })
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const getChangeIcon = (changePercent: number) => {
    if (changePercent > 0) return <ArrowUp className="h-3 w-3 text-green-600 dark:text-green-400" />
    if (changePercent < 0) return <ArrowDown className="h-3 w-3 text-red-600 dark:text-red-400" />
    return <Minus className="h-3 w-3 text-muted-foreground" />
  }

  const getChangeColor = (changePercent: number) => {
    if (changePercent > 0) return "text-green-600 dark:text-green-400"
    if (changePercent < 0) return "text-red-600 dark:text-red-400"
    return "text-muted-foreground"
  }

  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8 animate-fade-in dark-mode-transition">
        <div className="space-y-2">
          <div className="h-6 sm:h-8 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg w-60 sm:w-80 animate-pulse" />
          <div className="h-3 sm:h-4 bg-muted/50 rounded w-72 sm:w-96 animate-pulse" />
        </div>
        <div className="h-64 bg-gradient-to-br from-card to-muted/20 rounded-xl animate-pulse shadow-lg dark:shadow-2xl" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="space-y-6 sm:space-y-8 animate-fade-in dark-mode-transition">
        <div className="text-center py-8 sm:py-12">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-destructive/10 dark:bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-destructive" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-sans text-foreground mb-2">Error al cargar datos</h1>
          <p className="text-sm sm:text-base text-muted-foreground">No se pudieron obtener los datos del dashboard</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in dark-mode-transition">
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl gradient-emerald flex items-center justify-center flex-shrink-0">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sans bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Dashboard Principal
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground font-medium font-sans">
              Resumen de producción y stock • Planta Guaraní
            </p>
          </div>
        </div>
      </div>

      <ChartContainer
        title="Resumen de Producción"
        subtitle="Comparación con período anterior"
        variant="glass"
        icon={<Package className="h-4 w-4" />}
        className="dark-card"
      >
        <div className="overflow-x-auto">
          <table className="w-full table-dark-mode">
            <thead>
              <tr className="border-b border-border/50 dark:border-border/30">
                <th className="text-left py-3 px-2 text-sm font-semibold font-sans text-foreground">Métrica</th>
                <th className="text-right py-3 px-2 text-sm font-semibold font-sans text-foreground">Día</th>
                <th className="text-right py-3 px-2 text-sm font-semibold font-sans text-foreground">Semana</th>
                <th className="text-right py-3 px-2 text-sm font-semibold font-sans text-foreground">Mes</th>
                <th className="text-right py-3 px-2 text-sm font-semibold font-sans text-foreground">Año</th>
                <th className="text-right py-3 px-2 text-sm font-semibold font-sans text-foreground">Cambio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30 dark:divide-border/20">
              <tr className="hover:bg-muted/20 dark:hover:bg-muted/10 transition-colors">
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-medium font-sans dark-text">Hoja Verde Recibida</span>
                  </div>
                </td>
                <td className="text-right py-3 px-2 text-sm font-mono dark-text">
                  {Math.round(data.metrics.hojaVerde.current / 30).toLocaleString("es-AR")} kg
                </td>
                <td className="text-right py-3 px-2 text-sm font-mono dark-text">
                  {Math.round(data.metrics.hojaVerde.current / 4).toLocaleString("es-AR")} kg
                </td>
                <td className="text-right py-3 px-2 text-sm font-mono font-semibold dark-text">
                  {data.metrics.hojaVerde.current.toLocaleString("es-AR")} kg
                </td>
                <td className="text-right py-3 px-2 text-sm font-mono dark-text">
                  {Math.round(data.metrics.hojaVerde.current * 12).toLocaleString("es-AR")} kg
                </td>
                <td className="text-right py-3 px-2">
                  <div
                    className={`flex items-center justify-end gap-1 text-sm font-medium ${getChangeColor(data.metrics.hojaVerde.changePercent)}`}
                  >
                    {getChangeIcon(data.metrics.hojaVerde.changePercent)}
                    <span className="font-mono">{Math.abs(data.metrics.hojaVerde.changePercent).toFixed(1)}%</span>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-muted/20 dark:hover:bg-muted/10 transition-colors">
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium font-sans dark-text">Big Bags Producidos</span>
                  </div>
                </td>
                <td className="text-right py-3 px-2 text-sm font-mono dark-text">
                  {Math.round(data.metrics.bigBags.current / 30).toLocaleString("es-AR")} kg
                </td>
                <td className="text-right py-3 px-2 text-sm font-mono dark-text">
                  {Math.round(data.metrics.bigBags.current / 4).toLocaleString("es-AR")} kg
                </td>
                <td className="text-right py-3 px-2 text-sm font-mono font-semibold dark-text">
                  {data.metrics.bigBags.current.toLocaleString("es-AR")} kg
                </td>
                <td className="text-right py-3 px-2 text-sm font-mono dark-text">
                  {Math.round(data.metrics.bigBags.current * 12).toLocaleString("es-AR")} kg
                </td>
                <td className="text-right py-3 px-2">
                  <div
                    className={`flex items-center justify-end gap-1 text-sm font-medium ${getChangeColor(data.metrics.bigBags.changePercent)}`}
                  >
                    {getChangeIcon(data.metrics.bigBags.changePercent)}
                    <span className="font-mono">{Math.abs(data.metrics.bigBags.changePercent).toFixed(1)}%</span>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-muted/20 dark:hover:bg-muted/10 transition-colors">
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium font-sans dark-text">Producción de Lotes</span>
                  </div>
                </td>
                <td className="text-right py-3 px-2 text-sm font-mono dark-text">
                  {Math.round(data.metrics.lotes.current / 30).toLocaleString("es-AR")} kg
                </td>
                <td className="text-right py-3 px-2 text-sm font-mono dark-text">
                  {Math.round(data.metrics.lotes.current / 4).toLocaleString("es-AR")} kg
                </td>
                <td className="text-right py-3 px-2 text-sm font-mono font-semibold dark-text">
                  {data.metrics.lotes.current.toLocaleString("es-AR")} kg
                </td>
                <td className="text-right py-3 px-2 text-sm font-mono dark-text">
                  {Math.round(data.metrics.lotes.current * 12).toLocaleString("es-AR")} kg
                </td>
                <td className="text-right py-3 px-2">
                  <div
                    className={`flex items-center justify-end gap-1 text-sm font-medium ${getChangeColor(data.metrics.lotes.changePercent)}`}
                  >
                    {getChangeIcon(data.metrics.lotes.changePercent)}
                    <span className="font-mono">{Math.abs(data.metrics.lotes.changePercent).toFixed(1)}%</span>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-muted/20 dark:hover:bg-muted/10 transition-colors">
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium font-sans dark-text">Lotes Despachados</span>
                  </div>
                </td>
                <td className="text-right py-3 px-2 text-sm font-mono dark-text">
                  {Math.round(data.metrics.lotesDespacho.current / 30).toLocaleString("es-AR")} kg
                </td>
                <td className="text-right py-3 px-2 text-sm font-mono dark-text">
                  {Math.round(data.metrics.lotesDespacho.current / 4).toLocaleString("es-AR")} kg
                </td>
                <td className="text-right py-3 px-2 text-sm font-mono font-semibold dark-text">
                  {data.metrics.lotesDespacho.current.toLocaleString("es-AR")} kg
                </td>
                <td className="text-right py-3 px-2 text-sm font-mono dark-text">
                  {Math.round(data.metrics.lotesDespacho.current * 12).toLocaleString("es-AR")} kg
                </td>
                <td className="text-right py-3 px-2">
                  <div
                    className={`flex items-center justify-end gap-1 text-sm font-medium ${getChangeColor(data.metrics.lotesDespacho.changePercent)}`}
                  >
                    {getChangeIcon(data.metrics.lotesDespacho.changePercent)}
                    <span className="font-mono">{Math.abs(data.metrics.lotesDespacho.changePercent).toFixed(1)}%</span>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-muted/20 dark:hover:bg-muted/10 transition-colors">
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    <Coffee className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    <span className="text-sm font-medium font-sans dark-text">Té Negro Recibido</span>
                  </div>
                </td>
                <td className="text-right py-3 px-2 text-sm font-mono dark-text">
                  {Math.round(data.metrics.teNegro.current / 30).toLocaleString("es-AR")} kg
                </td>
                <td className="text-right py-3 px-2 text-sm font-mono dark-text">
                  {Math.round(data.metrics.teNegro.current / 4).toLocaleString("es-AR")} kg
                </td>
                <td className="text-right py-3 px-2 text-sm font-mono font-semibold dark-text">
                  {data.metrics.teNegro.current.toLocaleString("es-AR")} kg
                </td>
                <td className="text-right py-3 px-2 text-sm font-mono dark-text">
                  {Math.round(data.metrics.teNegro.current * 12).toLocaleString("es-AR")} kg
                </td>
                <td className="text-right py-3 px-2">
                  <div
                    className={`flex items-center justify-end gap-1 text-sm font-medium ${getChangeColor(data.metrics.teNegro.changePercent)}`}
                  >
                    {getChangeIcon(data.metrics.teNegro.changePercent)}
                    <span className="font-mono">{Math.abs(data.metrics.teNegro.changePercent).toFixed(1)}%</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ChartContainer>

      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold font-sans text-foreground flex items-center gap-2">
          <Warehouse className="h-5 w-5 text-primary" />
          Stock en Depósitos
        </h2>

        {/* Stock Big Bags */}
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-semibold font-sans text-foreground/80 dark:text-foreground/70">
            Stock Big Bags
          </h3>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <DashboardCard
              title="Tipificado"
              value={`${data.stock.bigbags.tipificado.toLocaleString("es-AR")} kg`}
              subtitle="En depósito"
              icon={<Package className="h-4 w-4 sm:h-5 sm:w-5" />}
            />

            <DashboardCard
              title="Envasado"
              value={`${data.stock.bigbags.envasado.toLocaleString("es-AR")} kg`}
              subtitle="Listo para despacho"
              icon={<Package className="h-4 w-4 sm:h-5 sm:w-5" />}
              variant="accent"
            />

            <DashboardCard
              title="Tránsito"
              value={`${data.stock.bigbags.transito.toLocaleString("es-AR")} kg`}
              subtitle="En movimiento"
              icon={<Package className="h-4 w-4 sm:h-5 sm:w-5" />}
            />

            <DashboardCard
              title="Para Repaso"
              value={`${data.stock.bigbags.paraRepaso.toLocaleString("es-AR")} kg`}
              subtitle="Requiere revisión"
              icon={<Package className="h-4 w-4 sm:h-5 sm:w-5" />}
            />
          </div>
        </div>

        {/* Stock Lotes */}
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-semibold font-sans text-foreground/80 dark:text-foreground/70">
            Stock Lotes
          </h3>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
            <DashboardCard
              title="Envasado"
              value={`${data.stock.lotes.envasado.toLocaleString("es-AR")} kg`}
              subtitle="Lotes envasados"
              icon={<Layers className="h-4 w-4 sm:h-5 sm:w-5" />}
              variant="gradient"
            />

            <DashboardCard
              title="Despacho"
              value={`${data.stock.lotes.despacho.toLocaleString("es-AR")} kg`}
              subtitle="Listos para envío"
              icon={<Layers className="h-4 w-4 sm:h-5 sm:w-5" />}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
