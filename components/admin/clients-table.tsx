"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Search, MoreHorizontal, Eye, Edit, Users, Key, Plus, Building2, Trash2 } from "lucide-react"

interface Client {
  id: string
  name: string
  slug: string
  plan: string
  status: string
  drive_link: string | null
  logo_url?: string | null
  user_count: number
  access_count: number
  created_at: string
}

interface ClientsTableProps {
  clients: Client[]
  userRole?: string
}

const planColors: Record<string, string> = {
  START: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
  PRO: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  SCALE: "bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 text-purple-400 border-purple-500/30",
}

const statusColors: Record<string, string> = {
  ACTIVE: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  PAUSED: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  ONBOARDING: "bg-blue-500/20 text-blue-400 border-blue-500/30",
}

export function ClientsTable({ clients: initialClients, userRole = "ADMIN" }: ClientsTableProps) {
  const router = useRouter()
  const [clients, setClients] = useState(initialClients)
  const [search, setSearch] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Check if user can edit/delete (Nexus Growth can only view)
  const canEdit = userRole === "ADMIN" || userRole === "Administrador"

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.slug.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)

    try {
      const res = await fetch(`/api/admin/clients/${deleteId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setClients(clients.filter((c) => c.id !== deleteId))
      }
    } catch (error) {
      console.error("Error deleting client:", error)
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  return (
    <div>
      <div className="p-4 border-b border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Buscar clientes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-purple-500"
          />
        </div>
{canEdit && (
          <Link href="/admin/clientes/novo" className="shrink-0">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              <span className="sm:inline">Novo Cliente</span>
            </Button>
          </Link>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
              <TableHead className="text-zinc-400">Cliente</TableHead>
              <TableHead className="text-zinc-400">Plano</TableHead>
              <TableHead className="text-zinc-400">Status</TableHead>
              <TableHead className="text-zinc-400 text-center">Usuários</TableHead>
              <TableHead className="text-zinc-400 text-center">Acessos</TableHead>
              <TableHead className="text-zinc-400">Criado em</TableHead>
              <TableHead className="text-zinc-400 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <TableRow key={client.id} className="border-zinc-800 hover:bg-zinc-900/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {client.logo_url ? (
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-zinc-700">
                          <img 
                            src={client.logo_url || "/placeholder.svg"} 
                            alt={client.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center">
                          <span className="text-white font-bold">
                            {client.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-white">{client.name}</p>
                        <p className="text-sm text-zinc-500">@{client.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={planColors[client.plan] || planColors.START}>
                      {client.plan}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[client.status] || statusColors.ACTIVE}>
                      {client.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1 text-zinc-300">
                      <Users className="w-4 h-4 text-zinc-500" />
                      {client.user_count}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1 text-zinc-300">
                      <Key className="w-4 h-4 text-zinc-500" />
                      {client.access_count}
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-400 text-sm">
                    {new Date(client.created_at).toLocaleDateString("pt-BR")}
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
                          onClick={() => router.push(`/admin/clientes/${client.id}`)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Visualizar
                        </DropdownMenuItem>
                        {canEdit && (
                          <>
                            <DropdownMenuItem 
                              className="text-zinc-300 focus:text-white focus:bg-zinc-800 cursor-pointer"
                              onClick={() => router.push(`/admin/clientes/${client.id}/editar`)}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-400 focus:text-red-400 focus:bg-red-950 cursor-pointer"
                              onClick={() => setDeleteId(client.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 text-zinc-400">
                    <Building2 className="w-8 h-8 opacity-50" />
                    <p>Nenhum cliente encontrado</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden p-4 space-y-3">
        {filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <div key={client.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {client.logo_url ? (
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-zinc-700 shrink-0">
                      <img 
                        src={client.logo_url || "/placeholder.svg"} 
                        alt={client.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center shrink-0">
                      <span className="text-white font-bold text-lg">
                        {client.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-white truncate">{client.name}</p>
                    <p className="text-sm text-zinc-500">@{client.slug}</p>
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
                      onClick={() => router.push(`/admin/clientes/${client.id}`)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Visualizar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-zinc-300 focus:text-white focus:bg-zinc-800 cursor-pointer"
                      onClick={() => router.push(`/admin/clientes/${client.id}/editar`)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-400 focus:text-red-400 focus:bg-red-950 cursor-pointer"
                      onClick={() => setDeleteId(client.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <Badge variant="outline" className={planColors[client.plan] || planColors.START}>
                  {client.plan}
                </Badge>
                <Badge variant="outline" className={statusColors[client.status] || statusColors.ACTIVE}>
                  {client.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800 text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-zinc-400">
                    <Users className="w-4 h-4" />
                    <span>{client.user_count}</span>
                  </div>
                  <div className="flex items-center gap-1 text-zinc-400">
                    <Key className="w-4 h-4" />
                    <span>{client.access_count}</span>
                  </div>
                </div>
                <span className="text-zinc-500">{new Date(client.created_at).toLocaleDateString("pt-BR")}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center gap-2 text-zinc-400 py-12">
            <Building2 className="w-8 h-8 opacity-50" />
            <p>Nenhum cliente encontrado</p>
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita
              e todos os dados associados (usuários, acessos, avisos) serão removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
