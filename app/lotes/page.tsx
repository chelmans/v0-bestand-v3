"use client"

import { useEffect, useState } from "react"
import { useAppStore } from "@/lib/store"
import { FN_RangoFechas, FN_Lotes_Resumen, FN_Lotes_Detalle, FN_Lotes_EnDespacho } from "@/lib/data-loaders"
import { DashboardCard } from "@/components/dashboard-card"
import { ChartContainer } from "@/components/chart-container"
import { DataTable } from "@/components/data-table"
import { Layers, Package, CheckCircle, Truck, AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import type { LoteRecord } from "@/lib/types"

// Import mock data for table
import lotesMock from "../../data/mock/LOTESABIERTOS_mock.json"

interface LotesData {
  resumen: {
    abiertos: number
    enProceso: number
    finalizados: number
    despachados: number
    total: number
  }
  records: LoteRecord[]
  enDespacho: LoteRecord[]
}

const COLORS = ["#6366f1", "#fbbf24", "#10b981", "#ef4444", "#3b82f6"]

const estadoOptions = [
  { value: "all", label: "Todos los estados" },
  { value: "ABIERTO", label: "Abierto" },
  { value: "EN PROCESO", label: "En Proceso" },
  { value: "FINALIZADO", label: "Finalizado" },
  { value: "OBSERVACIÓN", label: "Observación" },
  { value: "DESPACHADO", label: "Despachado" },
]

const productoOptions = [
  { value: "all", label: "Todos los productos" },
  { value: "FNGS", label: "FNGS" },
  { value: "RAMA", label: "RAMA" },
  { value: "BT2", label: "BT2" },
  { value: "D1", label: "D1" },
  { value: "D2", label: "D2" },
  { value: "PV", label: "PV" },
  { value: "DZ", label: "DZ" },
  { value: "PF", label: "PF" },
  { value: "BT1", label: "BT1" },
]

const clienteOptions = [
  { value: "all", label: "Todos los clientes" },
  { value: "GlobalTea Ltd", label: "GlobalTea Ltd" },
  { value: "Yerbamarket SRL", label: "Yerbamarket SRL" },
  { value: "Marítima Andes", label: "Marítima Andes" },
  { value: "TeaWorld GmbH", label: "TeaWorld GmbH" },
  { value: "Port Pacific SA", label: "Port Pacific SA" },
  { value: "Teexport SA", label: "Teexport SA" },
]

export default function LotesPage() {
  const { dateRange, store } = useAppStore()
  const [data, setData] = useState<LotesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedEstado, setSelectedEstado] = useState<string>("all")
  const [selectedProducto, setSelectedProducto] = useState<string>("all")
  const [selectedCliente, setSelectedCliente] = useState<string>("all")

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const { current } = FN_RangoFechas({ dateRange, store })

        const tipos = selectedProducto === "all" ? undefined : [selectedProducto]

        const [resumenData, detalleData, despachoData] = await Promise.all([
          FN_Lotes_Resumen(current, store, tipos),
          FN_Lotes_Detalle(current, store, tipos),
          FN_Lotes_EnDespacho(current, store),
        ])

        // Filter mock records for table
        const filteredRecords = (lotesMock as LoteRecord[]).filter((record) => {
          const matchesStore = !store || record.STORE === store
          const matchesEstado = selectedEstado === "all" || record.ESTADO === selectedEstado
          const matchesProducto = selectedProducto === "all" || record.PRODUCTO === selectedProducto
          const matchesCliente = selectedCliente === "all" || record.CLIENTE === selectedCliente

          return matchesStore && matchesEstado && matchesProducto && matchesCliente
        })

        setData({
          resumen: resumenData,
          records: filteredRecords,
          enDespacho: despachoData,
        })
      } catch (error) {
        console.error("Error loading Lotes data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [dateRange, store, selectedEstado, selectedProducto, selectedCliente])

  // Table columns
  const columns: ColumnDef<LoteRecord>[] = [
    {
      accessorKey: "LOTE",
      header: "Lote",
      cell: ({ row }) => {
        const lote = row.getValue("LOTE") as string
        return <span className="font-mono text-sm font-semibold">{lote}</span>
      },
    },
    {
      accessorKey: "ESTADO",
      header: "Estado",
      cell: ({ row }) => {
        const estado = row.getValue("ESTADO") as string
        const variants = {
          ABIERTO: "default",
          "EN PROCESO": "secondary",
          FINALIZADO: "outline",
          OBSERVACIÓN: "destructive",
          DESPACHADO: "default",
        } as const
        return <Badge variant={variants[estado as keyof typeof variants] || "default"}>{estado}</Badge>
      },
    },
    {
      accessorKey: "PRODUCTO",
      header: "Producto",
      cell: ({ row }) => <span className="font-sans text-sm font-medium">{row.getValue("PRODUCTO")}</span>,
    },
    {
      accessorKey: "CLIENTE",
      header: "Cliente",
      cell: ({ row }) => <span className="font-sans text-sm">{row.getValue("CLIENTE")}</span>,
    },
    {
      accessorKey: "TOTALKG",
      header: "Total (kg)",
      cell: ({ row }) => {
        const total = Number.parseFloat(row.getValue("TOTALKG"))
        return <span className="font-mono text-sm font-semibold">{total.toLocaleString("es-AR")}</span>
      },
    },
    {
      accessorKey: "NPALLETS",
      header: "Pallets",
      cell: ({ row }) => <span className="font-mono text-sm">{row.getValue("NPALLETS")}</span>,
    },
    {
      accessorKey: "NBOLSAS",
      header: "Bolsas",
      cell: ({ row }) => <span className="font-mono text-sm">{row.getValue("NBOLSAS")}</span>,
    },
    {
      accessorKey: "LABORATORIO",
      header: "Laboratorio",
      cell: ({ row }) => {
        const lab = row.getValue("LABORATORIO") as string
        const colors = {
          "ADJUNTA PDF": "text-green-600",
          "CALADO BOLSA": "text-blue-600",
          RECIBIDO: "text-orange-600",
          ENVIADO: "text-purple-600",
          "SIN DATOS": "text-gray-500",
        }
        return (
          <span className={`font-sans text-sm font-medium ${colors[lab as keyof typeof colors] || ""}`}>{lab}</span>
        )
      },
    },
    {
      accessorKey: "ETIQUETAS",
      header: "Etiquetas",
      cell: ({ row }) => {
        const etiquetas = row.getValue("ETIQUETAS") as string
        const colors = {
          "ENVIADO IMPRESION": "text-blue-600",
          RECIBIDO: "text-green-600",
          "SIN DATOS": "text-gray-500",
        }
        return (
          <span className={`font-sans text-sm font-medium ${colors[etiquetas as keyof typeof colors] || ""}`}>
            {etiquetas}
          </span>
        )
      },
    },
    {
      accessorKey: "ESTIBADO",
      header: "Estibado",
      cell: ({ row }) => <span className="font-sans text-sm">{row.getValue("ESTIBADO")}</span>,
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
          <h1 className="text-3xl font-bold font-sans text-foreground">Gestión de Lotes</h1>
          <p className="text-muted-foreground font-sans">Cargando datos...</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
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
          <h1 className="text-3xl font-bold font-sans text-foreground">Gestión de Lotes</h1>
          <p className="text-muted-foreground font-sans">Error al cargar los datos</p>
        </div>
      </div>
    )
  }

  // Prepare chart data
  const estadoChartData = [
    { name: "Abiertos", value: data.resumen.abiertos, fill: COLORS[0] },
    { name: "En Proceso", value: data.resumen.enProceso, fill: COLORS[1] },
    { name: "Finalizados", value: data.resumen.finalizados, fill: COLORS[2] },
    { name: "Despachados", value: data.resumen.despachados, fill: COLORS[3] },
  ]

  // Product distribution
  const productosCount = data.records.reduce(
    (acc, record) => {
      acc[record.PRODUCTO] = (acc[record.PRODUCTO] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const productosChartData = Object.entries(productosCount)
    .slice(0, 8)
    .map(([producto, count], index) => ({
      name: producto,
      value: count,
      fill: COLORS[index % COLORS.length],
    }))

  // Client distribution
  const clientesCount = data.records.reduce(
    (acc, record) => {
      acc[record.CLIENTE] = (acc[record.CLIENTE] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const clientesChartData = Object.entries(clientesCount)
    .slice(0, 6)
    .map(([cliente, count]) => ({
      name: cliente.length > 15 ? cliente.substring(0, 15) + "..." : cliente,
      fullName: cliente,
      value: count,
    }))

  // Mock trend data
  const trendData = [
    { day: "Lun", abiertos: 12, proceso: 8, finalizados: 5 },
    { day: "Mar", abiertos: 15, proceso: 10, finalizados: 7 },
    { day: "Mié", abiertos: 11, proceso: 12, finalizados: 6 },
    { day: "Jue", abiertos: 18, proceso: 9, finalizados: 8 },
    { day: "Vie", abiertos: 14, proceso: 11, finalizados: 9 },
    { day: "Sáb", abiertos: 9, proceso: 7, finalizados: 4 },
    { day: "Dom", abiertos: 6, proceso: 5, finalizados: 3 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-sans text-foreground">Gestión de Lotes</h1>
        <p className="text-muted-foreground font-sans">
          Control y seguimiento de lotes de producción - {dateRange.toLowerCase()}
          {store && ` - ${store}`}
        </p>
      </div>

      {/* Additional Filters */}
      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium font-sans">Estado:</label>
          <Select value={selectedEstado} onValueChange={setSelectedEstado}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {estadoOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
          <label className="text-sm font-medium font-sans">Cliente:</label>
          <Select value={selectedCliente} onValueChange={setSelectedCliente}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {clienteOptions.map((option) => (
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
            setSelectedEstado("all")
            setSelectedProducto("all")
            setSelectedCliente("all")
          }}
          className="font-sans"
        >
          Limpiar filtros
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <DashboardCard
          title="Lotes Abiertos"
          value={data.resumen.abiertos}
          subtitle="Listos para proceso"
          icon={<Layers className="h-4 w-4" />}
        />

        <DashboardCard
          title="En Proceso"
          value={data.resumen.enProceso}
          subtitle="Siendo procesados"
          icon={<Package className="h-4 w-4" />}
        />

        <DashboardCard
          title="Finalizados"
          value={data.resumen.finalizados}
          subtitle="Listos para despacho"
          icon={<CheckCircle className="h-4 w-4" />}
        />

        <DashboardCard
          title="Despachados"
          value={data.resumen.despachados}
          subtitle="Enviados a cliente"
          icon={<Truck className="h-4 w-4" />}
        />

        <DashboardCard
          title="Total Lotes"
          value={data.resumen.total}
          subtitle={`${data.records.length} registros`}
          icon={<AlertCircle className="h-4 w-4" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Estado Distribution */}
        <ChartContainer title="Distribución por Estado" subtitle="Estado actual de lotes">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={estadoChartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {estadoChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
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
            {estadoChartData.map((item, index) => (
              <div key={index} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }}></div>
                <span className="text-xs text-muted-foreground font-sans">{item.name}</span>
              </div>
            ))}
          </div>
        </ChartContainer>

        {/* Product Distribution */}
        <ChartContainer title="Distribución por Producto" subtitle="Top productos">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={productosChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  fontFamily: "var(--font-roboto)",
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" fill={COLORS[1]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Weekly Trend */}
        <ChartContainer title="Tendencia Semanal" subtitle="Estados por día">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  fontFamily: "var(--font-roboto)",
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line type="monotone" dataKey="abiertos" stroke={COLORS[0]} strokeWidth={2} name="Abiertos" />
              <Line type="monotone" dataKey="proceso" stroke={COLORS[1]} strokeWidth={2} name="En Proceso" />
              <Line type="monotone" dataKey="finalizados" stroke={COLORS[2]} strokeWidth={2} name="Finalizados" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Client Analysis */}
      <div className="grid gap-6 md:grid-cols-2">
        <ChartContainer title="Lotes por Cliente" subtitle="Distribución de clientes">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={clientesChartData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip
                formatter={(value: number, name, props) => [value, `Lotes - ${props.payload?.fullName}`]}
                contentStyle={{
                  fontFamily: "var(--font-roboto)",
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" fill={COLORS[2]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Resumen de Calidad" subtitle="Estado de laboratorio y etiquetas">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold font-mono text-green-600">
                  {data.records.filter((r) => r.LABORATORIO === "ADJUNTA PDF").length}
                </div>
                <div className="text-sm text-muted-foreground font-sans">Con PDF Lab</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold font-mono text-blue-600">
                  {data.records.filter((r) => r.ETIQUETAS === "RECIBIDO").length}
                </div>
                <div className="text-sm text-muted-foreground font-sans">Etiquetas OK</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold font-mono text-orange-600">
                  {data.records.filter((r) => r.LABORATORIO === "RECIBIDO").length}
                </div>
                <div className="text-sm text-muted-foreground font-sans">Lab Recibido</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold font-mono text-purple-600">
                  {data.records.filter((r) => r.ETIQUETAS === "ENVIADO IMPRESION").length}
                </div>
                <div className="text-sm text-muted-foreground font-sans">En Impresión</div>
              </div>
            </div>
          </div>
        </ChartContainer>
      </div>

      {/* Lotes Records Table */}
      <ChartContainer title="Registros de Lotes" subtitle={`${data.records.length} lotes encontrados`}>
        <DataTable columns={columns} data={data.records} searchKey="LOTE" searchPlaceholder="Buscar por lote..." />
      </ChartContainer>
    </div>
  )
}
