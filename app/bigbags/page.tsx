"use client"

import { useEffect, useState } from "react"
import { useAppStore } from "@/lib/store"
import {
  FN_RangoFechas,
  FN_BB_Produccion,
  FN_BB_RendimientoProveedores,
  FN_BB_StockPorDeposito,
} from "@/lib/data-loaders"
import { DashboardCard } from "@/components/dashboard-card"
import { ChartContainer } from "@/components/chart-container"
import { DataTable } from "@/components/data-table"
import { GlobalFilters } from "@/components/global-filters"
import { Package, TrendingUp, Warehouse, Users } from "lucide-react"
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
  LineChart,
  Line,
} from "recharts"
import type { ColumnDef } from "@tanstack/react-table"
import type { ProduccionRecord } from "@/lib/types"

// Import mock data for table
import produccionMock from "../../data/mock/PRODUCCION_NEW_mock.json"

interface BigBagsData {
  produccion: {
    interno: number
    externo: number
    total: number
    change: number
    changePercent: number
  }
  rendimiento: { [proveedor: string]: number }
  stock: { [deposito: string]: number }
  records: ProduccionRecord[]
}

const COLORS = ["#6366f1", "#fbbf24", "#10b981", "#ef4444", "#3b82f6"]

const tipoOptions = [
  { value: "all", label: "Todos los tipos" },
  { value: "BT1", label: "BT1" },
  { value: "BT2", label: "BT2" },
  { value: "BTD", label: "BTD" },
  { value: "RAMA", label: "RAMA" },
  { value: "PF", label: "PF" },
  { value: "FNGS", label: "FNGS" },
]

const origenOptions = [
  { value: "all", label: "Todos los orígenes" },
  { value: "SECADERO INTERNO", label: "Secadero Interno" },
  { value: "SECADERO EXTERNO A", label: "Secadero Externo A" },
  { value: "SECADERO EXTERNO B", label: "Secadero Externo B" },
]

export default function BigBagsPage() {
  const { dateRange, store } = useAppStore()
  const [data, setData] = useState<BigBagsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTipo, setSelectedTipo] = useState<string>("all")
  const [selectedOrigen, setSelectedOrigen] = useState<string>("all")

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const { current } = FN_RangoFechas({ dateRange, store })

        const tipos = selectedTipo === "all" ? undefined : [selectedTipo]
        const origen = selectedOrigen === "all" ? undefined : selectedOrigen

        const [produccionData, rendimientoData, stockData] = await Promise.all([
          FN_BB_Produccion(current, store, tipos, origen),
          FN_BB_RendimientoProveedores(current, store),
          FN_BB_StockPorDeposito(current, store, tipos),
        ])

        // Filter mock records for table
        const filteredRecords = (produccionMock as ProduccionRecord[]).filter((record) => {
          const recordDate = new Date(record.DATE_TIME)
          const inRange = recordDate >= current.start && recordDate <= current.end
          const matchesStore = !store || record.STORE === store
          const matchesTipo = selectedTipo === "all" || record.TIPO === selectedTipo
          const matchesOrigen = selectedOrigen === "all" || record.ORIGEN === selectedOrigen
          const isBolsones = record.OBJETO === "BOLSONES"

          return inRange && matchesStore && matchesTipo && matchesOrigen && isBolsones
        })

        setData({
          produccion: {
            interno: produccionData.current.interno,
            externo: produccionData.current.externo,
            total: produccionData.current.total,
            change: produccionData.change,
            changePercent: produccionData.changePercent,
          },
          rendimiento: rendimientoData,
          stock: stockData,
          records: filteredRecords,
        })
      } catch (error) {
        console.error("Error loading BigBags data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [dateRange, store, selectedTipo, selectedOrigen])

  // Table columns
  const columns: ColumnDef<ProduccionRecord>[] = [
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
              year: "numeric",
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
      accessorKey: "TIPO",
      header: "Tipo",
      cell: ({ row }) => <span className="font-sans text-sm font-medium">{row.getValue("TIPO")}</span>,
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
      accessorKey: "STORE",
      header: "Planta",
      cell: ({ row }) => <span className="font-sans text-sm font-medium">{row.getValue("STORE")}</span>,
    },
    {
      accessorKey: "OPERARIO",
      header: "Operario",
      cell: ({ row }) => <span className="font-sans text-sm">{row.getValue("OPERARIO")}</span>,
    },
  ]

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <GlobalFilters />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-sans text-foreground">Producción BigBags</h1>
          <p className="text-sm sm:text-base text-muted-foreground font-sans">Cargando datos...</p>
        </div>
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-lg border bg-card p-4 sm:p-6 animate-pulse">
              <div className="h-3 sm:h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-6 sm:h-8 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-2.5 sm:h-3 bg-muted rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <GlobalFilters />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-sans text-foreground">Producción BigBags</h1>
          <p className="text-sm sm:text-base text-muted-foreground font-sans">Error al cargar los datos</p>
        </div>
      </div>
    )
  }

  // Prepare chart data
  const stockChartData = Object.entries(data.stock).map(([deposito, cantidad], index) => ({
    name: deposito,
    value: cantidad,
    fill: COLORS[index % COLORS.length],
  }))

  const rendimientoChartData = Object.entries(data.rendimiento)
    .slice(0, 10)
    .map(([proveedor, rendimiento]) => ({
      name: proveedor,
      rendimiento,
    }))

  // Mock trend data
  const trendData = [
    { day: "Lun", interno: 800, externo: 400 },
    { day: "Mar", interno: 950, externo: 500 },
    { day: "Mié", interno: 750, externo: 350 },
    { day: "Jue", interno: 1100, externo: 600 },
    { day: "Vie", interno: 900, externo: 450 },
    { day: "Sáb", interno: 650, externo: 300 },
    { day: "Dom", interno: 500, externo: 250 },
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      <GlobalFilters />
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-sans text-foreground">Producción BigBags</h1>
        <p className="text-sm sm:text-base text-muted-foreground font-sans">
          Análisis detallado de producción de BigBags - {dateRange.toLowerCase()}
          {store && ` - ${store}`}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-muted/50 rounded-lg">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1">
          <label className="text-xs sm:text-sm font-medium whitespace-nowrap font-sans">Tipo:</label>
          <Select value={selectedTipo} onValueChange={setSelectedTipo}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tipoOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1">
          <label className="text-xs sm:text-sm font-medium whitespace-nowrap font-sans">Origen:</label>
          <Select value={selectedOrigen} onValueChange={setSelectedOrigen}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {origenOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedTipo("all")
            setSelectedOrigen("all")
          }}
          className="w-full sm:w-auto text-xs sm:text-sm font-sans"
        >
          Limpiar filtros
        </Button>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Producción Total"
          value={`${data.produccion.total.toLocaleString("es-AR")} kg`}
          subtitle="BigBags producidos"
          change={data.produccion.change}
          changePercent={data.produccion.changePercent}
          icon={<Package className="h-4 w-4" />}
        />

        <DashboardCard
          title="Producción Interna"
          value={`${data.produccion.interno.toLocaleString("es-AR")} kg`}
          subtitle={`${((data.produccion.interno / data.produccion.total) * 100).toFixed(1)}% del total`}
          icon={<TrendingUp className="h-4 w-4" />}
        />

        <DashboardCard
          title="Producción Externa"
          value={`${data.produccion.externo.toLocaleString("es-AR")} kg`}
          subtitle={`${((data.produccion.externo / data.produccion.total) * 100).toFixed(1)}% del total`}
          icon={<Users className="h-4 w-4" />}
        />

        <DashboardCard
          title="Stock en Depósitos"
          value={Object.values(data.stock)
            .reduce((sum, val) => sum + val, 0)
            .toLocaleString("es-AR")}
          subtitle={`${Object.keys(data.stock).length} depósitos`}
          icon={<Warehouse className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
        <ChartContainer title="Tendencia de Producción" subtitle="Interno vs Externo (7 días)">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                formatter={(value: number) => [`${value.toLocaleString("es-AR")} kg`, ""]}
                contentStyle={{
                  fontFamily: "var(--font-roboto)",
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line type="monotone" dataKey="interno" stroke={COLORS[0]} strokeWidth={2} name="Interno" />
              <Line type="monotone" dataKey="externo" stroke={COLORS[1]} strokeWidth={2} name="Externo" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Stock por Depósito" subtitle="Distribución actual">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={stockChartData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={70}
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
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mt-2">
            {stockChartData.slice(0, 4).map((item, index) => (
              <div key={index} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }}></div>
                <span className="text-xs text-muted-foreground font-sans">{item.name}</span>
              </div>
            ))}
          </div>
        </ChartContainer>

        <ChartContainer title="Rendimiento Proveedores" subtitle="Top 10 proveedores">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={rendimientoChartData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis dataKey="name" type="category" width={60} tick={{ fontSize: 9 }} />
              <Tooltip
                formatter={(value: number) => [`${value.toLocaleString("es-AR")} kg`, "Rendimiento"]}
                contentStyle={{
                  fontFamily: "var(--font-roboto)",
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="rendimiento" fill={COLORS[2]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Production Records Table */}
      <ChartContainer title="Registros de Producción" subtitle={`${data.records.length} registros encontrados`}>
        <DataTable columns={columns} data={data.records} searchKey="IDPROD" searchPlaceholder="Buscar por ID..." />
      </ChartContainer>
    </div>
  )
}
