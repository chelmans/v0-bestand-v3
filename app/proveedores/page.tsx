"use client"

import { useEffect, useState } from "react"
import { useAppStore } from "@/lib/store"
import { DashboardCard } from "@/components/dashboard-card"
import { ChartContainer } from "@/components/chart-container"
import { DataTable } from "@/components/data-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Search, Eye, Table, BarChart3, TrendingUp, MapPin, Phone, Mail } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { ColumnDef } from "@tanstack/react-table"

interface Proveedor {
  ID: string
  NOMBRE: string
  DIRECCION: string
  MUNICIPIO: string
  DEPARTAMENTO: string
  PROVINCIA: string
  CUIT: string
  CONDICION: string
  TELEFONO: string
  EMAIL: string
  DATEALTA: string
  SALDOMAX: number
  TIPOCLIENTE: string
  TIPODOC: string
  CHACRAS: number
  LOTES: number
  NINYM: string
  ID_PROPIO: string
  ESTADO: string
  hojaVerdeTotal: number
}

// Mock data for proveedores
const mockProveedores: Proveedor[] = [
  {
    ID: "PROV001",
    NOMBRE: "Establecimiento San Miguel",
    DIRECCION: "Ruta 14 Km 45",
    MUNICIPIO: "San Javier",
    DEPARTAMENTO: "San Javier",
    PROVINCIA: "Misiones",
    CUIT: "20-12345678-9",
    CONDICION: "ACTIVO",
    TELEFONO: "+54 3755 123456",
    EMAIL: "contacto@sanmiguel.com.ar",
    DATEALTA: "2020-03-15",
    SALDOMAX: 500000,
    TIPOCLIENTE: "PRODUCTOR",
    TIPODOC: "CUIT",
    CHACRAS: 3,
    LOTES: 12,
    NINYM: "12345678901",
    ID_PROPIO: "SM001",
    ESTADO: "ACTIVO",
    hojaVerdeTotal: 125000,
  },
  {
    ID: "PROV002",
    NOMBRE: "Cooperativa Yerba Buena",
    DIRECCION: "Av. Libertad 890",
    MUNICIPIO: "Oberá",
    DEPARTAMENTO: "Oberá",
    PROVINCIA: "Misiones",
    CUIT: "30-87654321-2",
    CONDICION: "ACTIVO",
    TELEFONO: "+54 3755 987654",
    EMAIL: "admin@yerbabuena.coop",
    DATEALTA: "2019-07-22",
    SALDOMAX: 750000,
    TIPOCLIENTE: "COOPERATIVA",
    TIPODOC: "CUIT",
    CHACRAS: 8,
    LOTES: 25,
    NINYM: "98765432109",
    ID_PROPIO: "YB002",
    ESTADO: "ACTIVO",
    hojaVerdeTotal: 98500,
  },
  {
    ID: "PROV003",
    NOMBRE: "Finca Los Aromos",
    DIRECCION: "Camino Rural S/N",
    MUNICIPIO: "Apóstoles",
    DEPARTAMENTO: "Apóstoles",
    PROVINCIA: "Misiones",
    CUIT: "27-11223344-5",
    CONDICION: "ACTIVO",
    TELEFONO: "+54 3755 456789",
    EMAIL: "info@losaromos.com",
    DATEALTA: "2021-01-10",
    SALDOMAX: 300000,
    TIPOCLIENTE: "PRODUCTOR",
    TIPODOC: "CUIT",
    CHACRAS: 2,
    LOTES: 8,
    NINYM: "11223344556",
    ID_PROPIO: "LA003",
    ESTADO: "ACTIVO",
    hojaVerdeTotal: 87200,
  },
  {
    ID: "PROV004",
    NOMBRE: "Agropecuaria El Talar",
    DIRECCION: "Ruta 103 Km 12",
    MUNICIPIO: "Leandro N. Alem",
    DEPARTAMENTO: "Leandro N. Alem",
    PROVINCIA: "Misiones",
    CUIT: "20-55667788-1",
    CONDICION: "ACTIVO",
    TELEFONO: "+54 3755 321654",
    EMAIL: "ventas@eltalar.com.ar",
    DATEALTA: "2018-11-05",
    SALDOMAX: 600000,
    TIPOCLIENTE: "PRODUCTOR",
    TIPODOC: "CUIT",
    CHACRAS: 5,
    LOTES: 18,
    NINYM: "55667788990",
    ID_PROPIO: "ET004",
    ESTADO: "ACTIVO",
    hojaVerdeTotal: 76800,
  },
  {
    ID: "PROV005",
    NOMBRE: "Establecimiento La Esperanza",
    DIRECCION: "Colonia Wanda",
    MUNICIPIO: "Wanda",
    DEPARTAMENTO: "Iguazú",
    PROVINCIA: "Misiones",
    CUIT: "20-99887766-3",
    CONDICION: "ACTIVO",
    TELEFONO: "+54 3757 123987",
    EMAIL: "laesperanza@gmail.com",
    DATEALTA: "2020-09-18",
    SALDOMAX: 400000,
    TIPOCLIENTE: "PRODUCTOR",
    TIPODOC: "CUIT",
    CHACRAS: 4,
    LOTES: 15,
    NINYM: "99887766554",
    ID_PROPIO: "LE005",
    ESTADO: "ACTIVO",
    hojaVerdeTotal: 65400,
  },
  {
    ID: "PROV006",
    NOMBRE: "Cooperativa Montecarlo",
    DIRECCION: "Av. Argentina 456",
    MUNICIPIO: "Montecarlo",
    DEPARTAMENTO: "Montecarlo",
    PROVINCIA: "Misiones",
    CUIT: "30-44556677-8",
    CONDICION: "ACTIVO",
    TELEFONO: "+54 3751 789456",
    EMAIL: "info@coopmontecarlo.com",
    DATEALTA: "2017-05-30",
    SALDOMAX: 850000,
    TIPOCLIENTE: "COOPERATIVA",
    TIPODOC: "CUIT",
    CHACRAS: 12,
    LOTES: 35,
    NINYM: "44556677889",
    ID_PROPIO: "CM006",
    ESTADO: "ACTIVO",
    hojaVerdeTotal: 58900,
  },
  {
    ID: "PROV007",
    NOMBRE: "Finca Santa Rosa",
    DIRECCION: "Ruta 12 Km 78",
    MUNICIPIO: "Puerto Rico",
    DEPARTAMENTO: "Libertador Gral. San Martín",
    PROVINCIA: "Misiones",
    CUIT: "27-33445566-7",
    CONDICION: "ACTIVO",
    TELEFONO: "+54 3743 654321",
    EMAIL: "santarosa@outlook.com",
    DATEALTA: "2019-12-03",
    SALDOMAX: 350000,
    TIPOCLIENTE: "PRODUCTOR",
    TIPODOC: "CUIT",
    CHACRAS: 3,
    LOTES: 11,
    NINYM: "33445566778",
    ID_PROPIO: "SR007",
    ESTADO: "ACTIVO",
    hojaVerdeTotal: 52300,
  },
  {
    ID: "PROV008",
    NOMBRE: "Agro San Pedro",
    DIRECCION: "Zona Rural",
    MUNICIPIO: "San Pedro",
    DEPARTAMENTO: "San Pedro",
    PROVINCIA: "Misiones",
    CUIT: "20-77889900-2",
    CONDICION: "ACTIVO",
    TELEFONO: "+54 3755 147258",
    EMAIL: "agrosanpedro@hotmail.com",
    DATEALTA: "2021-06-14",
    SALDOMAX: 280000,
    TIPOCLIENTE: "PRODUCTOR",
    TIPODOC: "CUIT",
    CHACRAS: 2,
    LOTES: 7,
    NINYM: "77889900112",
    ID_PROPIO: "SP008",
    ESTADO: "ACTIVO",
    hojaVerdeTotal: 48700,
  },
  {
    ID: "PROV009",
    NOMBRE: "Establecimiento El Progreso",
    DIRECCION: "Picada 15",
    MUNICIPIO: "Eldorado",
    DEPARTAMENTO: "Eldorado",
    PROVINCIA: "Misiones",
    CUIT: "20-66778899-4",
    CONDICION: "ACTIVO",
    TELEFONO: "+54 3751 369852",
    EMAIL: "elprogreso@gmail.com",
    DATEALTA: "2018-08-27",
    SALDOMAX: 450000,
    TIPOCLIENTE: "PRODUCTOR",
    TIPODOC: "CUIT",
    CHACRAS: 4,
    LOTES: 16,
    NINYM: "66778899003",
    ID_PROPIO: "EP009",
    ESTADO: "ACTIVO",
    hojaVerdeTotal: 44200,
  },
  {
    ID: "PROV010",
    NOMBRE: "Cooperativa Jardín América",
    DIRECCION: "Calle Principal 123",
    MUNICIPIO: "Jardín América",
    DEPARTAMENTO: "San Ignacio",
    PROVINCIA: "Misiones",
    CUIT: "30-22334455-6",
    CONDICION: "ACTIVO",
    TELEFONO: "+54 3751 258147",
    EMAIL: "coopjardin@coop.com.ar",
    DATEALTA: "2020-02-20",
    SALDOMAX: 700000,
    TIPOCLIENTE: "COOPERATIVA",
    TIPODOC: "CUIT",
    CHACRAS: 9,
    LOTES: 28,
    NINYM: "22334455667",
    ID_PROPIO: "JA010",
    ESTADO: "ACTIVO",
    hojaVerdeTotal: 41800,
  },
]

export default function ProveedoresPage() {
  const { dateRange, store } = useAppStore()
  const [proveedores, setProveedores] = useState<Proveedor[]>(mockProveedores)
  const [filteredProveedores, setFilteredProveedores] = useState<Proveedor[]>(mockProveedores)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null)
  const [viewMode, setViewMode] = useState<"search" | "table">("search")
  const [loading, setLoading] = useState(false)

  // Filter proveedores based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredProveedores(proveedores)
    } else {
      const filtered = proveedores.filter(
        (proveedor) =>
          proveedor.NOMBRE.toLowerCase().includes(searchTerm.toLowerCase()) ||
          proveedor.CUIT.includes(searchTerm) ||
          proveedor.ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
          proveedor.MUNICIPIO.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredProveedores(filtered)
    }
  }, [searchTerm, proveedores])

  // Get top 10 proveedores by hoja verde
  const top10Proveedores = [...proveedores].sort((a, b) => b.hojaVerdeTotal - a.hojaVerdeTotal).slice(0, 10)

  // Prepare chart data
  const chartData = top10Proveedores.map((proveedor) => ({
    name: proveedor.NOMBRE.length > 15 ? proveedor.NOMBRE.substring(0, 15) + "..." : proveedor.NOMBRE,
    fullName: proveedor.NOMBRE,
    value: proveedor.hojaVerdeTotal,
  }))

  // Table columns
  const columns: ColumnDef<Proveedor>[] = [
    {
      accessorKey: "ID",
      header: "ID",
      cell: ({ row }) => <span className="font-mono text-sm">{row.getValue("ID")}</span>,
    },
    {
      accessorKey: "NOMBRE",
      header: "Nombre",
      cell: ({ row }) => (
        <div>
          <span className="font-sans text-sm font-medium">{row.getValue("NOMBRE")}</span>
          <div className="text-xs text-muted-foreground font-sans">{row.original.TIPOCLIENTE}</div>
        </div>
      ),
    },
    {
      accessorKey: "MUNICIPIO",
      header: "Ubicación",
      cell: ({ row }) => (
        <div className="font-sans text-sm">
          <div>{row.getValue("MUNICIPIO")}</div>
          <div className="text-xs text-muted-foreground">{row.original.PROVINCIA}</div>
        </div>
      ),
    },
    {
      accessorKey: "CUIT",
      header: "CUIT",
      cell: ({ row }) => <span className="font-mono text-sm">{row.getValue("CUIT")}</span>,
    },
    {
      accessorKey: "TELEFONO",
      header: "Contacto",
      cell: ({ row }) => (
        <div className="font-sans text-sm">
          <div>{row.getValue("TELEFONO")}</div>
          <div className="text-xs text-muted-foreground">{row.original.EMAIL}</div>
        </div>
      ),
    },
    {
      accessorKey: "hojaVerdeTotal",
      header: "Hoja Verde (kg)",
      cell: ({ row }) => (
        <span className="font-mono text-sm font-semibold">
          {row.getValue<number>("hojaVerdeTotal").toLocaleString("es-AR")}
        </span>
      ),
    },
    {
      accessorKey: "CHACRAS",
      header: "Chacras",
      cell: ({ row }) => <span className="font-mono text-sm">{row.getValue("CHACRAS")}</span>,
    },
    {
      accessorKey: "ESTADO",
      header: "Estado",
      cell: ({ row }) => {
        const estado = row.getValue("ESTADO") as string
        return (
          <Badge variant={estado === "ACTIVO" ? "default" : "secondary"} className="font-sans">
            {estado}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <Button variant="outline" size="sm" onClick={() => setSelectedProveedor(row.original)} className="font-sans">
          <Eye className="h-3 w-3 mr-1" />
          Ver
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-sans text-foreground">Proveedores</h1>
        <p className="text-muted-foreground font-sans">Gestión y análisis de proveedores de hoja verde</p>
      </div>

      {/* Top 10 Proveedores */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-sans text-foreground flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Top 10 Proveedores por Hoja Verde Recibida
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <ChartContainer title="Ranking de Proveedores" subtitle="Por cantidad de hoja verde entregada">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip
                  formatter={(value: number, name, props) => [
                    `${value.toLocaleString("es-AR")} kg`,
                    props.payload.fullName,
                  ]}
                  contentStyle={{
                    fontFamily: "var(--font-roboto)",
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="value" fill="#059669" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          <div className="grid gap-4 md:grid-cols-2">
            <DashboardCard
              title="Total Proveedores"
              value={proveedores.length}
              subtitle="Proveedores activos"
              icon={<Users className="h-4 w-4" />}
            />
            <DashboardCard
              title="Hoja Verde Total"
              value={`${proveedores.reduce((sum, p) => sum + p.hojaVerdeTotal, 0).toLocaleString("es-AR")} kg`}
              subtitle="Recibida en el período"
              icon={<TrendingUp className="h-4 w-4" />}
              variant="accent"
            />
            <DashboardCard
              title="Cooperativas"
              value={proveedores.filter((p) => p.TIPOCLIENTE === "COOPERATIVA").length}
              subtitle="Del total de proveedores"
              icon={<Users className="h-4 w-4" />}
            />
            <DashboardCard
              title="Productores"
              value={proveedores.filter((p) => p.TIPOCLIENTE === "PRODUCTOR").length}
              subtitle="Individuales"
              icon={<Users className="h-4 w-4" />}
              variant="gradient"
            />
          </div>
        </div>
      </div>

      {/* Search and Table Controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-sans text-foreground flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Buscador de Proveedores
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "search" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("search")}
              className="font-sans"
            >
              <Search className="h-3 w-3 mr-1" />
              Búsqueda
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="font-sans"
            >
              <Table className="h-3 w-3 mr-1" />
              Tabla
            </Button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, CUIT, ID o municipio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Search Results or Table View */}
        {viewMode === "search" ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProveedores.slice(0, 12).map((proveedor) => (
              <div
                key={proveedor.ID}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedProveedor(proveedor)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold font-sans text-sm">{proveedor.NOMBRE}</h3>
                  <Badge variant={proveedor.ESTADO === "ACTIVO" ? "default" : "secondary"} className="text-xs">
                    {proveedor.ESTADO}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span className="font-sans">
                      {proveedor.MUNICIPIO}, {proveedor.PROVINCIA}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    <span className="font-mono">{proveedor.TELEFONO}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    <span className="font-mono text-xs">{proveedor.EMAIL}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium font-sans">Hoja Verde:</span>
                    <span className="text-sm font-bold font-mono text-primary">
                      {proveedor.hojaVerdeTotal.toLocaleString("es-AR")} kg
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ChartContainer title="Tabla de Proveedores" subtitle={`${filteredProveedores.length} proveedores`}>
            <DataTable
              columns={columns}
              data={filteredProveedores}
              searchKey="NOMBRE"
              searchPlaceholder="Buscar proveedores..."
            />
          </ChartContainer>
        )}
      </div>

      {/* Proveedor Detail Modal */}
      {selectedProveedor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold font-sans">{selectedProveedor.NOMBRE}</h2>
                  <p className="text-muted-foreground font-sans">{selectedProveedor.TIPOCLIENTE}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setSelectedProveedor(null)}>
                  Cerrar
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="font-semibold font-sans">Información General</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium font-sans">ID:</span>
                      <span className="ml-2 font-mono">{selectedProveedor.ID}</span>
                    </div>
                    <div>
                      <span className="font-medium font-sans">CUIT:</span>
                      <span className="ml-2 font-mono">{selectedProveedor.CUIT}</span>
                    </div>
                    <div>
                      <span className="font-medium font-sans">Condición:</span>
                      <span className="ml-2 font-sans">{selectedProveedor.CONDICION}</span>
                    </div>
                    <div>
                      <span className="font-medium font-sans">Fecha Alta:</span>
                      <span className="ml-2 font-mono">{selectedProveedor.DATEALTA}</span>
                    </div>
                    <div>
                      <span className="font-medium font-sans">Saldo Máximo:</span>
                      <span className="ml-2 font-mono">${selectedProveedor.SALDOMAX.toLocaleString("es-AR")}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold font-sans">Ubicación</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium font-sans">Dirección:</span>
                      <span className="ml-2 font-sans">{selectedProveedor.DIRECCION}</span>
                    </div>
                    <div>
                      <span className="font-medium font-sans">Municipio:</span>
                      <span className="ml-2 font-sans">{selectedProveedor.MUNICIPIO}</span>
                    </div>
                    <div>
                      <span className="font-medium font-sans">Departamento:</span>
                      <span className="ml-2 font-sans">{selectedProveedor.DEPARTAMENTO}</span>
                    </div>
                    <div>
                      <span className="font-medium font-sans">Provincia:</span>
                      <span className="ml-2 font-sans">{selectedProveedor.PROVINCIA}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold font-sans">Contacto</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium font-sans">Teléfono:</span>
                      <span className="ml-2 font-mono">{selectedProveedor.TELEFONO}</span>
                    </div>
                    <div>
                      <span className="font-medium font-sans">Email:</span>
                      <span className="ml-2 font-mono">{selectedProveedor.EMAIL}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold font-sans">Producción</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium font-sans">Chacras:</span>
                      <span className="ml-2 font-mono">{selectedProveedor.CHACRAS}</span>
                    </div>
                    <div>
                      <span className="font-medium font-sans">Lotes:</span>
                      <span className="ml-2 font-mono">{selectedProveedor.LOTES}</span>
                    </div>
                    <div>
                      <span className="font-medium font-sans">Hoja Verde Total:</span>
                      <span className="ml-2 font-mono font-semibold text-primary">
                        {selectedProveedor.hojaVerdeTotal.toLocaleString("es-AR")} kg
                      </span>
                    </div>
                    <div>
                      <span className="font-medium font-sans">NINYM:</span>
                      <span className="ml-2 font-mono">{selectedProveedor.NINYM}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
