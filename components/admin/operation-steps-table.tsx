"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { Plus, Pencil, Trash2, Search, CheckCircle2, Circle, Clock, Filter } from "lucide-react"

interface OperationStep {
  id: string
  client_id: string
  client_name: string
  client_slug: string
  client_plan: string
  order_index: number
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  due_date: string | null
  completed_at: string | null
  
}

interface Client {
  id: string
  name: string
  slug: string
  plan: string
}

interface OperationStepsTableProps {
  steps: OperationStep[]
  clients: Client[]
}

const statusConfig = {
  pending: { icon: Circle, color: "text-zinc-500", label: "Pendente" },
  in_progress: { icon: Clock, color: "text-amber-500", label: "Em Andamento" },
  completed: { icon: CheckCircle2, color: "text-emerald-500", label: "Concluído" },
}

export function OperationStepsTable({ steps: initialSteps, clients }: OperationStepsTableProps) {
  const router = useRouter()
  const [steps, setSteps] = useState(initialSteps)
  const [search, setSearch] = useState("")
  const [clientFilter, setClientFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editStep, setEditStep] = useState<OperationStep | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [createForm, setCreateForm] = useState({
    client_id: "",
    order_index: 1,
    title: "",
    description: "",
    status: "pending" as const,
    due_date: "",
  })

  const [editForm, setEditForm] = useState({
    order_index: 1,
    title: "",
    description: "",
    status: "pending" as 'pending' | 'in_progress' | 'completed',
    due_date: "",
  })

  const filteredSteps = steps.filter((step) => {
    const matchesSearch = 
      step.title.toLowerCase().includes(search.toLowerCase()) ||
      step.client_name.toLowerCase().includes(search.toLowerCase())
    const matchesClient = clientFilter === "all" || step.client_id === clientFilter
    const matchesStatus = statusFilter === "all" || step.status === statusFilter
    return matchesSearch && matchesClient && matchesStatus
  })

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("/api/admin/operation-steps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      })

      if (res.ok) {
        router.refresh()
        setIsCreateOpen(false)
        setCreateForm({
          client_id: "",
          order_index: 1,
          title: "",
          description: "",
          status: "pending",
          due_date: "",
        })
      }
    } catch (error) {
      console.error("Error creating step:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (step: OperationStep) => {
    setEditStep(step)
    setEditForm({
      order_index: step.order_index,
      title: step.title,
      description: step.description,
      status: step.status,
      due_date: step.due_date ? step.due_date.split('T')[0] : "",
    })
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editStep) return
    setIsLoading(true)

    try {
      const res = await fetch(`/api/admin/operation-steps/${editStep.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })

      if (res.ok) {
        router.refresh()
        setEditStep(null)
      }
    } catch (error) {
      console.error("Error updating step:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsLoading(true)

    try {
      const res = await fetch(`/api/admin/operation-steps/${deleteId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setSteps(steps.filter(s => s.id !== deleteId))
        setDeleteId(null)
      }
    } catch (error) {
      console.error("Error deleting step:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Buscar etapas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-purple-500"
          />
        </div>
        <Select value={clientFilter} onValueChange={setClientFilter}>
          <SelectTrigger className="w-full sm:w-48 bg-zinc-900/50 border-zinc-800 text-white">
            <Filter className="w-4 h-4 mr-2 text-zinc-500" />
            <SelectValue placeholder="Cliente" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            <SelectItem value="all" className="text-zinc-300">Todos os clientes</SelectItem>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id} className="text-zinc-300">
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40 bg-zinc-900/50 border-zinc-800 text-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            <SelectItem value="all" className="text-zinc-300">Todos</SelectItem>
            <SelectItem value="pending" className="text-zinc-300">Pendente</SelectItem>
            <SelectItem value="in_progress" className="text-zinc-300">Em Andamento</SelectItem>
            <SelectItem value="completed" className="text-zinc-300">Concluído</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => setIsCreateOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nova Etapa
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400">#</TableHead>
              <TableHead className="text-zinc-400">Cliente</TableHead>
              <TableHead className="text-zinc-400">Etapa</TableHead>
              <TableHead className="text-zinc-400">Status</TableHead>
              <TableHead className="text-zinc-400">Previsão</TableHead>
              <TableHead className="text-zinc-400 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSteps.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-zinc-500">
                  Nenhuma etapa encontrada
                </TableCell>
              </TableRow>
            ) : (
              filteredSteps.map((step) => {
                const config = statusConfig[step.status]
                const StatusIcon = config.icon
                return (
                  <TableRow key={step.id} className="border-zinc-800 hover:bg-zinc-900/50">
                    <TableCell className="text-zinc-400 font-mono">{step.order_index}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-white font-medium">{step.client_name}</p>
                        <p className="text-xs text-zinc-500">{step.client_plan}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-white">{step.title}</p>
                        <p className="text-xs text-zinc-500 truncate max-w-xs">{step.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${config.color} border-current bg-transparent`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {config.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-zinc-400">
                      {step.due_date ? new Date(step.due_date).toLocaleDateString('pt-BR') : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(step)} className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(step.id)} className="text-zinc-400 hover:text-red-500 hover:bg-red-500/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Nova Etapa</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Adicione uma nova etapa ao projeto de um cliente
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label className="text-zinc-300">Cliente</Label>
                <Select
                  value={createForm.client_id}
                  onValueChange={(value) => setCreateForm({ ...createForm, client_id: value })}
                >
                  <SelectTrigger className="bg-zinc-900/50 border-zinc-700 text-white">
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id} className="text-zinc-300">
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Número da Etapa</Label>
                <Input
                  type="number"
                  min="1"
                  value={createForm.order_index}
                  onChange={(e) => setCreateForm({ ...createForm, order_index: parseInt(e.target.value) })}
                  className="bg-zinc-900/50 border-zinc-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Status</Label>
                <Select
                  value={createForm.status}
                  onValueChange={(value: 'pending' | 'in_progress' | 'completed') => setCreateForm({ ...createForm, status: value })}
                >
                  <SelectTrigger className="bg-zinc-900/50 border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    <SelectItem value="pending" className="text-zinc-300">Pendente</SelectItem>
                    <SelectItem value="in_progress" className="text-zinc-300">Em Andamento</SelectItem>
                    <SelectItem value="completed" className="text-zinc-300">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Título</Label>
              <Input
                value={createForm.title}
                onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                required
                className="bg-zinc-900/50 border-zinc-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Descrição</Label>
              <Textarea
                value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                required
                className="bg-zinc-900/50 border-zinc-700 text-white resize-none"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Data de Previsão</Label>
              <Input
                type="date"
                value={createForm.due_date}
                onChange={(e) => setCreateForm({ ...createForm, due_date: e.target.value })}
                className="bg-zinc-900/50 border-zinc-700 text-white"
              />
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700 text-white">
                {isLoading ? "Criando..." : "Criar Etapa"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editStep} onOpenChange={() => setEditStep(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Editar Etapa</DialogTitle>
            <DialogDescription className="text-zinc-400">
              {editStep?.client_name} - Etapa {editStep?.order_index}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Número da Etapa</Label>
                <Input
                  type="number"
                  min="1"
                  value={editForm.order_index}
                  onChange={(e) => setEditForm({ ...editForm, order_index: parseInt(e.target.value) })}
                  className="bg-zinc-900/50 border-zinc-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Status</Label>
                <Select
                  value={editForm.status}
                  onValueChange={(value: 'pending' | 'in_progress' | 'completed') => setEditForm({ ...editForm, status: value })}
                >
                  <SelectTrigger className="bg-zinc-900/50 border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    <SelectItem value="pending" className="text-zinc-300">Pendente</SelectItem>
                    <SelectItem value="in_progress" className="text-zinc-300">Em Andamento</SelectItem>
                    <SelectItem value="completed" className="text-zinc-300">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Título</Label>
              <Input
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                required
                className="bg-zinc-900/50 border-zinc-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Descrição</Label>
              <Textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                required
                className="bg-zinc-900/50 border-zinc-700 text-white resize-none"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Data de Previsão</Label>
              <Input
                type="date"
                value={editForm.due_date}
                onChange={(e) => setEditForm({ ...editForm, due_date: e.target.value })}
                className="bg-zinc-900/50 border-zinc-700 text-white"
              />
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button type="button" variant="outline" onClick={() => setEditStep(null)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700 text-white">
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Tem certeza que deseja excluir esta etapa? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isLoading} className="bg-red-600 hover:bg-red-700 text-white">
              {isLoading ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
