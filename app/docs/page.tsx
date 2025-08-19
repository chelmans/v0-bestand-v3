"use client"

import { ChartContainer } from "@/components/chart-container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  BookOpen,
  Download,
  ExternalLink,
  Search,
  FileText,
  Video,
  MessageCircle,
  Mail,
  Phone,
  Globe,
  Code,
  BarChart3,
  Settings,
  HelpCircle,
  Package,
  Layers,
  Warehouse,
  Scale,
} from "lucide-react"

export default function DocsPage() {
  const quickLinks = [
    { title: "Guía de Inicio Rápido", icon: BookOpen, description: "Primeros pasos con Sistema Bestand" },
    { title: "Manual de Usuario", icon: FileText, description: "Guía completa de funcionalidades" },
    { title: "Videos Tutoriales", icon: Video, description: "Aprende con videos paso a paso" },
    { title: "API Documentation", icon: Code, description: "Documentación técnica para desarrolladores" },
  ]

  const features = [
    {
      title: "Dashboard Principal",
      icon: BarChart3,
      description: "Visualización general de producción y stock",
      status: "Disponible",
    },
    {
      title: "Producción BigBags",
      icon: Package,
      description: "Análisis detallado de producción de BigBags",
      status: "Disponible",
    },
    {
      title: "Gestión de Lotes",
      icon: Layers,
      description: "Control y seguimiento de lotes de producción",
      status: "Disponible",
    },
    {
      title: "Control de Stock",
      icon: Warehouse,
      description: "Monitoreo de inventario por depósito",
      status: "Disponible",
    },
    {
      title: "Control de Báscula",
      icon: Scale,
      description: "Monitoreo de ingresos por báscula",
      status: "Disponible",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-sans text-foreground">Documentación</h1>
        <p className="text-muted-foreground font-sans">Guías, tutoriales y recursos para Sistema Bestand</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar en la documentación..." className="pl-10" />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="guides">Guías</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="support">Soporte</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-6">
          {/* Quick Links */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map((link, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <link.icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-sm font-sans">{link.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-xs font-sans">{link.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* System Overview */}
          <div className="grid gap-6 md:grid-cols-2">
            <ChartContainer title="Acerca de Sistema Bestand" subtitle="Información general del sistema">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground font-sans">
                  Sistema Bestand es una plataforma integral para la gestión y visualización de datos de producción y
                  stock en plantas industriales. Desarrollado específicamente para Hedman Ingeniería.
                </p>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold font-sans">Características Principales:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 font-sans">
                    <li>• Dashboard en tiempo real</li>
                    <li>• Análisis de producción BigBags</li>
                    <li>• Gestión completa de lotes</li>
                    <li>• Control de stock por depósito</li>
                    <li>• Monitoreo de báscula</li>
                    <li>• Reportes y exportación de datos</li>
                  </ul>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Badge variant="outline" className="font-mono">
                    Versión 2.1.0
                  </Badge>
                  <Badge variant="secondary">Producción</Badge>
                </div>
              </div>
            </ChartContainer>

            <ChartContainer title="Funcionalidades" subtitle="Estado de las características">
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <feature.icon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium font-sans">{feature.title}</div>
                        <div className="text-xs text-muted-foreground font-sans">{feature.description}</div>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-green-600">
                      {feature.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </ChartContainer>
          </div>
        </TabsContent>

        {/* Guides */}
        <TabsContent value="guides" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <ChartContainer title="Guías de Usuario" subtitle="Aprende a usar el sistema">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                      <div>
                        <div className="text-sm font-medium font-sans">Introducción al Sistema</div>
                        <div className="text-xs text-muted-foreground font-sans">Conceptos básicos y navegación</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="font-sans bg-transparent">
                      Ver
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="h-4 w-4 text-green-600" />
                      <div>
                        <div className="text-sm font-medium font-sans">Usando el Dashboard</div>
                        <div className="text-xs text-muted-foreground font-sans">
                          Interpretación de métricas y gráficos
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="font-sans bg-transparent">
                      Ver
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Settings className="h-4 w-4 text-orange-600" />
                      <div>
                        <div className="text-sm font-medium font-sans">Configuración</div>
                        <div className="text-xs text-muted-foreground font-sans">
                          Personalizar preferencias del sistema
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="font-sans bg-transparent">
                      Ver
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Download className="h-4 w-4 text-purple-600" />
                      <div>
                        <div className="text-sm font-medium font-sans">Exportación de Datos</div>
                        <div className="text-xs text-muted-foreground font-sans">
                          Generar reportes y exportar información
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="font-sans bg-transparent">
                      Ver
                    </Button>
                  </div>
                </div>
              </div>
            </ChartContainer>

            <ChartContainer title="Recursos Adicionales" subtitle="Materiales de apoyo">
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start bg-transparent font-sans">
                  <Video className="h-4 w-4 mr-2" />
                  Videos Tutoriales
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </Button>

                <Button variant="outline" className="w-full justify-start bg-transparent font-sans">
                  <Download className="h-4 w-4 mr-2" />
                  Manual PDF Completo
                </Button>

                <Button variant="outline" className="w-full justify-start bg-transparent font-sans">
                  <FileText className="h-4 w-4 mr-2" />
                  Guía de Referencia Rápida
                </Button>

                <Button variant="outline" className="w-full justify-start bg-transparent font-sans">
                  <Globe className="h-4 w-4 mr-2" />
                  Portal de Capacitación
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </Button>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold font-sans">Actualizaciones Recientes</h4>
                  <div className="text-xs text-muted-foreground space-y-1 font-sans">
                    <div>
                      • <span className="font-mono">v2.1.0</span> - Mejoras en reportes (15/01/2025)
                    </div>
                    <div>
                      • <span className="font-mono">v2.0.5</span> - Correcciones de bugs (08/01/2025)
                    </div>
                    <div>
                      • <span className="font-mono">v2.0.0</span> - Nueva interfaz (01/01/2025)
                    </div>
                  </div>
                </div>
              </div>
            </ChartContainer>
          </div>
        </TabsContent>

        {/* API Documentation */}
        <TabsContent value="api" className="space-y-6">
          <ChartContainer title="Documentación de API" subtitle="Referencia técnica para desarrolladores">
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="text-sm font-semibold mb-2 font-sans">Endpoints Principales</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      GET
                    </Badge>
                    <code className="font-mono">/api/produccion</code>
                    <span className="text-muted-foreground font-sans">- Datos de producción</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      GET
                    </Badge>
                    <code className="font-mono">/api/stock</code>
                    <span className="text-muted-foreground font-sans">- Información de stock</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      GET
                    </Badge>
                    <code className="font-mono">/api/lotes</code>
                    <span className="text-muted-foreground font-sans">- Gestión de lotes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      POST
                    </Badge>
                    <code className="font-mono">/api/export</code>
                    <span className="text-muted-foreground font-sans">- Exportar datos</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Button variant="outline" className="justify-start bg-transparent font-sans">
                  <Code className="h-4 w-4 mr-2" />
                  Documentación Completa de API
                </Button>
                <Button variant="outline" className="justify-start bg-transparent font-sans">
                  <Download className="h-4 w-4 mr-2" />
                  Colección Postman
                </Button>
              </div>
            </div>
          </ChartContainer>
        </TabsContent>

        {/* FAQ */}
        <TabsContent value="faq" className="space-y-6">
          <ChartContainer title="Preguntas Frecuentes" subtitle="Respuestas a consultas comunes">
            <div className="space-y-4">
              {[
                {
                  question: "¿Cómo exporto los datos de producción?",
                  answer: "Ve a Configuración > Datos > Exportar Datos, selecciona el tipo de datos y formato deseado.",
                },
                {
                  question: "¿Puedo cambiar el tema visual del sistema?",
                  answer: "Sí, usa el botón de tema en la barra superior para alternar entre modo claro y oscuro.",
                },
                {
                  question: "¿Cómo configuro las alertas de stock bajo?",
                  answer:
                    "En Configuración > Notificaciones, activa las 'Alertas de Stock Bajo' y configura los umbrales.",
                },
                {
                  question: "¿Los datos se actualizan en tiempo real?",
                  answer: "Sí, el dashboard se actualiza automáticamente cada 30 segundos con los datos más recientes.",
                },
                {
                  question: "¿Puedo filtrar los datos por planta?",
                  answer:
                    "Sí, usa el filtro de planta en la barra superior para ver datos específicos de Guaraní, Panambi o las plantas tercerizadas.",
                },
              ].map((faq, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2 font-sans">
                    <HelpCircle className="h-4 w-4 text-blue-600" />
                    {faq.question}
                  </h4>
                  <p className="text-sm text-muted-foreground font-sans">{faq.answer}</p>
                </div>
              ))}
            </div>
          </ChartContainer>
        </TabsContent>

        {/* Support */}
        <TabsContent value="support" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <ChartContainer title="Contacto de Soporte" subtitle="Obtén ayuda cuando la necesites">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium font-sans">Email</div>
                    <div className="text-sm text-muted-foreground font-mono">soporte@hedman.com.ar</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Phone className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="text-sm font-medium font-sans">Teléfono</div>
                    <div className="text-sm text-muted-foreground font-mono">+54 9 3755 430294</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <MessageCircle className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="text-sm font-medium font-sans">Chat en Vivo</div>
                    <div className="text-sm text-muted-foreground font-sans">Lun-Vie 9:00-18:00</div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold font-sans">Horarios de Atención</h4>
                  <div className="text-sm text-muted-foreground font-sans">
                    <div>
                      Lunes a Viernes: <span className="font-mono">9:00 - 18:00</span>
                    </div>
                    <div>
                      Sábados: <span className="font-mono">9:00 - 13:00</span>
                    </div>
                    <div>Domingos: Cerrado</div>
                  </div>
                </div>
              </div>
            </ChartContainer>

            <ChartContainer title="Información de la Empresa" subtitle="Hedman Ingeniería">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold font-sans">Acerca de Hedman Ingeniería</h4>
                  <p className="text-sm text-muted-foreground font-sans">
                    Empresa líder en soluciones industriales y sistemas de gestión para la industria yerbatera. Con más
                    de 20 años de experiencia en el sector.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold font-sans">Ubicación</h4>
                  <div className="text-sm text-muted-foreground font-sans">
                    <div>Misiones, Argentina</div>
                    <div>Plantas: Guaraní, Panambi, Tercerizada 2, Tercerizada 3</div>
                  </div>
                </div>

                <Button variant="outline" className="w-full bg-transparent font-sans">
                  <Globe className="h-4 w-4 mr-2" />
                  Visitar Sitio Web
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </Button>

                <div className="pt-2 text-center">
                  <div className="text-xs text-muted-foreground font-sans">
                    Sistema Bestand <span className="font-mono">v2.1.0</span>
                  </div>
                  <div className="text-xs text-muted-foreground font-sans">© 2025 Hedman Ingeniería</div>
                </div>
              </div>
            </ChartContainer>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
