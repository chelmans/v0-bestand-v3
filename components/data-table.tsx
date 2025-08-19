"use client"

import * as React from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, ChevronLeft, ChevronRight, Search, Filter } from "lucide-react"
import { cn } from "@/lib/utils"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
  className?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Buscar...",
  className,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  const exportToCSV = () => {
    const headers = columns.map((col) => col.id || "").join(",")
    const rows = table.getFilteredRowModel().rows.map((row) =>
      row
        .getVisibleCells()
        .map((cell) => cell.getValue())
        .join(","),
    )
    const csv = [headers, ...rows].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "export.csv"
    a.click()
    window.URL.revokeObjectURL(url)

    const announcement = `Exportando ${table.getFilteredRowModel().rows.length} registros a CSV`
    const announcer = document.createElement("div")
    announcer.setAttribute("aria-live", "polite")
    announcer.setAttribute("aria-atomic", "true")
    announcer.className = "sr-only"
    announcer.textContent = announcement
    document.body.appendChild(announcer)
    setTimeout(() => document.body.removeChild(announcer), 1000)
  }

  return (
    <div
      className={cn("space-y-4 sm:space-y-6 animate-fade-in dark-mode-transition", className)}
      role="region"
      aria-label="Tabla de datos con filtros y paginación"
    >
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0 p-3 sm:p-4 bg-gradient-to-r from-card to-muted/20 dark:from-card/50 dark:to-muted/10 rounded-xl border border-border/50 dark:border-border/30">
        <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
          {searchKey && (
            <div className="relative flex-1 sm:flex-none">
              <Search
                className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                placeholder={searchPlaceholder}
                value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                onChange={(event) => table.getColumn(searchKey)?.setFilterValue(event.target.value)}
                className="pl-8 sm:pl-10 w-full sm:max-w-sm text-sm bg-background/50 dark:bg-background/30 backdrop-blur-sm border-border/50 dark:border-border/30 focus:border-primary/50 dark:focus:border-primary/40 transition-all duration-200"
                aria-label={`Buscar en ${searchKey}`}
              />
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto justify-end">
          {/* Enhanced Column Visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="bg-background/50 dark:bg-background/30 backdrop-blur-sm hover:bg-primary/10 dark:hover:bg-primary/20 transition-all duration-200 text-xs sm:text-sm px-2 sm:px-3 btn-dark-outline"
                aria-label="Mostrar u ocultar columnas"
              >
                <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" aria-hidden="true" />
                <span className="hidden sm:inline">Columnas</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-effect backdrop-blur-xl dark:bg-popover/90">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors duration-200 text-sm dark-text"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Enhanced Export Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={exportToCSV}
            className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 hover:shadow-lg dark:hover:shadow-xl hover:scale-105 transition-all duration-200 text-xs sm:text-sm px-2 sm:px-3 btn-dark-primary"
            aria-label={`Exportar ${table.getFilteredRowModel().rows.length} registros a CSV`}
          >
            <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" aria-hidden="true" />
            <span className="hidden sm:inline">Exportar</span>
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border/50 dark:border-border/30 overflow-hidden shadow-lg dark:shadow-2xl bg-gradient-to-br from-card to-muted/10 dark:from-card/50 dark:to-muted/5 table-dark-mode">
        <div className="overflow-x-auto" role="table" aria-label="Datos de la tabla">
          <Table className="min-w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="bg-gradient-to-r from-muted/50 to-muted/20 dark:from-muted/30 dark:to-muted/10 hover:from-muted/70 hover:to-muted/30 dark:hover:from-muted/40 dark:hover:to-muted/20 transition-all duration-200"
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="font-semibold text-foreground border-border/30 dark:border-border/20 text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap dark-text"
                        scope="col"
                      >
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(
                      "hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 dark:hover:from-primary/10 dark:hover:to-accent/10 transition-all duration-200 border-border/30 dark:border-border/20",
                      index % 2 === 0 && "bg-background/50 dark:bg-background/20",
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="border-border/20 dark:border-border/10 text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 dark-text"
                      >
                        <div className="truncate max-w-[150px] sm:max-w-none" title={String(cell.getValue())}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 sm:h-32 text-center dark-text">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-muted/50 dark:bg-muted/30 flex items-center justify-center">
                        <Search className="h-4 w-4 sm:h-6 sm:w-6 text-muted-foreground" aria-hidden="true" />
                      </div>
                      <p className="text-muted-foreground font-medium text-sm sm:text-base">No hay datos disponibles</p>
                      <p className="text-xs sm:text-sm text-muted-foreground/70">
                        Intenta ajustar los filtros de búsqueda
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div
        className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 p-3 sm:p-4 bg-gradient-to-r from-card to-muted/20 dark:from-card/50 dark:to-muted/10 rounded-xl border border-border/50 dark:border-border/30"
        role="navigation"
        aria-label="Paginación de tabla"
      >
        <div className="text-xs sm:text-sm text-muted-foreground font-medium order-2 sm:order-1" aria-live="polite">
          <span className="text-foreground font-semibold">{table.getFilteredRowModel().rows.length}</span> registro(s)
          total
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2 order-1 sm:order-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="bg-background/50 dark:bg-background/30 backdrop-blur-sm hover:bg-primary/10 dark:hover:bg-primary/20 disabled:opacity-50 transition-all duration-200 text-xs sm:text-sm px-2 sm:px-3 btn-dark-outline"
            aria-label="Página anterior"
          >
            <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-0 sm:mr-1" aria-hidden="true" />
            <span className="hidden sm:inline">Anterior</span>
          </Button>
          <div
            className="flex items-center space-x-1 px-2 sm:px-3 py-1 bg-muted/30 dark:bg-muted/20 rounded-lg"
            aria-live="polite"
          >
            <span className="text-xs sm:text-sm font-medium text-foreground whitespace-nowrap">
              {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="bg-background/50 dark:bg-background/30 backdrop-blur-sm hover:bg-primary/10 dark:hover:bg-primary/20 disabled:opacity-50 transition-all duration-200 text-xs sm:text-sm px-2 sm:px-3 btn-dark-outline"
            aria-label="Página siguiente"
          >
            <span className="hidden sm:inline">Siguiente</span>
            <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-0 sm:ml-1" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  )
}
