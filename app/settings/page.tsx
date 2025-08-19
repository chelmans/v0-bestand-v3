"use client"

import { useState } from "react"
import { ChartContainer } from "@/components/chart-container"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Settings, Database, Download, Upload, Shield, Clock, Edit, Trash2, Plus } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"

interface User {
  id: string
  name: string
  email: string
  role: string
  status: string
  lastLogin: string
  createdAt: string
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    stockAlerts: true,
    productionUpdates: false,
    systemMaintenance: true,
    weeklyReports: true,
  })

  const [systemConfig, setSystemConfig] = useState({
    defaultStore: "GUARANI",
    timezone: "America/Argentina/Cordoba",
    language: "es-AR",
    dateFormat: "DD/MM/YYYY",
    numberFormat: "es-AR",
  })

  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Juan Pérez",
      email: "juan@hedman.com.ar",
      role: "Administrador",
      status: "Activo",
      lastLogin: "2025-01-19 14:30",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "María García",
      email: "maria@hedman.com.ar",
      role: "Operador",
      status: "Activo",
      lastLogin: "2025-01-19 09:15",
      createdAt: "2024-03-22",
    },
    {
      id: "3",
      name: "Carlos López",
      email: "carlos@hedman.com.ar",
      role: "Supervisor",
      status: "Inactivo",
      lastLogin: "2025-01-17 16:45",
      createdAt: "2024-02-10",
    },
    {
      id: "4",
      name: "Ana Rodríguez",
      email: "ana@hedman.com.ar",
      role: "Operador",
      status: "Activo",
      lastLogin: "2025-01-19 11:20",
      createdAt: "2024-05-08",
    },
    {
      id: "5",
      name: "Roberto Silva",
      email: "roberto@hedman.com.ar",
      role: "Supervisor",
      status: "Activo",
      lastLogin: "2025-01-18 17:30",
      createdAt: "2024-04-12",
    },
  ])

  const [isEditingName, setIsEditingName] = useState<{ [key: string]: boolean }>({})
  const [nameValues, setNameValues] = useState<{ [key: string]: string }>({})
  const [isEditingEmail, setIsEditingEmail] = useState<{ [key: string]: boolean }>({})
  const [emailValues, setEmailValues] = useState<{ [key: string]: string }>({})
  const [isEditingRole, setIsEditingRole] = useState<{ [key: string]: boolean }>({})
  const [roleValues, setRoleValues] = useState<{ [key: string]: string }>({})
  const [isEditingStatus, setIsEditingStatus] = useState<{ [key: string]: boolean }>({})
  const [statusValues, setStatusValues] = useState<{ [key: string]: string }>({})

  const userColumns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row, getValue }) => {
        const handleSave = () => {
          setUsers((prev) =>
            prev.map((user) => (user.id === row.original.id ? { ...user, name: nameValues[row.original.id] } : user)),
          )
          setIsEditingName((prev) => ({ ...prev, [row.original.id]: false }))
        }

        return isEditingName[row.original.id] ? (
          <div className="flex items-center gap-2">
            <Input
              value={nameValues[row.original.id] || getValue()}
              onChange={(e) => setNameValues((prev) => ({ ...prev, [row.original.id]: e.target.value }))}
              className="h-8 text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave()
                if (e.key === "Escape") {
                  setNameValues((prev) => ({ ...prev, [row.original.id]: getValue() as string }))
                  setIsEditingName((prev) => ({ ...prev, [row.original.id]: false }))
                }
              }}
            />
            <Button size="sm" onClick={handleSave} className="h-6 px-2 text-xs">
              ✓
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between group">
            <span className="font-sans text-sm font-medium">{getValue()}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditingName((prev) => ({ ...prev, [row.original.id]: true }))}
              className="h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit className="h-3 w-3" />
            </Button>
          </div>
        )
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row, getValue }) => {
        const handleSave = () => {
          setUsers((prev) =>
            prev.map((user) => (user.id === row.original.id ? { ...user, email: emailValues[row.original.id] } : user)),
          )
          setIsEditingEmail((prev) => ({ ...prev, [row.original.id]: false }))
        }

        return isEditingEmail[row.original.id] ? (
          <div className="flex items-center gap-2">
            <Input
              value={emailValues[row.original.id] || getValue()}
              onChange={(e) => setEmailValues((prev) => ({ ...prev, [row.original.id]: e.target.value }))}
              className="h-8 text-sm"
              type="email"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave()
                if (e.key === "Escape") {
                  setEmailValues((prev) => ({ ...prev, [row.original.id]: getValue() as string }))
                  setIsEditingEmail((prev) => ({ ...prev, [row.original.id]: false }))
                }
              }}
            />
            <Button size="sm" onClick={handleSave} className="h-6 px-2 text-xs">
              ✓
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between group">
            <span className="font-mono text-sm">{getValue()}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditingEmail((prev) => ({ ...prev, [row.original.id]: true }))}
              className="h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit className="h-3 w-3" />
            </Button>
          </div>
        )
      },
    },
    {
      accessorKey: "role",
      header: "Rol",
      cell: ({ row, getValue }) => {
        const handleSave = () => {
          setUsers((prev) =>
            prev.map((user) => (user.id === row.original.id ? { ...user, role: roleValues[row.original.id] } : user)),
          )
          setIsEditingRole((prev) => ({ ...prev, [row.original.id]: false }))
        }

        return isEditingRole[row.original.id] ? (
          <div className="flex items-center gap-2">
            <Select
              value={roleValues[row.original.id] || getValue()}
              onValueChange={(value) => setRoleValues((prev) => ({ ...prev, [row.original.id]: value }))}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Administrador">Administrador</SelectItem>
                <SelectItem value="Supervisor">Supervisor</SelectItem>
                <SelectItem value="Operador">Operador</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" onClick={handleSave} className="h-6 px-2 text-xs">
              ✓
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between group">
            <Badge variant={getValue() === "Administrador" ? "default" : "secondary"} className="font-sans">
              {getValue()}
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditingRole((prev) => ({ ...prev, [row.original.id]: true }))}
              className="h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit className="h-3 w-3" />
            </Button>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row, getValue }) => {
        const handleSave = () => {
          setUsers((prev) =>
            prev.map((user) =>
              user.id === row.original.id ? { ...user, status: statusValues[row.original.id] } : user,
            ),
          )
          setIsEditingStatus((prev) => ({ ...prev, [row.original.id]: false }))
        }

        return isEditingStatus[row.original.id] ? (
          <div className="flex items-center gap-2">
            <Select
              value={statusValues[row.original.id] || getValue()}
              onValueChange={(value) => setStatusValues((prev) => ({ ...prev, [row.original.id]: value }))}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Activo">Activo</SelectItem>
                <SelectItem value="Inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" onClick={handleSave} className="h-6 px-2 text-xs">
              ✓
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between group">
            <Badge variant={getValue() === "Activo" ? "default" : "outline"} className="font-sans">
              {getValue()}
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditingStatus((prev) => ({ ...prev, [row.original.id]: true }))}
              className="h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit className="h-3 w-3" />
            </Button>
          </div>
        )
      },
    },
    {
      accessorKey: "lastLogin",
      header: "Último Acceso",
      cell: ({ row }) => <span className="font-mono text-sm">{row.getValue("lastLogin")}</span>,
    },
    {
      accessorKey: "createdAt",
      header: "Fecha Alta",
      cell: ({ row }) => <span className="font-mono text-sm">{row.getValue("createdAt")}</span>,
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setUsers((prev) => prev.filter((user) => user.id !== row.original.id))
          }}
          className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-sans text-foreground">Configuración del Sistema</h1>
        <p className="text-muted-foreground font-sans">
          Administra las configuraciones y preferencias del Sistema Bestand
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="data">Datos</TabsTrigger>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <ChartContainer title="Configuración General" subtitle="Preferencias básicas del sistema">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultStore" className="font-sans">
                    Planta por Defecto
                  </Label>
                  <Select
                    value={systemConfig.defaultStore}
                    onValueChange={(value) => setSystemConfig((prev) => ({ ...prev, defaultStore: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GUARANI">Guaraní (Principal)</SelectItem>
                      <SelectItem value="PANAMBI">Panambi (Secundaria)</SelectItem>
                      <SelectItem value="TERCERIZADA 2">Tercerizada 2</SelectItem>
                      <SelectItem value="TERCERIZADA 3">Tercerizada 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone" className="font-sans">
                    Zona Horaria
                  </Label>
                  <Select
                    value={systemConfig.timezone}
                    onValueChange={(value) => setSystemConfig((prev) => ({ ...prev, timezone: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Argentina/Cordoba">Argentina/Córdoba</SelectItem>
                      <SelectItem value="America/Argentina/Buenos_Aires">Argentina/Buenos Aires</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language" className="font-sans">
                    Idioma
                  </Label>
                  <Select
                    value={systemConfig.language}
                    onValueChange={(value) => setSystemConfig((prev) => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es-AR">Español (Argentina)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateFormat" className="font-sans">
                    Formato de Fecha
                  </Label>
                  <Select
                    value={systemConfig.dateFormat}
                    onValueChange={(value) => setSystemConfig((prev) => ({ ...prev, dateFormat: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </ChartContainer>

            <ChartContainer title="Información del Sistema" subtitle="Estado actual del sistema">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium font-sans">Versión</span>
                  <Badge variant="outline" className="font-mono">
                    v2.1.0
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium font-sans">Última Actualización</span>
                  <span className="text-sm text-muted-foreground font-mono">15/01/2025</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium font-sans">Base de Datos</span>
                  <Badge variant="default" className="bg-green-600">
                    Conectada
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium font-sans">Modo</span>
                  <Badge variant="secondary">Producción</Badge>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold font-sans">Estadísticas de Uso</h4>
                  <div className="text-sm text-muted-foreground font-sans">
                    <div>
                      Usuarios activos:{" "}
                      <span className="font-mono">{users.filter((u) => u.status === "Activo").length}</span>
                    </div>
                    <div>
                      Registros procesados hoy: <span className="font-mono">1,247</span>
                    </div>
                    <div>
                      Tiempo de actividad: <span className="font-mono">99.8%</span>
                    </div>
                  </div>
                </div>
              </div>
            </ChartContainer>
          </div>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <ChartContainer
            title="Configuración de Notificaciones"
            subtitle="Administra las alertas y notificaciones del sistema"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-sans">Alertas de Stock Bajo</Label>
                  <p className="text-sm text-muted-foreground font-sans">
                    Recibir notificaciones cuando el stock esté por debajo del mínimo
                  </p>
                </div>
                <Switch
                  checked={notifications.stockAlerts}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, stockAlerts: checked }))}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-sans">Actualizaciones de Producción</Label>
                  <p className="text-sm text-muted-foreground font-sans">
                    Notificaciones en tiempo real sobre cambios en producción
                  </p>
                </div>
                <Switch
                  checked={notifications.productionUpdates}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, productionUpdates: checked }))}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-sans">Mantenimiento del Sistema</Label>
                  <p className="text-sm text-muted-foreground font-sans">
                    Alertas sobre mantenimiento programado y actualizaciones
                  </p>
                </div>
                <Switch
                  checked={notifications.systemMaintenance}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, systemMaintenance: checked }))}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-sans">Reportes Semanales</Label>
                  <p className="text-sm text-muted-foreground font-sans">
                    Resumen semanal de producción y stock por email
                  </p>
                </div>
                <Switch
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, weeklyReports: checked }))}
                />
              </div>

              <div className="pt-4">
                <Button className="font-sans">Guardar Configuración</Button>
              </div>
            </div>
          </ChartContainer>
        </TabsContent>

        {/* Data Management */}
        <TabsContent value="data" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <ChartContainer title="Exportar Datos" subtitle="Descargar datos del sistema">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-sans">Tipo de Datos</Label>
                  <Select defaultValue="production">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="production">Datos de Producción</SelectItem>
                      <SelectItem value="stock">Datos de Stock</SelectItem>
                      <SelectItem value="lotes">Datos de Lotes</SelectItem>
                      <SelectItem value="bascula">Datos de Báscula</SelectItem>
                      <SelectItem value="all">Todos los Datos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-sans">Formato</Label>
                  <Select defaultValue="csv">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-sans">Rango de Fechas</Label>
                  <Select defaultValue="month">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Última Semana</SelectItem>
                      <SelectItem value="month">Último Mes</SelectItem>
                      <SelectItem value="quarter">Último Trimestre</SelectItem>
                      <SelectItem value="year">Último Año</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full font-sans">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Datos
                </Button>
              </div>
            </ChartContainer>

            <ChartContainer title="Importar Datos" subtitle="Cargar datos al sistema">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-sans">Tipo de Importación</Label>
                  <Select defaultValue="production">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="production">Registros de Producción</SelectItem>
                      <SelectItem value="providers">Datos de Proveedores</SelectItem>
                      <SelectItem value="clients">Datos de Clientes</SelectItem>
                      <SelectItem value="config">Configuración</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file" className="font-sans">
                    Archivo
                  </Label>
                  <Input id="file" type="file" accept=".csv,.xlsx,.json" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="font-sans">
                    Notas
                  </Label>
                  <Textarea id="notes" placeholder="Descripción de la importación..." rows={3} />
                </div>

                <Button className="w-full bg-transparent font-sans" variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Importar Datos
                </Button>
              </div>
            </ChartContainer>
          </div>
        </TabsContent>

        {/* Users Management */}
        <TabsContent value="users" className="space-y-6">
          <ChartContainer title="Gestión de Usuarios" subtitle="Administrar usuarios del sistema">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold font-sans">Usuarios Activos</h3>
                <Button
                  size="sm"
                  className="font-sans"
                  onClick={() => {
                    const newUser: User = {
                      id: (users.length + 1).toString(),
                      name: "Nuevo Usuario",
                      email: "nuevo@hedman.com.ar",
                      role: "Operador",
                      status: "Activo",
                      lastLogin: "Nunca",
                      createdAt: new Date().toISOString().split("T")[0],
                    }
                    setUsers((prev) => [...prev, newUser])
                  }}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Agregar Usuario
                </Button>
              </div>

              <DataTable columns={userColumns} data={users} searchKey="name" searchPlaceholder="Buscar usuarios..." />
            </div>
          </ChartContainer>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <ChartContainer title="Configuración de Base de Datos" subtitle="Parámetros de conexión">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dbHost" className="font-sans">
                    Servidor
                  </Label>
                  <Input id="dbHost" value="localhost" readOnly className="font-mono" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dbName" className="font-sans">
                    Base de Datos
                  </Label>
                  <Input id="dbName" value="bestand_prod" readOnly className="font-mono" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dbStatus" className="font-sans">
                    Estado de Conexión
                  </Label>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-sans">Conectado</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full bg-transparent font-sans">
                  <Database className="h-4 w-4 mr-2" />
                  Probar Conexión
                </Button>
              </div>
            </ChartContainer>

            <ChartContainer title="Mantenimiento del Sistema" subtitle="Herramientas de administración">
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start bg-transparent font-sans">
                  <Clock className="h-4 w-4 mr-2" />
                  Limpiar Logs Antiguos
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent font-sans">
                  <Database className="h-4 w-4 mr-2" />
                  Optimizar Base de Datos
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent font-sans">
                  <Shield className="h-4 w-4 mr-2" />
                  Backup de Seguridad
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent font-sans">
                  <Settings className="h-4 w-4 mr-2" />
                  Reiniciar Servicios
                </Button>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-red-600 font-sans">Zona de Peligro</h4>
                  <Button variant="destructive" size="sm" className="w-full font-sans">
                    Restablecer Configuración
                  </Button>
                </div>
              </div>
            </ChartContainer>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
