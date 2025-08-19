"use client"

import { useEffect, useState } from "react"
import { useAppStore } from "@/lib/store"
import { FN_RangoFechas, FN_BB_StockPorDeposito, FN_Silo_Datos } from "@/lib/data-loaders"
import { DashboardCard } from "@/components/dashboard-card"
import { ChartContainer } from "@/components/chart-container"
import { DataTable } from "@/components/data-table"
import { Warehouse, Package, TrendingUp } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import type { ColumnDef } from "@tanstack/react-table"

// Import mock data for stock movements
import produccionMock from "../../data/mock/PRODUCCION_NEW_mock.json"

interface StockData {
  stockPorDeposito: { [deposito: string]: number }
  siloData: {
    saldo: number
    ingresos: number
    egresos: number
  }
  movimientos: any[]
}

const COLORS = ["#6366f1", "#fbbf24", "#10b981", "#ef4444", "#3b82f6", "#8b5cf6", "#f59e0b"]

const depositoOptions = [
  { value: "all", label: "Todos los depósitos" },
  { value: "TIPIFICADO", label: "Tipificado" },
  { value: "REPASO TIPIFICADO", label: "Repaso Tipificado" },
  { value: "ENVASADO", label: "Envasado" },
  { value: "DESPACHO", label: "Despacho" },
  { value: "TRANSITO", label: "Tránsito" },
  { value: "SILO", label: "Silo" },
]

export default function StockPage() {
  const { dateRange, store } = useAppStore()
  const [data, setData] = useState<StockData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDeposito, setSelectedDeposito] = useState<string>("all")

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const { current } = FN_RangoFechas({ dateRange, store })

        const [stockData, siloData] = await Promise.all([
          FN_BB_StockPorDeposito(current, store),
          FN_Silo_Datos(current),
        ])

        // Filter stock movements for table
        const movimientos = produccionMock
          .filter((record: any) => {
            const recordDate = new Date(record.DATE_TIME)
            const inRange = recordDate >= current.start && recordDate <= current.end
            const matchesStore = !store || record.STORE === store
            const matchesDeposito =
              selectedDeposito === "all" || record.ORIGEN === selectedDeposito || record.DESTINO === selectedDeposito

            return inRange && matchesStore && matchesDeposito
          })
          .sort((a: any, b: any) => new Date(b.DATE_TIME).getTime() - new Date(a.DATE_TIME).getTime())
          .slice(0, 100) // Limit to recent 100 movements

        setData({
          stockPorDeposito: stockData,
          siloData,
          movimientos,
        })
      } catch (error) {
        console.error("Error loading Stock data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [dateRange, store, selectedDeposito])

  // Table columns for stock movements
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "DATE_TIME",
      header: "Fecha",
      cell: ({ row }) => {
        const date = new Date(row.getValue("DATE_TIME"))
        return (
          <span className="font-mono text-sm">
            {date.toLocaleDateString("es-AR", {
              day: "2-digit",
              month: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )
      },
    },
    {
      accessorKey: "IDPROD",
      header: "ID Producto",
      cell: ({ row }) => <span className="font-mono text-sm">{row.getValue("IDPROD")}</span>,
    },
    {
      accessorKey: "MOVIMIENTO",
      header: "Movimiento",
      cell: ({ row }) => {
        const movimiento = row.getValue("MOVIMIENTO") as string
        const colors = {
          ALTA: "text-green-600",
          BAJA: "text-red-600",
          TRASLADO: "text-blue-600",
          DESCARGA: "text-orange-600",
        }
        return (
          <span className={`font-sans text-sm font-medium ${colors[movimiento as keyof typeof colors] || ""}`}>
            {movimiento}
          </span>
        )
      },
    },
    {
      accessorKey: "ORIGEN",
      header: "Origen",
      cell: ({ row }) => <span className="font-sans text-sm">{row.getValue("ORIGEN")}</span>,
    },
    {
      accessorKey: "DESTINO",
      header: "Destino",
      cell: ({ row }) => <span className="font-sans text-sm">{row.getValue("DESTINO")}</span>,
    },
    {
      accessorKey: "PESO",
      header: "Peso (kg)",
      cell: ({ row }) => {
        const peso = Number.parseFloat(row.getValue("PESO"))
        return <span className="font-mono text-sm font-semibold">{peso.toLocaleString("es-AR")}</span>
      },
    },
    {
      accessorKey: "TIPO",
      header: "Tipo",
      cell: ({ row }) => <span className="font-sans text-sm font-medium">{row.getValue("TIPO")}</span>,
    },
    {
      accessorKey: "STORE",
      header: "Planta",
      cell: ({ row }) => <span className="font-sans text-sm font-medium">{row.getValue("STORE")}</span>,
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-sans text-foreground">Control de Stock</h1>
          <p className="text-muted-foreground font-sans">Cargando datos...</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-lg border bg-card p-6 animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-sans text-foreground">Control de Stock</h1>
          <p className="text-muted-foreground font-sans">Error al cargar los datos</p>
        </div>
      </div>
    )
  }

  // Prepare chart data
  const stockChartData = Object.entries(data.stockPorDeposito).map(([deposito, cantidad], index) => ({
    name: deposito,
    value: cantidad,
    fill: COLORS[index % COLORS.length],
  }))

  const totalStock = Object.values(data.stockPorDeposito).reduce((sum, val) => sum + val, 0)
  const depositosActivos = Object.keys(data.stockPorDeposito).length

  const trendData = [
    { day: "Lun", tipificado: 87500, envasado: 182000, despacho: 45600, silo: 18800 },
    { day: "Mar", tipificado: 89200, envasado: 178000, despacho: 51100, silo: 19200 },
    { day: "Mié", tipificado: 85800, envasado: 185000, despacho: 42200, silo: 17600 },
    { day: "Jue", tipificado: 91100, envasado: 176000, despacho: 48800, silo: 20100 },
    { day: "Vie", tipificado: 88900, envasado: 181000, despacho: 45900, silo: 19400 },
    { day: "Sáb", tipificado: 86600, envasado: 179000, despacho: 44400, silo: 18200 },
    { day: "Dom", tipificado: 84800, envasado: 175000, despacho: 41900, silo: 17800 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-sans text-foreground">Control de Stock</h1>
        <p className="text-muted-foreground font-sans">
          Monitoreo de inventario por depósito - {dateRange.toLowerCase()}
          {store && ` - ${store}`}
        </p>
      </div>

      {/* Additional Filters */}
      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium font-sans">Depósito:</label>
          <Select value={selectedDeposito} onValueChange={setSelectedDeposito}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {depositoOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" size="sm" onClick={() => setSelectedDeposito("all")} className="font-sans">
          Limpiar filtros
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <DashboardCard
          title="Stock Total"
          value={`${totalStock.toLocaleString("es-AR")} kg`}
          subtitle="En todos los depósitos"
          icon={<Warehouse className="h-4 w-4" />}
        />

        <DashboardCard
          title="Depósitos Activos"
          value={depositosActivos}
          subtitle="Con stock disponible"
          icon={<Package className="h-4 w-4" />}
        />

        <DashboardCard
          title="Silo Saldo"
          value={`${data.siloData.saldo.toLocaleString("es-AR")} kg`}
          subtitle="Stock en silo"
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Stock Distribution */}
        <ChartContainer title="Distribución de Stock" subtitle="Por depósito">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stockChartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {stockChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`${value.toLocaleString("es-AR")} kg`, ""]}
                contentStyle={{
                  fontFamily: "var(--font-roboto)",
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {stockChartData.slice(0, 4).map((item, index) => (
              <div key={index} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }}></div>
                <span className="text-xs text-muted-foreground font-sans">{item.name}</span>
              </div>
            ))}
          </div>
        </ChartContainer>

        {/* Stock by Deposit */}
        <ChartContainer title="Stock por Depósito" subtitle="Cantidad en kg">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stockChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [`${value.toLocaleString("es-AR")} kg`, "Stock"]}
                contentStyle={{
                  fontFamily: "var(--font-roboto)",
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" fill={COLORS[0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Stock Trend */}
        <ChartContainer title="Tendencia de Stock" subtitle="Últimos 7 días">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [`${value.toLocaleString("es-AR")} kg`, ""]}
                contentStyle={{
                  fontFamily: "var(--font-roboto)",
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Area type="monotone" dataKey="tipificado" stackId="1" stroke={COLORS[0]} fill={COLORS[0]} />
              <Area type="monotone" dataKey="envasado" stackId="1" stroke={COLORS[1]} fill={COLORS[1]} />
              <Area type="monotone" dataKey="despacho" stackId="1" stroke={COLORS[2]} fill={COLORS[2]} />
              <Area type="monotone" dataKey="silo" stackId="1" stroke={COLORS[3]} fill={COLORS[3]} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Stock Analysis */}
      <div className="grid gap-6 md:grid-cols-1">
        <ChartContainer title="Análisis de Silo" subtitle="Movimientos de silo">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium font-sans">Saldo Actual</span>
              <span className="text-lg font-bold font-mono">{data.siloData.saldo.toLocaleString("es-AR")} kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-green-600 font-sans">Ingresos</span>
              <span className="text-sm font-bold text-green-600 font-mono">
                +{data.siloData.ingresos.toLocaleString("es-AR")} kg
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-red-600 font-sans">Egresos</span>
              <span className="text-sm font-bold text-red-600 font-mono">
                -{data.siloData.egresos.toLocaleString("es-AR")} kg
              </span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold font-sans">Balance</span>
                <span
                  className={`text-sm font-bold font-mono ${(data.siloData.ingresos - data.siloData.egresos) >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {data.siloData.ingresos - data.siloData.egresos >= 0 ? "+" : ""}
                  {(data.siloData.ingresos - data.siloData.egresos).toLocaleString("es-AR")} kg
                </span>
              </div>
            </div>
          </div>
        </ChartContainer>
      </div>

      {/* Stock Movements Table */}
      <ChartContainer title="Movimientos de Stock" subtitle={`${data.movimientos.length} movimientos recientes`}>
        <DataTable
          columns={columns}
          data={data.movimientos}
          searchKey="IDPROD"
          searchPlaceholder="Buscar por ID producto..."
        />
      </ChartContainer>
    </div>
  )
}
