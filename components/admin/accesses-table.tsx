"use client"

import React, { useState } from "react"
import Link from "next/link"
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
import { Search, MoreHorizontal, Edit, Trash2, Key, Plus, Eye, EyeOff, Building2, Copy, Check, Database, Loader2 } from "lucide-react"
import Image from "next/image"

interface Access {
  id: string
  client_id: string
  client_name: string
  client_slug: string
  client_logo_url?: string | null
  service_name: string
  service_url: string | null
  login: string
  password: string
  created_at: string
  icon_url?: string | null
}

interface Client {
  id: string
  name: string
  slug: string
}

interface AccessesTableProps {
  accesses: Access[]
  clients: Client[]
}

export function AccessesTable({ accesses: initialAccesses, clients }: AccessesTableProps) {
  const [accesses, setAccesses] = useState(initialAccesses)
  const [search, setSearch] = useState("")
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editAccess, setEditAccess] = useState<Access | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [newAccess, setNewAccess] = useState({
    client_id: "",
    service_name: "",
    service_url: "",
    login: "",
    password: "",
  })
  const [editForm, setEditForm] = useState({
    service_name: "",
    service_url: "",
    login: "",
    password: "",
  })
  const [isAdbDialogOpen, setIsAdbDialogOpen] = useState(false)
  const [adbClientId, setAdbClientId] = useState("")
  const [isAdbLoading, setIsAdbLoading] = useState(false)
  const [adbTemplates] = useState([
    { service_name: "Appmax", icon_url: "https://yp5i3m1kzldajyyg.public.blob.vercel-storage.com/accesses/appmax-icon-IzYZaVKJBdYHKXcWqtRhSL0OfFhCSH.jpg" },
    { service_name: "DSers", icon_url: "https://yp5i3m1kzldajyyg.public.blob.vercel-storage.com/accesses/dsers-icon-4cBVVwLJLWOq4Gs44oH9V3sHaWgOl7.png" },
    { service_name: "Gmail", icon_url: "https://yp5i3m1kzldajyyg.public.blob.vercel-storage.com/accesses/gmail-icon-nOZLh5pKLjuMrBMbNMCLW0TVWN73LN.png" },
    { service_name: "Hostinger", icon_url: "https://yp5i3m1kzldajyyg.public.blob.vercel-storage.com/accesses/hostinger-icon-BPgRvlBKKB4pJdK17FUMa8b2IhC9uT.png" },
    { service_name: "HyperSKU", icon_url: "https://yp5i3m1kzldajyyg.public.blob.vercel-storage.com/accesses/hypersku-icon-nzUABfVcw7vPgMpVU7WKfkxNaUqNqY.jpg" },
    { service_name: "Shopify", icon_url: "https://yp5i3m1kzldajyyg.public.blob.vercel-storage.com/accesses/shopify-icon-OVqxuuNqFFwBkOqKxcZtmHDl2oS9nt.png" },
    { service_name: "Yampi", icon_url: "https://yp5i3m1kzldajyyg.public.blob.vercel-storage.com/accesses/yampi-icon-G3Rqk2PB5M7QQPtcfxMXgXmM2HCePS.jpg" },
  ])

  const filteredAccesses = accesses.filter(
    (access) =>
      access.service_name.toLowerCase().includes(search.toLowerCase()) ||
      access.client_name.toLowerCase().includes(search.toLowerCase()) ||
      access.login.toLowerCase().includes(search.toLowerCase())
  )

  const togglePassword = (id: string) => {
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleCreateAccess = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/accesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAccess),
      })

      if (res.ok) {
        const data = await res.json()
        const client = clients.find((c) => c.id === newAccess.client_id)
        setAccesses([...accesses, { ...data.access, client_name: client?.name || "", client_slug: client?.slug || "" }])
        setIsDialogOpen(false)
        setNewAccess({
          client_id: "",
          service_name: "",
          service_url: "",
          login: "",
          password: "",
        })
      }
    } catch (error) {
      console.error("Error creating access:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (access: Access) => {
    setEditAccess(access)
    setEditForm({
      service_name: access.service_name,
      service_url: access.service_url || "",
      login: access.login,
      password: access.password,
    })
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editAccess) return
    setIsLoading(true)

    try {
      const res = await fetch(`/api/admin/accesses/${editAccess.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })

      if (res.ok) {
        const data = await res.json()
        setAccesses(accesses.map((a) => (a.id === editAccess.id ? { ...a, ...data } : a)))
        setEditAccess(null)
      }
    } catch (error) {
      console.error("Error updating access:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsLoading(true)

    try {
      const res = await fetch(`/api/admin/accesses/${deleteId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setAccesses(accesses.filter((a) => a.id !== deleteId))
      }
    } catch (error) {
      console.error("Error deleting access:", error)
    } finally {
      setIsLoading(false)
      setDeleteId(null)
    }
  }

  const handleAddAdb = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!adbClientId) return
    setIsAdbLoading(true)

    try {
      const res = await fetch("/api/admin/accesses/bulk-adb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client_id: adbClientId }),
      })

      if (res.ok) {
        const data = await res.json()
        const client = clients.find((c) => c.id === adbClientId)
        const newAccesses = data.accesses.map((access: Access) => ({
          ...access,
          client_name: client?.name || "",
          client_slug: client?.slug || "",
        }))
        setAccesses([...newAccesses, ...accesses])
        setIsAdbDialogOpen(false)
        setAdbClientId("")
      }
    } catch (error) {
      console.error("Error adding ADB accesses:", error)
    } finally {
      setIsAdbLoading(false)
    }
  }

  return (
    <div>
      <div className="p-4 border-b border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Buscar acessos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-purple-500"
          />
        </div>
        <div className="flex gap-2 shrink-0">
          <Dialog open={isAdbDialogOpen} onOpenChange={setIsAdbDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-emerald-600 text-emerald-400 hover:bg-emerald-600/10 bg-transparent flex-1 sm:flex-none">
                <Database className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Adicionar ADB</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white">Adicionar ADB</DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Adicione todos os acessos padrão (ADB) para um cliente com as logos já configuradas
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddAdb} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Cliente</Label>
                  <Select
                    value={adbClientId}
                    onValueChange={(value) => setAdbClientId(value)}
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
                  <Label className="text-zinc-300">Acessos que serão criados:</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {adbTemplates.map((template) => (
                      <div key={template.service_name} className="flex items-center gap-2 p-2 rounded-lg bg-zinc-800/50 border border-zinc-700">
                        <div className="w-8 h-8 rounded-lg overflow-hidden border border-zinc-600">
                          <Image
                            src={template.icon_url || "/placeholder.svg"}
                            alt={template.service_name}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-sm text-zinc-300">{template.service_name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <p className="text-amber-400 text-sm">
                    Os acessos serão criados sem login e senha. Você poderá editar as credenciais depois.
                  </p>
                </div>

                <Button 
                  type="submit" 
                  disabled={isAdbLoading || !adbClientId} 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isAdbLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Criando acessos...
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4 mr-2" />
                      Criar {adbTemplates.length} acessos
                    </>
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Novo Acesso
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800">
              <DialogHeader>
                <DialogTitle className="text-white">Novo Acesso</DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Cadastre um novo acesso para um cliente
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateAccess} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Cliente</Label>
                  <Select
                    value={newAccess.client_id}
                    onValueChange={(value) => setNewAccess({ ...newAccess, client_id: value })}
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
                  <Label className="text-zinc-300">Nome do Serviço</Label>
                  <Input
                    value={newAccess.service_name}
                    onChange={(e) => setNewAccess({ ...newAccess, service_name: e.target.value })}
                    placeholder="Ex: Google Analytics"
                    required
                    className="bg-zinc-900/50 border-zinc-700 text-white focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">URL (opcional)</Label>
                  <Input
                    value={newAccess.service_url}
                    onChange={(e) => setNewAccess({ ...newAccess, service_url: e.target.value })}
                    placeholder="https://..."
                    className="bg-zinc-900/50 border-zinc-700 text-white focus:border-purple-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-zinc-300">Login</Label>
                    <Input
                      value={newAccess.login}
                      onChange={(e) => setNewAccess({ ...newAccess, login: e.target.value })}
                      required
                      className="bg-zinc-900/50 border-zinc-700 text-white focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-300">Senha</Label>
                    <Input
                      value={newAccess.password}
                      onChange={(e) => setNewAccess({ ...newAccess, password: e.target.value })}
                      required
                      className="bg-zinc-900/50 border-zinc-700 text-white focus:border-purple-500"
                    />
                  </div>
                </div>
                <Button type="submit" disabled={isLoading} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  {isLoading ? "Criando..." : "Criar Acesso"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
              <TableHead className="text-zinc-400">Serviço</TableHead>
              <TableHead className="text-zinc-400">Cliente</TableHead>
              <TableHead className="text-zinc-400">Login</TableHead>
              <TableHead className="text-zinc-400">Senha</TableHead>
              <TableHead className="text-zinc-400">Criado em</TableHead>
              <TableHead className="text-zinc-400 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAccesses.length > 0 ? (
              filteredAccesses.map((access) => (
                <TableRow key={access.id} className="border-zinc-800 hover:bg-zinc-900/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {access.icon_url ? (
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-zinc-700 bg-zinc-800">
                          <img 
                            src={access.icon_url || "/placeholder.svg"} 
                            alt={access.service_name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = "none"
                              target.parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-emerald-500/20"><span class="text-emerald-400 font-bold">${access.service_name.charAt(0)}</span></div>`
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                          <span className="text-emerald-400 font-bold">
                            {access.service_name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-white">{access.service_name}</p>
                        {access.service_url && (
                          <a
                            href={access.service_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-zinc-500 hover:text-purple-400"
                          >
                            {access.service_url}
                          </a>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/clientes/${access.client_id}`}>
                      <div className="flex items-center gap-2 text-zinc-300 hover:text-white">
                        <div className="w-6 h-6 rounded-lg overflow-hidden bg-gradient-to-br from-[#A855F7] to-[#7C3AED] flex items-center justify-center shrink-0">
                          {access.client_logo_url ? (
                            <img 
                              src={access.client_logo_url || "/placeholder.svg"} 
                              alt={access.client_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-white text-xs font-bold">
                              {access.client_name.charAt(0)}
                            </span>
                          )}
                        </div>
                        {access.client_name}
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-zinc-300">{access.login}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(access.login, `login-${access.id}`)}
                        className="h-7 w-7 text-zinc-400 hover:text-white hover:bg-zinc-800"
                      >
                        {copiedId === `login-${access.id}` ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-zinc-300">
                        {showPasswords[access.id] ? access.password : "••••••••"}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => togglePassword(access.id)}
                        className="h-7 w-7 text-zinc-400 hover:text-white hover:bg-zinc-800"
                      >
                        {showPasswords[access.id] ? (
                          <EyeOff className="w-3 h-3" />
                        ) : (
                          <Eye className="w-3 h-3" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(access.password, `pass-${access.id}`)}
                        className="h-7 w-7 text-zinc-400 hover:text-white hover:bg-zinc-800"
                      >
                        {copiedId === `pass-${access.id}` ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-400 text-sm">
                    {new Date(access.created_at).toLocaleDateString("pt-BR")}
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
                          onClick={() => handleEdit(access)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-400 focus:text-red-400 focus:bg-red-950 cursor-pointer"
                          onClick={() => setDeleteId(access.id)}
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
                    <Key className="w-8 h-8 opacity-50" />
                    <p>Nenhum acesso encontrado</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden p-4 space-y-3">
        {filteredAccesses.length > 0 ? (
          filteredAccesses.map((access) => (
            <div key={access.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {access.icon_url ? (
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-zinc-700 bg-zinc-800 shrink-0">
                      <img 
                        src={access.icon_url || "/placeholder.svg"} 
                        alt={access.service_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <span className="text-emerald-400 font-bold">
                        {access.service_name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-white truncate">{access.service_name}</p>
                    <p className="text-sm text-zinc-500 truncate">{access.client_name}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800 shrink-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                    <DropdownMenuItem 
                      className="text-zinc-300 focus:text-white focus:bg-zinc-800 cursor-pointer"
                      onClick={() => handleEdit(access)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-400 focus:text-red-400 focus:bg-red-950 cursor-pointer"
                      onClick={() => setDeleteId(access.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between p-2 bg-zinc-800/50 rounded-lg">
                  <span className="text-xs text-zinc-500">Login</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-zinc-300 truncate max-w-[150px]">{access.login}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(access.login, `login-${access.id}`)}
                      className="h-6 w-6 text-zinc-400 hover:text-white hover:bg-zinc-700"
                    >
                      {copiedId === `login-${access.id}` ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 bg-zinc-800/50 rounded-lg">
                  <span className="text-xs text-zinc-500">Senha</span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-sm text-zinc-300">
                      {showPasswords[access.id] ? access.password : "••••••••"}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => togglePassword(access.id)}
                      className="h-6 w-6 text-zinc-400 hover:text-white hover:bg-zinc-700"
                    >
                      {showPasswords[access.id] ? (
                        <EyeOff className="w-3 h-3" />
                      ) : (
                        <Eye className="w-3 h-3" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(access.password, `pass-${access.id}`)}
                      className="h-6 w-6 text-zinc-400 hover:text-white hover:bg-zinc-700"
                    >
                      {copiedId === `pass-${access.id}` ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center gap-2 text-zinc-400 py-12">
            <Key className="w-8 h-8 opacity-50" />
            <p>Nenhum acesso encontrado</p>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editAccess} onOpenChange={() => setEditAccess(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-white">Editar Acesso</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Atualize as credenciais do acesso
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveEdit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Nome do Serviço</Label>
              <Input
                value={editForm.service_name}
                onChange={(e) => setEditForm({ ...editForm, service_name: e.target.value })}
                required
                className="bg-zinc-900/50 border-zinc-700 text-white focus:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">URL (opcional)</Label>
              <Input
                value={editForm.service_url}
                onChange={(e) => setEditForm({ ...editForm, service_url: e.target.value })}
                className="bg-zinc-900/50 border-zinc-700 text-white focus:border-purple-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Login</Label>
                <Input
                  value={editForm.login}
                  onChange={(e) => setEditForm({ ...editForm, login: e.target.value })}
                  required
                  className="bg-zinc-900/50 border-zinc-700 text-white focus:border-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Senha</Label>
                <Input
                  value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                  required
                  className="bg-zinc-900/50 border-zinc-700 text-white focus:border-purple-500"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setEditAccess(null)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
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
              Tem certeza que deseja excluir este acesso? Esta ação não pode ser desfeita.
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
