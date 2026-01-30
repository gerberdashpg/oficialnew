"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, MoreHorizontal, Edit, Trash2, Users, Building2 } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: string
  client_id: string | null
  client_name: string | null
  client_slug: string | null
  avatar_url?: string | null
  created_at: string
}

interface Client {
  id: string
  name: string
}

interface UsersTableProps {
  users: User[]
  clients: Client[]
}

const roleColors: Record<string, string> = {
  ADMIN: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  CLIENTE: "bg-blue-500/20 text-blue-400 border-blue-500/30",
}

export function UsersTable({ users: initialUsers, clients }: UsersTableProps) {
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState("")
  const [editUser, setEditUser] = useState<User | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  })
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CLIENTE",
    client_id: "",
  })

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      (user.client_name && user.client_name.toLowerCase().includes(search.toLowerCase()))
  )

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      })

      if (res.ok) {
        const { user: newUser } = await res.json()
        const client = clients.find(c => c.id === createForm.client_id)
        setUsers([{ ...newUser, client_name: client?.name || null }, ...users])
        setIsCreateOpen(false)
        setCreateForm({ name: "", email: "", password: "", role: "CLIENTE", client_id: "" })
      }
    } catch (error) {
      console.error("Error creating user:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (user: User) => {
    setEditUser(user)
    setEditForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    })
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editUser) return
    setIsLoading(true)

    try {
      const res = await fetch(`/api/admin/users/${editUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })

      if (res.ok) {
        const updated = await res.json()
        setUsers(users.map((u) => (u.id === editUser.id ? { ...u, ...updated } : u)))
        setEditUser(null)
      }
    } catch (error) {
      console.error("Error updating user:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsLoading(true)

    try {
      const res = await fetch(`/api/admin/users/${deleteId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setUsers(users.filter((u) => u.id !== deleteId))
      }
    } catch (error) {
      console.error("Error deleting user:", error)
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
            placeholder="Buscar usuários..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-purple-500"
          />
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
          <Users className="w-4 h-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
            <TableHead className="text-zinc-400">Usuário</TableHead>
            <TableHead className="text-zinc-400">Email</TableHead>
            <TableHead className="text-zinc-400">Tipo</TableHead>
            <TableHead className="text-zinc-400">Cliente</TableHead>
            <TableHead className="text-zinc-400">Criado em</TableHead>
            <TableHead className="text-zinc-400 text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <TableRow key={user.id} className="border-zinc-800 hover:bg-zinc-900/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    {user.avatar_url ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-700">
                        <img 
                          src={user.avatar_url || "/placeholder.svg"} 
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        user.role === "ADMIN" ? "bg-purple-500/20" : "bg-blue-500/20"
                      }`}>
                        <span className={`font-bold ${
                          user.role === "ADMIN" ? "text-purple-400" : "text-blue-400"
                        }`}>
                          {user.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <p className="font-medium text-white">{user.name}</p>
                  </div>
                </TableCell>
                <TableCell className="text-zinc-300">{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={roleColors[user.role]}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.client_name ? (
                    <Link href={`/admin/clientes/${user.client_id}`}>
                      <div className="flex items-center gap-2 text-zinc-300 hover:text-white">
                        <Building2 className="w-4 h-4 text-zinc-500" />
                        {user.client_name}
                      </div>
                    </Link>
                  ) : (
                    <span className="text-zinc-500">-</span>
                  )}
                </TableCell>
                <TableCell className="text-zinc-400 text-sm">
                  {new Date(user.created_at).toLocaleDateString("pt-BR")}
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
                        onClick={() => handleEdit(user)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-400 focus:text-red-400 focus:bg-red-950 cursor-pointer"
                        onClick={() => setDeleteId(user.id)}
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
                  <Users className="w-8 h-8 opacity-50" />
                  <p>Nenhum usuario encontrado</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Edit Dialog */}
      <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-white">Editar Usuário</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Atualize os dados do usuario
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveEdit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Nome</Label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                required
                className="bg-zinc-900/50 border-zinc-700 text-white focus:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Email</Label>
              <Input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                required
                className="bg-zinc-900/50 border-zinc-700 text-white focus:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Nova Senha (deixe em branco para manter)</Label>
              <Input
                type="password"
                value={editForm.password}
                onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                className="bg-zinc-900/50 border-zinc-700 text-white focus:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Tipo</Label>
              <Select
                value={editForm.role}
                onValueChange={(value) => setEditForm({ ...editForm, role: value })}
              >
                <SelectTrigger className="bg-zinc-900/50 border-zinc-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  <SelectItem value="ADMIN" className="text-zinc-300 focus:text-white focus:bg-zinc-800">Admin</SelectItem>
                  <SelectItem value="CLIENTE" className="text-zinc-300 focus:text-white focus:bg-zinc-800">Cliente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setEditUser(null)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700 text-white">
                {isLoading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-white">Novo Usuário</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Crie um novo usuario na plataforma
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Nome</Label>
              <Input
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                required
                className="bg-zinc-900/50 border-zinc-700 text-white focus:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Email</Label>
              <Input
                type="email"
                value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                required
                className="bg-zinc-900/50 border-zinc-700 text-white focus:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Senha</Label>
              <Input
                type="password"
                value={createForm.password}
                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                required
                className="bg-zinc-900/50 border-zinc-700 text-white focus:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Tipo</Label>
              <Select
                value={createForm.role}
                onValueChange={(value) => setCreateForm({ ...createForm, role: value })}
              >
                <SelectTrigger className="bg-zinc-900/50 border-zinc-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  <SelectItem value="ADMIN" className="text-zinc-300 focus:text-white focus:bg-zinc-800">Admin</SelectItem>
                  <SelectItem value="CLIENTE" className="text-zinc-300 focus:text-white focus:bg-zinc-800">Cliente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {createForm.role === "CLIENTE" && (
              <div className="space-y-2">
                <Label className="text-zinc-300">Cliente</Label>
                <Select
                  value={createForm.client_id}
                  onValueChange={(value) => setCreateForm({ ...createForm, client_id: value })}
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
            )}
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700 text-white">
                {isLoading ? "Criando..." : "Criar Usuário"}
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
              Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
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
