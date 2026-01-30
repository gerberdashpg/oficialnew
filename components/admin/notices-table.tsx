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
import { Search, MoreHorizontal, Edit, Trash2, Bell, Plus, Building2, Clock, RefreshCw, Pause, Play } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface Notice {
  id: string
  client_id: string
  client_name: string
  client_slug: string
  title: string
  message: string
  priority?: string
  is_recurring?: boolean
  recurrence_days?: number
  is_active?: boolean
  next_send_at?: string
  created_at: string
}

interface Client {
  id: string
  name: string
}

interface NoticesTableProps {
  notices: Notice[]
  clients: Client[]
}

const priorityColors: Record<string, string> = {
  low: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
  normal: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  high: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  urgent: "bg-red-500/20 text-red-400 border-red-500/30",
}

export function NoticesTable({ notices: initialNotices, clients }: NoticesTableProps) {
  const [notices, setNotices] = useState(initialNotices)
  const [search, setSearch] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editNotice, setEditNotice] = useState<Notice | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [newNotice, setNewNotice] = useState({
    client_id: "",
    title: "",
    message: "",
    priority: "normal",
    is_recurring: false,
    recurrence_days: 7,
  })
  const [editForm, setEditForm] = useState({
    title: "",
    message: "",
    priority: "normal",
    is_recurring: false,
    recurrence_days: 7,
  })

  const filteredNotices = notices.filter(
    (notice) =>
      notice.title.toLowerCase().includes(search.toLowerCase()) ||
      notice.client_name.toLowerCase().includes(search.toLowerCase()) ||
      notice.message.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNotice),
      })

      if (res.ok) {
        const data = await res.json()
        const client = clients.find((c) => c.id === newNotice.client_id)
        setNotices([...notices, { ...data.notice, client_name: client?.name || "", client_slug: "" }])
        setIsDialogOpen(false)
        setNewNotice({
          client_id: "",
          title: "",
          message: "",
          priority: "normal",
          is_recurring: false,
          recurrence_days: 7,
        })
      }
    } catch (error) {
      console.error("Error creating notice:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (notice: Notice) => {
    setEditNotice(notice)
    setEditForm({
      title: notice.title,
      message: notice.message,
      priority: notice.priority || "normal",
      is_recurring: notice.is_recurring || false,
      recurrence_days: notice.recurrence_days || 7,
    })
  }

  const handleToggleActive = async (notice: Notice) => {
    try {
      const res = await fetch(`/api/admin/notices/${notice.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !notice.is_active }),
      })

      if (res.ok) {
        setNotices(notices.map((n) => (n.id === notice.id ? { ...n, is_active: !n.is_active } : n)))
      }
    } catch (error) {
      console.error("Error toggling notice:", error)
    }
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editNotice) return
    setIsLoading(true)

    try {
      const res = await fetch(`/api/admin/notices/${editNotice.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })

      if (res.ok) {
        const updated = await res.json()
        setNotices(notices.map((n) => (n.id === editNotice.id ? { ...n, ...updated } : n)))
        setEditNotice(null)
      }
    } catch (error) {
      console.error("Error updating notice:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsLoading(true)

    try {
      const res = await fetch(`/api/admin/notices/${deleteId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setNotices(notices.filter((n) => n.id !== deleteId))
      }
    } catch (error) {
      console.error("Error deleting notice:", error)
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
            placeholder="Buscar avisos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-purple-500"
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Novo Aviso
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800">
            <DialogHeader>
              <DialogTitle className="text-white">Novo Aviso</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Envie um comunicado para um cliente
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateNotice} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Cliente</Label>
                <Select
                  value={newNotice.client_id}
                  onValueChange={(value) => setNewNotice({ ...newNotice, client_id: value })}
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
                <Label className="text-zinc-300">Título</Label>
                <Input
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  placeholder="Titulo do aviso"
                  required
                  className="bg-zinc-900/50 border-zinc-700 text-white focus:border-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Prioridade</Label>
                <Select
                  value={newNotice.priority}
                  onValueChange={(value) => setNewNotice({ ...newNotice, priority: value })}
                >
                  <SelectTrigger className="bg-zinc-900/50 border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    <SelectItem value="low" className="text-zinc-300 focus:text-white focus:bg-zinc-800">Baixa</SelectItem>
                    <SelectItem value="normal" className="text-zinc-300 focus:text-white focus:bg-zinc-800">Normal</SelectItem>
                    <SelectItem value="high" className="text-zinc-300 focus:text-white focus:bg-zinc-800">Alta</SelectItem>
                    <SelectItem value="urgent" className="text-zinc-300 focus:text-white focus:bg-zinc-800">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Mensagem</Label>
                <Textarea
                  value={newNotice.message}
                  onChange={(e) => setNewNotice({ ...newNotice, message: e.target.value })}
                  placeholder="Conteudo do aviso..."
                  rows={4}
                  required
                  className="bg-zinc-900/50 border-zinc-700 text-white resize-none focus:border-purple-500"
                />
              </div>
              
              {/* Recurring Notice Settings */}
              <div className="space-y-4 p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-zinc-300 flex items-center gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Aviso Programado
                    </Label>
                    <p className="text-xs text-zinc-500">Enviar automaticamente a cada X dias</p>
                  </div>
                  <Switch
                    checked={newNotice.is_recurring}
                    onCheckedChange={(checked) => setNewNotice({ ...newNotice, is_recurring: checked })}
                  />
                </div>
                
                {newNotice.is_recurring && (
                  <div className="space-y-2">
                    <Label className="text-zinc-300">Repetir a cada</Label>
                    <Select
                      value={String(newNotice.recurrence_days)}
                      onValueChange={(value) => setNewNotice({ ...newNotice, recurrence_days: Number(value) })}
                    >
                      <SelectTrigger className="bg-zinc-900/50 border-zinc-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800">
                        <SelectItem value="1" className="text-zinc-300 focus:text-white focus:bg-zinc-800">1 dia</SelectItem>
                        <SelectItem value="3" className="text-zinc-300 focus:text-white focus:bg-zinc-800">3 dias</SelectItem>
                        <SelectItem value="7" className="text-zinc-300 focus:text-white focus:bg-zinc-800">7 dias</SelectItem>
                        <SelectItem value="14" className="text-zinc-300 focus:text-white focus:bg-zinc-800">14 dias</SelectItem>
                        <SelectItem value="30" className="text-zinc-300 focus:text-white focus:bg-zinc-800">30 dias</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              
              <Button type="submit" disabled={isLoading} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                {isLoading ? "Criando..." : "Criar Aviso"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
            <TableHead className="text-zinc-400">Aviso</TableHead>
            <TableHead className="text-zinc-400">Cliente</TableHead>
            <TableHead className="text-zinc-400">Prioridade</TableHead>
            <TableHead className="text-zinc-400">Tipo</TableHead>
            <TableHead className="text-zinc-400">Mensagem</TableHead>
            <TableHead className="text-zinc-400 text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredNotices.length > 0 ? (
            filteredNotices.map((notice) => (
              <TableRow key={notice.id} className="border-zinc-800 hover:bg-zinc-900/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <Bell className="w-5 h-5 text-purple-400" />
                    </div>
                    <p className="font-medium text-white">{notice.title}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Link href={`/admin/clientes/${notice.client_id}`}>
                    <div className="flex items-center gap-2 text-zinc-300 hover:text-white">
                      <Building2 className="w-4 h-4 text-zinc-500" />
                      {notice.client_name}
                    </div>
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={priorityColors[notice.priority || "normal"]}>
                    {notice.priority === "low" && "Baixa"}
                    {notice.priority === "normal" && "Normal"}
                    {notice.priority === "high" && "Alta"}
                    {notice.priority === "urgent" && "Urgente"}
                    {!notice.priority && "Normal"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {notice.is_recurring ? (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-blue-500/50 text-blue-400 bg-blue-500/10">
                        <RefreshCw className="w-3 h-3 mr-1" />
                        {notice.recurrence_days}d
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-6 w-6 ${notice.is_active ? "text-green-400 hover:text-green-300" : "text-zinc-500 hover:text-zinc-400"}`}
                        onClick={() => handleToggleActive(notice)}
                      >
                        {notice.is_active ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                      </Button>
                    </div>
                  ) : (
                    <Badge variant="outline" className="border-zinc-600 text-zinc-400">
                      <Clock className="w-3 h-3 mr-1" />
                      Único
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="max-w-xs">
                  <p className="text-zinc-300 truncate">{notice.message}</p>
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
                        onClick={() => handleEdit(notice)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-400 focus:text-red-400 focus:bg-red-950 cursor-pointer"
                        onClick={() => setDeleteId(notice.id)}
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
              <TableCell colSpan={6} className="h-32 text-center">
                <div className="flex flex-col items-center gap-2 text-zinc-400">
                  <Bell className="w-8 h-8 opacity-50" />
                  <p>Nenhum aviso encontrado</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Edit Dialog */}
      <Dialog open={!!editNotice} onOpenChange={() => setEditNotice(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-white">Editar Aviso</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Atualize o comunicado
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveEdit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Título</Label>
              <Input
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                required
                className="bg-zinc-900/50 border-zinc-700 text-white focus:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Prioridade</Label>
              <Select
                value={editForm.priority}
                onValueChange={(value) => setEditForm({ ...editForm, priority: value })}
              >
                <SelectTrigger className="bg-zinc-900/50 border-zinc-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  <SelectItem value="low" className="text-zinc-300 focus:text-white focus:bg-zinc-800">Baixa</SelectItem>
                  <SelectItem value="normal" className="text-zinc-300 focus:text-white focus:bg-zinc-800">Normal</SelectItem>
                  <SelectItem value="high" className="text-zinc-300 focus:text-white focus:bg-zinc-800">Alta</SelectItem>
                  <SelectItem value="urgent" className="text-zinc-300 focus:text-white focus:bg-zinc-800">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Mensagem</Label>
              <Textarea
                value={editForm.message}
                onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                rows={4}
                required
                className="bg-zinc-900/50 border-zinc-700 text-white resize-none focus:border-purple-500"
              />
            </div>
            
            {/* Recurring Notice Settings */}
            <div className="space-y-4 p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-zinc-300 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Aviso Programado
                  </Label>
                  <p className="text-xs text-zinc-500">Enviar automaticamente a cada X dias</p>
                </div>
                <Switch
                  checked={editForm.is_recurring}
                  onCheckedChange={(checked) => setEditForm({ ...editForm, is_recurring: checked })}
                />
              </div>
              
              {editForm.is_recurring && (
                <div className="space-y-2">
                  <Label className="text-zinc-300">Repetir a cada</Label>
                  <Select
                    value={String(editForm.recurrence_days)}
                    onValueChange={(value) => setEditForm({ ...editForm, recurrence_days: Number(value) })}
                  >
                    <SelectTrigger className="bg-zinc-900/50 border-zinc-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800">
                      <SelectItem value="1" className="text-zinc-300 focus:text-white focus:bg-zinc-800">1 dia</SelectItem>
                      <SelectItem value="3" className="text-zinc-300 focus:text-white focus:bg-zinc-800">3 dias</SelectItem>
                      <SelectItem value="7" className="text-zinc-300 focus:text-white focus:bg-zinc-800">7 dias</SelectItem>
                      <SelectItem value="14" className="text-zinc-300 focus:text-white focus:bg-zinc-800">14 dias</SelectItem>
                      <SelectItem value="30" className="text-zinc-300 focus:text-white focus:bg-zinc-800">30 dias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setEditNotice(null)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 bg-transparent">
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700 text-white">
                {isLoading ? "Salvando..." : "Salvar"}
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
              Tem certeza que deseja excluir este aviso? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white">
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
