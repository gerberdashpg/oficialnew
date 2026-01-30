"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, MoreHorizontal, Edit, Trash2, FileText, Plus, Building2, Eye } from "lucide-react"
import { toast } from "sonner"

interface WeeklyReport {
  id: string
  client_id: string
  client_name: string
  client_slug: string
  report_date: string
  status: string
  summary: string
  actions_taken: string | null
  data_analysis: string | null
  decisions_made: string | null
  next_week_guidance: string | null
  created_at: string
}

interface Client {
  id: string
  name: string
}

interface WeeklyReportsTableProps {
  reports: WeeklyReport[]
  clients: Client[]
}

const statusConfig: Record<string, { label: string; color: string }> = {
  "em_validacao": { label: "Em validação", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  "estavel": { label: "Estável", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  "em_ajuste": { label: "Em ajuste", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  "atencao": { label: "Atenção", color: "bg-red-500/20 text-red-400 border-red-500/30" },
}

export function WeeklyReportsTable({ reports: initialReports, clients }: WeeklyReportsTableProps) {
  const [reports, setReports] = useState(initialReports)
  const [search, setSearch] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editReport, setEditReport] = useState<WeeklyReport | null>(null)
  const [viewReport, setViewReport] = useState<WeeklyReport | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [newReport, setNewReport] = useState({
    client_id: "",
    report_date: new Date().toISOString().split("T")[0],
    status: "estavel",
    summary: "",
    actions_taken: "",
    data_analysis: "",
    decisions_made: "",
    next_week_guidance: "",
  })
  const [editForm, setEditForm] = useState({
    report_date: "",
    status: "",
    summary: "",
    actions_taken: "",
    data_analysis: "",
    decisions_made: "",
    next_week_guidance: "",
  })

  const filteredReports = reports.filter(
    (report) =>
      report.client_name.toLowerCase().includes(search.toLowerCase()) ||
      report.summary.toLowerCase().includes(search.toLowerCase()) ||
      report.status.toLowerCase().includes(search.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    })
  }

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/weekly-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReport),
      })

      if (res.ok) {
        const data = await res.json()
        const client = clients.find((c) => c.id === newReport.client_id)
        setReports([{ ...data.report, client_name: client?.name || "", client_slug: "" }, ...reports])
        setIsDialogOpen(false)
        setNewReport({
          client_id: "",
          report_date: new Date().toISOString().split("T")[0],
          status: "estavel",
          summary: "",
          actions_taken: "",
          data_analysis: "",
          decisions_made: "",
          next_week_guidance: "",
        })
        toast.success("Relatório enviado")
      } else {
        toast.error("Erro ao criar relatório")
      }
    } catch (error) {
      console.error("Error creating report:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (report: WeeklyReport) => {
    setEditReport(report)
    setEditForm({
      report_date: report.report_date.split("T")[0],
      status: report.status,
      summary: report.summary,
      actions_taken: report.actions_taken || "",
      data_analysis: report.data_analysis || "",
      decisions_made: report.decisions_made || "",
      next_week_guidance: report.next_week_guidance || "",
    })
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editReport) return
    setIsLoading(true)

    try {
      const res = await fetch(`/api/admin/weekly-reports/${editReport.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })

      if (res.ok) {
        const data = await res.json()
        setReports(reports.map((r) => (r.id === editReport.id ? { ...r, ...data.report } : r)))
        setEditReport(null)
      }
    } catch (error) {
      console.error("Error updating report:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsLoading(true)

    try {
      const res = await fetch(`/api/admin/weekly-reports/${deleteId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setReports(reports.filter((r) => r.id !== deleteId))
      }
    } catch (error) {
      console.error("Error deleting report:", error)
    } finally {
      setIsLoading(false)
      setDeleteId(null)
    }
  }

  return (
    <div>
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Buscar relatórios..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-purple-500"
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Novo Relatório
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">Novo Relatório Semanal</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Crie um relatório de leitura semanal para um cliente
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateReport} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Cliente</Label>
                  <Select
                    value={newReport.client_id}
                    onValueChange={(value) => setNewReport({ ...newReport, client_id: value })}
                  >
                    <SelectTrigger className="bg-zinc-900/50 border-zinc-700 text-white">
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800">
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id} className="text-zinc-300 focus:text-white focus:bg-zinc-800">
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Data do Relatório</Label>
                  <Input
                    type="date"
                    value={newReport.report_date}
                    onChange={(e) => setNewReport({ ...newReport, report_date: e.target.value })}
                    required
                    className="bg-zinc-900/50 border-zinc-700 text-white focus:border-purple-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Resumo da Semana</Label>
                <Textarea
                  value={newReport.summary}
                  onChange={(e) => setNewReport({ ...newReport, summary: e.target.value })}
                  placeholder="Texto curto explicando o foco e o porquê das decisões..."
                  rows={3}
                  required
                  className="bg-zinc-900/50 border-zinc-700 text-white resize-none focus:border-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">O que foi feito</Label>
                <Textarea
                  value={newReport.actions_taken}
                  onChange={(e) => setNewReport({ ...newReport, actions_taken: e.target.value })}
                  placeholder="Lista objetiva: ajustes, testes, manutenção..."
                  rows={3}
                  className="bg-zinc-900/50 border-zinc-700 text-white resize-none focus:border-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Leitura dos Dados</Label>
                <Textarea
                  value={newReport.data_analysis}
                  onChange={(e) => setNewReport({ ...newReport, data_analysis: e.target.value })}
                  placeholder="Números da semana com contexto..."
                  rows={3}
                  className="bg-zinc-900/50 border-zinc-700 text-white resize-none focus:border-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Decisões Tomadas</Label>
                <Textarea
                  value={newReport.decisions_made}
                  onChange={(e) => setNewReport({ ...newReport, decisions_made: e.target.value })}
                  placeholder="O que foi mantido, evitado ou adiado..."
                  rows={3}
                  className="bg-zinc-900/50 border-zinc-700 text-white resize-none focus:border-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Orientação para Próxima Semana</Label>
                <Textarea
                  value={newReport.next_week_guidance}
                  onChange={(e) => setNewReport({ ...newReport, next_week_guidance: e.target.value })}
                  placeholder="Próximos passos e expectativas..."
                  rows={3}
                  className="bg-zinc-900/50 border-zinc-700 text-white resize-none focus:border-purple-500"
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                {isLoading ? "Criando..." : "Criar Relatório"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
            <TableHead className="text-zinc-400">Data</TableHead>
            <TableHead className="text-zinc-400">Cliente</TableHead>
            <TableHead className="text-zinc-400">Resumo</TableHead>
            <TableHead className="text-zinc-400 text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <TableRow key={report.id} className="border-zinc-800 hover:bg-zinc-900/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-purple-400" />
                    </div>
                    <p className="font-medium text-white">{formatDate(report.report_date)}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Link href={`/admin/clientes/${report.client_id}`}>
                    <div className="flex items-center gap-2 text-zinc-300 hover:text-white">
                      <Building2 className="w-4 h-4 text-zinc-500" />
                      {report.client_name}
                    </div>
                  </Link>
                </TableCell>
                <TableCell className="max-w-xs">
                  <p className="text-zinc-300 truncate">{report.summary}</p>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                      <DropdownMenuItem 
                        className="text-zinc-300 focus:text-white focus:bg-zinc-800 cursor-pointer"
                        onClick={() => setViewReport(report)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-zinc-300 focus:text-white focus:bg-zinc-800 cursor-pointer"
                        onClick={() => handleEdit(report)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-400 focus:text-red-400 focus:bg-red-950 cursor-pointer"
                        onClick={() => setDeleteId(report.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-32 text-center">
                <div className="flex flex-col items-center gap-2 text-zinc-400">
                  <FileText className="w-8 h-8 opacity-50" />
                  <p>Nenhum relatório encontrado</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* View Report Dialog */}
      <Dialog open={!!viewReport} onOpenChange={() => setViewReport(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-3">
              <FileText className="w-5 h-5 text-purple-400" />
              Relatório Semanal - {viewReport && formatDate(viewReport.report_date)}
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              {viewReport?.client_name}
            </DialogDescription>
          </DialogHeader>
          {viewReport && (
            <div className="space-y-6 mt-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-purple-400">Resumo da Semana</h4>
                <p className="text-zinc-300 whitespace-pre-wrap">{viewReport.summary}</p>
              </div>
              
              {viewReport.actions_taken && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-purple-400">O que foi feito</h4>
                  <p className="text-zinc-300 whitespace-pre-wrap">{viewReport.actions_taken}</p>
                </div>
              )}
              
              {viewReport.data_analysis && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-purple-400">Leitura dos Dados</h4>
                  <p className="text-zinc-300 whitespace-pre-wrap">{viewReport.data_analysis}</p>
                </div>
              )}
              
              {viewReport.decisions_made && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-purple-400">Decisões Tomadas</h4>
                  <p className="text-zinc-300 whitespace-pre-wrap">{viewReport.decisions_made}</p>
                </div>
              )}
              
              {viewReport.next_week_guidance && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-purple-400">Orientação para Próxima Semana</h4>
                  <p className="text-zinc-300 whitespace-pre-wrap">{viewReport.next_week_guidance}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editReport} onOpenChange={() => setEditReport(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Editar Relatório</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Atualize o relatório semanal
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveEdit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Data do Relatório</Label>
              <Input
                type="date"
                value={editForm.report_date}
                onChange={(e) => setEditForm({ ...editForm, report_date: e.target.value })}
                required
                className="bg-zinc-900/50 border-zinc-700 text-white focus:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Resumo da Semana</Label>
              <Textarea
                value={editForm.summary}
                onChange={(e) => setEditForm({ ...editForm, summary: e.target.value })}
                rows={3}
                required
                className="bg-zinc-900/50 border-zinc-700 text-white resize-none focus:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">O que foi feito</Label>
              <Textarea
                value={editForm.actions_taken}
                onChange={(e) => setEditForm({ ...editForm, actions_taken: e.target.value })}
                rows={3}
                className="bg-zinc-900/50 border-zinc-700 text-white resize-none focus:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Leitura dos Dados</Label>
              <Textarea
                value={editForm.data_analysis}
                onChange={(e) => setEditForm({ ...editForm, data_analysis: e.target.value })}
                rows={3}
                className="bg-zinc-900/50 border-zinc-700 text-white resize-none focus:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Decisões Tomadas</Label>
              <Textarea
                value={editForm.decisions_made}
                onChange={(e) => setEditForm({ ...editForm, decisions_made: e.target.value })}
                rows={3}
                className="bg-zinc-900/50 border-zinc-700 text-white resize-none focus:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Orientação para Próxima Semana</Label>
              <Textarea
                value={editForm.next_week_guidance}
                onChange={(e) => setEditForm({ ...editForm, next_week_guidance: e.target.value })}
                rows={3}
                className="bg-zinc-900/50 border-zinc-700 text-white resize-none focus:border-purple-500"
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Excluir Relatório</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Tem certeza que deseja excluir este relatório? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
