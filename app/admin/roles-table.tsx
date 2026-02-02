"use client"

import React, { useState } from "react"
import type { ReactElement } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
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
import { Search, MoreHorizontal, Edit, Trash2, Lock, Shield } from "lucide-react"

interface Role {
  id: string
  name: string
  description: string | null
  color: string
  is_system_role: boolean
  permissions: Array<{
    id: string
    code: string
    name: string
    category: string
  }>
  created_at: string
  updated_at: string
}

interface Permission {
  id: string
  code: string
  name: string
  category: string
}

export function RolesTable() {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [search, setSearch] = useState("")
  const [editRole, setEditRole] = useState<Role | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
    color: "#6B7280",
  })

  React.useEffect(() => {
    fetchRoles()
    fetchPermissions()
  }, [])

  const fetchRoles = async () => {
    try {
      const res = await fetch("/api/admin/roles")
      const data = await res.json()
      if (res.ok) {
        setRoles(data.roles)
      } else {
        toast.error(data.error || "Falha ao carregar roles")
      }
    } catch (error) {
      console.error("Error fetching roles:", error)
      toast.error("Falha ao carregar roles")
    }
  }

  const fetchPermissions = async () => {
    try {
      const res = await fetch("/api/admin/permissions")
      const data = await res.json()
      if (res.ok) {
        setPermissions(data.permissions)
      }
    } catch (error) {
      console.error("Error fetching permissions:", error)
    }
  }

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(search.toLowerCase()) ||
      (role.description && role.description.toLowerCase().includes(search.toLowerCase()))
  )

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("/api/admin/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...createForm,
          permissions: selectedPermissions,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setRoles([data.role, ...roles])
        setIsCreateOpen(false)
        setCreateForm({ name: "", description: "", color: "#6B7280" })
        setSelectedPermissions([])
        toast.success("Role criada com sucesso")
      } else {
        toast.error(data.error || "Falha ao criar role")
      }
    } catch (error) {
      console.error("Error creating role:", error)
      toast.error("Falha ao criar role")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (role: Role) => {
    setEditRole(role)
    setSelectedPermissions(role.permissions.map((p) => p.id))
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editRole) return
    setIsLoading(true)

    try {
      const res = await fetch(`/api/admin/roles/${editRole.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: editRole.description,
          color: editRole.color,
          permissions: selectedPermissions,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setRoles(roles.map((r) => (r.id === editRole.id ? data.role : r)))
        setEditRole(null)
        toast.success("Role atualizada com sucesso")
      } else {
        toast.error(data.error || "Falha ao atualizar role")
      }
    } catch (error) {
      console.error("Error updating role:", error)
      toast.error("Falha ao atualizar role")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsLoading(true)

    try {
      const res = await fetch(`/api/admin/roles/${deleteId}`, {
        method: "DELETE",
      })

      const data = await res.json()

      if (res.ok) {
        setRoles(roles.filter((r) => r.id !== deleteId))
        toast.success("Role excluida com sucesso")
      } else {
        toast.error(data.error || "Falha ao excluir role")
      }
    } catch (error) {
      console.error("Error deleting role:", error)
      toast.error("Falha ao excluir role")
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
            placeholder="Buscar roles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-purple-500"
          />
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
          <Shield className="w-4 h-4 mr-2" />
          Nova Role
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
            <TableHead className="text-zinc-400">Nome</TableHead>
            <TableHead className="text-zinc-400">Descrição</TableHead>
            <TableHead className="text-zinc-400">Permissões</TableHead>
            <TableHead className="text-zinc-400">Sistema</TableHead>
            <TableHead className="text-zinc-400">Criada em</TableHead>
            <TableHead className="text-zinc-400 text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRoles.length > 0 ? (
            filteredRoles.map((role) => (
              <TableRow key={role.id} className="border-zinc-800 hover:bg-zinc-900/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: role.color }}
                    />
                    <span className="font-medium text-white">{role.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-zinc-400 text-sm max-w-xs truncate">
                  {role.description || "-"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Lock className="w-4 h-4 text-zinc-500" />
                    <span className="text-sm text-zinc-400">{role.permissions.length}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {role.is_system_role ? (
                    <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      Sim
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-zinc-500/20 text-zinc-400 border-zinc-500/30">
                      Não
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-zinc-400 text-sm">
                  {new Date(role.created_at).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                      {!role.is_system_role && (
                        <>
                          <DropdownMenuItem
                            className="text-zinc-300 focus:text-white focus:bg-zinc-800 cursor-pointer"
                            onClick={() => handleEdit(role)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-400 focus:text-red-400 focus:bg-red-950 cursor-pointer"
                            onClick={() => setDeleteId(role.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </>
                      )}
                      {role.is_system_role && (
                        <DropdownMenuItem
                          className="text-zinc-500 cursor-not-allowed"
                          disabled
                        >
                          Role do sistema
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center">
                <div className="flex flex-col items-center gap-2 text-zinc-400">
                  <Shield className="w-8 h-8 opacity-50" />
                  <p>Nenhuma role encontrada</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Nova Role</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Crie uma nova role com permissões específicas
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-300">Nome</Label>
              <Input
                id="name"
                placeholder="Ex: Editor"
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-zinc-300">Descrição</Label>
              <Input
                id="description"
                placeholder="Descrição da role"
                value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color" className="text-zinc-300">Cor</Label>
              <div className="flex gap-2">
                <Input
                  id="color"
                  type="color"
                  value={createForm.color}
                  onChange={(e) => setCreateForm({ ...createForm, color: e.target.value })}
                  className="w-16 h-10 bg-zinc-800 border-zinc-700"
                />
                <Input
                  type="text"
                  value={createForm.color}
                  onChange={(e) => setCreateForm({ ...createForm, color: e.target.value })}
                  className="flex-1 bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              <Label className="text-zinc-300">Permissões</Label>
              {permissions.map((permission) => (
                <label key={permission.id} className="flex items-center gap-2 p-2 rounded hover:bg-zinc-800/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(permission.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPermissions([...selectedPermissions, permission.id])
                      } else {
                        setSelectedPermissions(selectedPermissions.filter((p) => p !== permission.id))
                      }
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-zinc-300">{permission.name}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !createForm.name}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isLoading ? "Criando..." : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      {editRole && (
        <Dialog open={!!editRole} onOpenChange={() => setEditRole(null)}>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
            <DialogHeader>
              <DialogTitle>Editar Role</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Modifique as permissões da role
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Nome</Label>
                <Input
                  value={editRole.name}
                  disabled
                  className="bg-zinc-800 border-zinc-700 text-zinc-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description" className="text-zinc-300">Descrição</Label>
                <Input
                  id="edit-description"
                  value={editRole.description || ""}
                  onChange={(e) => setEditRole({ ...editRole, description: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-color" className="text-zinc-300">Cor</Label>
                <div className="flex gap-2">
                  <Input
                    id="edit-color"
                    type="color"
                    value={editRole.color}
                    onChange={(e) => setEditRole({ ...editRole, color: e.target.value })}
                    className="w-16 h-10 bg-zinc-800 border-zinc-700"
                  />
                  <Input
                    type="text"
                    value={editRole.color}
                    onChange={(e) => setEditRole({ ...editRole, color: e.target.value })}
                    className="flex-1 bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                <Label className="text-zinc-300">Permissões</Label>
                {permissions.map((permission) => (
                  <label key={permission.id} className="flex items-center gap-2 p-2 rounded hover:bg-zinc-800/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(permission.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPermissions([...selectedPermissions, permission.id])
                        } else {
                          setSelectedPermissions(selectedPermissions.filter((p) => p !== permission.id))
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-zinc-300">{permission.name}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditRole(null)}
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isLoading ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Role</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Tem certeza que deseja excluir esta role? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
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