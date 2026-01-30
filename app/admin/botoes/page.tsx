"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Plus, 
  Pencil, 
  Trash2, 
  ExternalLink, 
  Loader2,
  Link as LinkIcon,
  MousePointer2
} from "lucide-react"
import { toast } from "sonner"
import useSWR, { mutate } from "swr"

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface ButtonLink {
  id: string
  link_key: string
  link_url: string
  label: string
  description: string | null
  created_at: string
  updated_at: string
}

export default function AdminBotoesPage() {
  const { data: buttons, error, isLoading } = useSWR<ButtonLink[]>('/api/admin/settings', fetcher)
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingButton, setEditingButton] = useState<ButtonLink | null>(null)
  const [deletingButton, setDeletingButton] = useState<ButtonLink | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    link_key: "",
    link_url: "",
    label: "",
    description: ""
  })

  const openCreateDialog = () => {
    setEditingButton(null)
    setFormData({
      link_key: "",
      link_url: "",
      label: "",
      description: ""
    })
    setIsDialogOpen(true)
  }

  const openEditDialog = (button: ButtonLink) => {
    setEditingButton(button)
    setFormData({
      link_key: button.link_key,
      link_url: button.link_url,
      label: button.label,
      description: button.description || ""
    })
    setIsDialogOpen(true)
  }

  const openDeleteDialog = (button: ButtonLink) => {
    setDeletingButton(button)
    setIsDeleteDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.link_key || !formData.link_url || !formData.label) {
      toast.error("Preencha todos os campos obrigatórios")
      return
    }

    setIsSaving(true)
    try {
      const method = editingButton ? "PUT" : "POST"
      const url = editingButton 
        ? `/api/admin/settings?id=${editingButton.id}`
        : "/api/admin/settings"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Erro ao salvar")
      }

      toast.success(editingButton ? "Botão atualizado!" : "Botão criado!")
      mutate('/api/admin/settings')
      setIsDialogOpen(false)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingButton) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/settings?id=${deletingButton.id}`, {
        method: "DELETE"
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Erro ao excluir")
      }

      toast.success("Botão excluído!")
      mutate('/api/admin/settings')
      setIsDeleteDialogOpen(false)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsSaving(false)
      setDeletingButton(null)
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <DashboardHeader
        title="Botões e Links"
        subtitle="Gerencie os links dos botões que aparecem nas páginas do sistema"
      />

      <Card className="bg-[#0D0D12] border-zinc-800/60">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-[#F5F5F7] flex items-center gap-2">
              <MousePointer2 className="w-5 h-5 text-violet-400" />
              Links Configuráveis
            </CardTitle>
            <CardDescription className="text-[rgba(245,245,247,0.52)]">
              Configure os links de ação que aparecem para os clientes
            </CardDescription>
          </div>
          <Button 
            onClick={openCreateDialog}
            className="bg-violet-600 hover:bg-violet-700 text-white w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Botão
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-400">
              Erro ao carregar botões
            </div>
          ) : buttons && buttons.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800/60 hover:bg-transparent">
                  <TableHead className="text-zinc-400">Identificador</TableHead>
                  <TableHead className="text-zinc-400">Label</TableHead>
                  <TableHead className="text-zinc-400">URL</TableHead>
                  <TableHead className="text-zinc-400">Descrição</TableHead>
                  <TableHead className="text-zinc-400 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {buttons.map((button) => (
                  <TableRow key={button.id} className="border-zinc-800/60 hover:bg-zinc-900/50">
                    <TableCell>
                      <Badge variant="outline" className="bg-violet-500/10 text-violet-400 border-violet-500/30 font-mono text-xs">
                        {button.link_key}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white font-medium">
                      {button.label}
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <a 
                        href={button.link_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-zinc-400 hover:text-violet-400 flex items-center gap-1 truncate text-sm"
                      >
                        <LinkIcon className="w-3 h-3 shrink-0" />
                        <span className="truncate">{button.link_url}</span>
                      </a>
                    </TableCell>
                    <TableCell className="text-zinc-500 text-sm max-w-[200px] truncate">
                      {button.description || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(button)}
                          className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(button)}
                          className="h-8 w-8 text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <MousePointer2 className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-400 mb-2">Nenhum botão configurado</p>
              <p className="text-zinc-500 text-sm mb-6">
                Crie botões para aparecerem nas páginas do sistema
              </p>
              <Button 
                onClick={openCreateDialog}
                variant="outline"
                className="bg-transparent border-violet-500/30 text-violet-400 hover:bg-violet-500/10"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar primeiro botão
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#0D0D12] border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>
              {editingButton ? "Editar Botão" : "Novo Botão"}
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              {editingButton 
                ? "Atualize as informações do botão"
                : "Preencha as informações para criar um novo botão"
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="link_key" className="text-zinc-300">
                Identificador (chave única) *
              </Label>
              <Input
                id="link_key"
                value={formData.link_key}
                onChange={(e) => setFormData({ ...formData, link_key: e.target.value.toLowerCase().replace(/\s/g, '_') })}
                placeholder="ex: specialist_whatsapp"
                className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
                disabled={!!editingButton}
              />
              <p className="text-xs text-zinc-500">
                Usado internamente para identificar o botão. Não pode ser alterado depois.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="label" className="text-zinc-300">
                Label do Botão *
              </Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="ex: Falar com um especialista"
                className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="link_url" className="text-zinc-300">
                URL do Link *
              </Label>
              <Input
                id="link_url"
                value={formData.link_url}
                onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                placeholder="ex: https://wa.me/5511999999999"
                className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-zinc-300">
                Descrição (opcional)
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva onde este botão aparece e qual sua função"
                className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 resize-none"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-violet-600 hover:bg-violet-700 text-white"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                editingButton ? "Salvar Alterações" : "Criar Botão"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-[#0D0D12] border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-red-400">Excluir Botão</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Tem certeza que deseja excluir o botão "{deletingButton?.label}"? 
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isSaving}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Excluir"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
