"use client"

import { useEffect, useState } from "react"
import { useAppStore } from "@/lib/store"
import { FN_RangoFechas, FN_Bascula_HojaVerde } from "@/lib/data-loaders"
import { DashboardCard } from "@/components/dashboard-card"
import { ChartContainer } from "@/components/chart-container"
import { DataTable } from "@/components/data-table"
import { Scale, Truck, TrendingUp, Users } from "lucide-react"
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
import type { BasculaRecord } from "@/lib/types"

// Import mock data for table
import basculaMock from "../../data/mock/REGISTROSBASCULA_mock.json"

interface BasculaData {
  hojaVerde: {
    total: number
    change: number
    changePercent: number
    records: BasculaRecord[]
  }
  proveedores: { [proveedor: string]: number }
  productos: { [producto: string]: number }
}

const COLORS = ["#6366f1", "#fbbf24", "#10b981", "#ef4444", "#3b82f6", "#8b5cf6", "#f59e0b"]

const productoOptions = [
  { value: "all", label: "Todos los productos" },
  { value: "HOJA VERDE", label: "Hoja Verde" },
  { value: "PALO", label: "Palo" },
  { value: "CHIP", label: "Chip" },
]

const proveedorOptions = [
  { value: "all", label: "Todos los proveedores" },
  { value: "Tareferos Sur", label: "Tareferos Sur" },
  { value: "ValleRojo", label: "ValleRojo" },
  { value: "Coop San Pedro", label: "Coop San Pedro" },
  { value: "Martinez Hnos", label: "Martinez Hnos" },
  { value: "La Ruta", label: "La Ruta" },
  { value: "Monte Alto", label: "Monte Alto" },
  { value: "Selva Nativa", label: "Selva Nativa" },
  { value: "VerdeCampo", label: "VerdeCampo" },
  { value: "Puente Verde", label: "Puente Verde" },
  { value: "Don Anselmo", label: "Don Anselmo" },
  { value: "El Ceibo", label: "El Ceibo" },
  { value: "AgroMisiones", label: "AgroMisiones" },
]

export default function BasculaPage() {
  const { dateRange, store } = useAppStore()
  const [data, setData] = useState<BasculaData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedProducto, setSelectedProducto] = useState<string>("all")
  const [selectedProveedor, setSelectedProveedor] = useState<string>("all")

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const { current } = FN_RangoFechas({ dateRange, store })

        const hojaVerdeData = await FN_Bascula_HojaVerde(current, store)

        // Filter mock records for analysis
        const filteredRecords = (basculaMock as BasculaRecord[]).filter((record) => {
          const recordDate = new Date(record.FECHA)
          const inRange = recordDate >= current.start && recordDate <= current.end
          const matchesStore = !store || record.DESTINO === store
          const matchesProducto = selectedProducto === "all" || record.PRODUCTO === selectedProducto
          const matchesProveedor = selectedProveedor === "all" || record.PROVEEDOR === selectedProveedor

          return inRange && matchesStore && matchesProducto && matchesProveedor
        })

        // Calculate provider totals
        const proveedores = filteredRecords.reduce(
          (acc, record) => {
            acc[record.PROVEEDOR] = (acc[record.PROVEEDOR] || 0) + record.NETO
            return acc
          },
          {} as Record<string, number>,
        )

        // Calculate product totals
        const productos = filteredRecords.reduce(
          (acc, record) => {
            acc[record.PRODUCTO] = (acc[record.PRODUCTO] || 0) + record.NETO
            return acc
          },
          {} as Record<string, number>,
        )

        setData({
          hojaVerde: {
            ...hojaVerdeData.current,
            change: hojaVerdeData.change,
            changePercent: hojaVerdeData.changePercent,
            records: filteredRecords,
          },
          proveedores,
          productos,
        })
      } catch (error) {
        console.error("Error loading Bascula data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [dateRange, store, selectedProducto, selectedProveedor])

  // Table columns
  const columns: ColumnDef<BasculaRecord>[] = [
    {
      accessorKey: "FECHA",
      header: "Fecha",
      cell: ({ row }) => {
        const date = new Date(row.getValue("FECHA"))
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
      accessorKey: "TICNUM",
      header: "Ticket",
      cell: ({ row }) => {
        const ticnum = row.getValue("TICNUM") as number
        return <span className="font-mono text-sm font-semibold">{ticnum}</span>
      },
    },
    {
      accessorKey: "PROVEEDOR",
      header: "Proveedor",
      cell: ({ row }) => <span className="font-sans text-sm">{row.getValue("PROVEEDOR")}</span>,
    },
    {
      accessorKey: "PRODUCTO",
      header: "Producto",
      cell: ({ row }) => {
        const producto = row.getValue("PRODUCTO") as string
        const colors = {
          "HOJA VERDE": "text-green-600",
          PALO: "text-orange-600",
          CHIP: "text-blue-600",
        }
        return (
          <span className={`font-sans text-sm font-medium ${colors[producto as keyof typeof colors] || ""}`}>
            {producto}
          </span>
        )
      },
    },
    {
      accessorKey: "NETO",
      header: "Peso Neto (kg)",
      cell: ({ row }) => {
        const neto = Number.parseFloat(row.getValue("NETO"))
        return <span className="font-mono text-sm font-semibold">{neto.toLocaleString("es-AR")}</span>
      },
    },
    {
      accessorKey: "DESTINO",
      header: "Destino",
      cell: ({ row }) => <span className="font-sans text-sm">{row.getValue("DESTINO")}</span>,
    },
    {
      accessorKey: "PATENTE",
      header: "Patente",
      cell: ({ row }) => {
        const patente = row.getValue("PATENTE") as string
        return <span className="font-mono text-sm font-medium">{patente}</span>
      },
    },
    {
      accessorKey: "CHOFER",
      header: "Chofer",
      cell: ({ row }) => <span className="font-sans text-sm">{row.getValue("CHOFER")}</span>,
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-sans text-foreground">Control de Báscula</h1>
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
          <h1 className="text-3xl font-bold font-sans text-foreground">Control de Báscula</h1>
          <p className="text-muted-foreground font-sans">Error al cargar los datos</p>
        </div>
      </div>
    )
  }

  // Prepare chart data
  const proveedoresChartData = Object.entries(data.proveedores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([proveedor, total]) => ({
      name: proveedor,
      value: total,
    }))

  const productosChartData = Object.entries(data.productos).map(([producto, total], index) => ({
    name: producto,
    value: total,
    fill: COLORS[index % COLORS.length],
  }))

  const totalIngresos = Object.values(data.productos).reduce((sum, val) => sum + val, 0)
  const totalProveedores = Object.keys(data.proveedores).length
  const totalRegistros = data.hojaVerde.records.length

  // Mock daily trend data
  const trendData = [
    { day: "Lun", hojaVerde: 18500, palo: 4200, chip: 2800 },
    { day: "Mar", hojaVerde: 21200, palo: 3800, chip: 3200 },
    { day: "Mié", hojaVerde: 19800, palo: 4500, chip: 2600 },
    { day: "Jue", hojaVerde: 23100, palo: 4100, chip: 3500 },
    { day: "Vie", hojaVerde: 20600, palo: 3900, chip: 3100 },
    { day: "Sáb", hojaVerde: 16800, palo: 3200, chip: 2400 },
    { day: "Dom", hojaVerde: 14200, palo: 2800, chip: 1900 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-sans text-foreground">Control de Báscula</h1>
        <p className="text-muted-foreground font-sans">
          Monitoreo de ingresos por báscula - {dateRange.toLowerCase()}
          {store && ` - ${store}`}
        </p>
      </div>

      {/* Additional Filters */}
      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium font-sans">Producto:</label>
          <Select value={selectedProducto} onValueChange={setSelectedProducto}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {productoOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium font-sans">Proveedor:</label>
          <Select value={selectedProveedor} onValueChange={setSelectedProveedor}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {proveedorOptions.map((option) => (
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
            setSelectedProducto("all")
            setSelectedProveedor("all")
          }}
          className="font-sans"
        >
          Limpiar filtros
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Ingresado"
          value={`${totalIngresos.toLocaleString("es-AR")} kg`}
          subtitle="Peso neto total"
          change={data.hojaVerde.change}
          changePercent={data.hojaVerde.changePercent}
          icon={<Scale className="h-4 w-4" />}
        />

        <DashboardCard
          title="Proveedores Activos"
          value={totalProveedores}
          subtitle="Proveedores únicos"
          icon={<Users className="h-4 w-4" />}
        />

        <DashboardCard
          title="Registros de Báscula"
          value={totalRegistros}
          subtitle="Tickets procesados"
          icon={<Truck className="h-4 w-4" />}
        />

        <DashboardCard
          title="Promedio por Ticket"
          value={`${Math.round(totalIngresos / totalRegistros).toLocaleString("es-AR")} kg`}
          subtitle="Peso promedio"
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Top Providers */}
        <ChartContainer title="Top 10 Proveedores" subtitle="Por peso neto ingresado">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={proveedoresChartData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip
                formatter={(value: number) => [`${value.toLocaleString("es-AR")} kg`, "Peso Neto"]}
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

        {/* Product Distribution */}
        <ChartContainer title="Distribución por Producto" subtitle="Peso por tipo de producto">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={productosChartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {productosChartData.map((entry, index) => (
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
            {productosChartData.map((item, index) => (
              <div key={index} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }}></div>
                <span className="text-xs text-muted-foreground font-sans">{item.name}</span>
              </div>
            ))}
          </div>
        </ChartContainer>

        {/* Daily Trend */}
        <ChartContainer title="Tendencia Diaria" subtitle="Ingresos por día y producto">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
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
              <Line type="monotone" dataKey="hojaVerde" stroke={COLORS[0]} strokeWidth={2} name="Hoja Verde" />
              <Line type="monotone" dataKey="palo" stroke={COLORS[1]} strokeWidth={2} name="Palo" />
              <Line type="monotone" dataKey="chip" stroke={COLORS[2]} strokeWidth={2} name="Chip" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Bascula Records Table */}
      <ChartContainer title="Registros de Báscula" subtitle={`${data.hojaVerde.records.length} registros encontrados`}>
        <DataTable
          columns={columns}
          data={data.hojaVerde.records}
          searchKey="PROVEEDOR"
          searchPlaceholder="Buscar por proveedor..."
        />
      </ChartContainer>
    </div>
  )
}
