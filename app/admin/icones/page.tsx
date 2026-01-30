"use client"

import React from "react"

import { useState, useRef } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Key, Upload, Trash2, ImageIcon, Loader2, Building2, Users } from "lucide-react"
import useSWR from "swr"
import { toast } from "sonner"

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface Client {
  id: string
  name: string
  slug: string
  logo_url?: string | null
}

interface User {
  id: string
  name: string
  email: string
  role: string
  avatar_url?: string | null
}

interface Access {
  id: string
  client_id: string
  service_name: string
  service_url: string | null
  login: string
  password: string
  icon_url: string | null
}

interface ClientsResponse {
  clients: Client[]
}

interface UsersResponse {
  users: User[]
}

interface AccessesResponse {
  accesses: Access[]
}

export default function IconesPage() {
  const [selectedClientId, setSelectedClientId] = useState<string>("")
  const [uploadingId, setUploadingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("acessos")
  
  const { data: clientsData, mutate: mutateClients } = useSWR<ClientsResponse>("/api/admin/clients", fetcher)
  const { data: usersData, mutate: mutateUsers } = useSWR<UsersResponse>("/api/admin/users", fetcher)
  const { data: accessesData, mutate: mutateAccesses } = useSWR<AccessesResponse>(
    selectedClientId ? `/api/admin/accesses?client_id=${selectedClientId}` : null,
    fetcher
  )
  
  const clients = clientsData?.clients || []
  const users = usersData?.users || []
  const accesses = accessesData?.accesses || []

  // Handle access icon upload
  const handleAccessIconUpload = async (e: React.ChangeEvent<HTMLInputElement>, accessId: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione uma imagem")
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 2MB")
      return
    }

    setUploadingId(accessId)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("accessId", accessId)

      const response = await fetch("/api/admin/accesses/upload-icon", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Erro ao fazer upload")

      toast.success("Ícone atualizado com sucesso!")
      mutateAccesses()
    } catch {
      toast.error("Erro ao fazer upload do ícone")
    } finally {
      setUploadingId(null)
    }
  }

  // Handle avatar upload for clients/users
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>, entityType: "client" | "user", entityId: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione uma imagem")
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 2MB")
      return
    }

    setUploadingId(`${entityType}-${entityId}`)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("entityType", entityType)
      formData.append("entityId", entityId)

      const response = await fetch("/api/admin/avatars/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Erro ao fazer upload")

      toast.success("Avatar atualizado com sucesso!")
      if (entityType === "client") {
        mutateClients()
      } else {
        mutateUsers()
      }
    } catch {
      toast.error("Erro ao fazer upload do avatar")
    } finally {
      setUploadingId(null)
    }
  }

  // Handle delete icon
  const handleDeleteIcon = async (accessId: string) => {
    setDeletingId(accessId)

    try {
      const response = await fetch(`/api/admin/accesses/upload-icon?accessId=${accessId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Erro ao remover ícone")

      toast.success("Ícone removido com sucesso!")
      mutateAccesses()
    } catch {
      toast.error("Erro ao remover ícone")
    } finally {
      setDeletingId(null)
    }
  }

  // Handle delete avatar
  const handleDeleteAvatar = async (entityType: "client" | "user", entityId: string) => {
    setDeletingId(`${entityType}-${entityId}`)

    try {
      const response = await fetch("/api/admin/avatars/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entityType, entityId }),
      })

      if (!response.ok) throw new Error("Erro ao remover avatar")

      toast.success("Avatar removido com sucesso!")
      if (entityType === "client") {
        mutateClients()
      } else {
        mutateUsers()
      }
    } catch {
      toast.error("Erro ao remover avatar")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <DashboardHeader
        title="Ícones e Avatares"
        subtitle="Gerencie os ícones de acessos e avatares de clientes e usuários"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-[#171723] border border-zinc-800">
          <TabsTrigger value="acessos" className="text-zinc-400 data-[state=active]:bg-violet-600 data-[state=active]:text-white">
            <Key className="w-4 h-4 mr-2" />
            Acessos
          </TabsTrigger>
          <TabsTrigger value="clientes" className="text-zinc-400 data-[state=active]:bg-violet-600 data-[state=active]:text-white">
            <Building2 className="w-4 h-4 mr-2" />
            Clientes
          </TabsTrigger>
          <TabsTrigger value="usuarios" className="text-zinc-400 data-[state=active]:bg-violet-600 data-[state=active]:text-white">
            <Users className="w-4 h-4 mr-2" />
            Usuários
          </TabsTrigger>
        </TabsList>

        {/* Acessos Tab */}
        <TabsContent value="acessos" className="space-y-6">
          <Card className="bg-[#0D0D12] border-zinc-800/60">
            <CardHeader>
              <CardTitle className="text-[#F5F5F7]">Selecionar Cliente</CardTitle>
              <CardDescription className="text-zinc-500">
                Escolha um cliente para gerenciar os ícones dos acessos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                <SelectTrigger className="w-full md:w-80 bg-[#171723] border-zinc-800 text-[#F5F5F7]">
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent className="bg-[#171723] border-zinc-800">
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id} className="text-[#F5F5F7]">
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedClientId && (
            <Card className="bg-[#0D0D12] border-zinc-800/60">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <CardTitle className="text-[#F5F5F7]">Acessos do Cliente</CardTitle>
                    <CardDescription className="text-zinc-500">
                      Clique em Alterar para fazer upload de um ícone personalizado
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {accesses.length === 0 ? (
                  <div className="text-center py-12 text-zinc-500">
                    <Key className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum acesso cadastrado para este cliente</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {accesses.map((access) => (
                      <div
                        key={access.id}
                        className="bg-[#171723] border border-zinc-800 rounded-xl p-4 space-y-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 rounded-xl bg-[#0D0D12] border border-zinc-800 flex items-center justify-center overflow-hidden">
                            {access.icon_url ? (
                              <img
                                src={access.icon_url || "/placeholder.svg"}
                                alt={access.service_name}
                                className="w-full h-full object-cover cursor-pointer"
                                onClick={() => setPreviewUrl(access.icon_url)}
                              />
                            ) : (
                              <Key className="w-6 h-6 text-violet-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-[#F5F5F7] truncate">{access.service_name}</h4>
                            <p className="text-sm text-zinc-500 truncate">{access.service_url}</p>
                            {access.icon_url ? (
                              <Badge className="mt-1 bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                                Personalizado
                              </Badge>
                            ) : (
                              <Badge className="mt-1 bg-zinc-500/20 text-zinc-400 border-zinc-500/30 text-xs">
                                Padrão
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Label className="flex-1">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleAccessIconUpload(e, access.id)}
                              disabled={uploadingId === access.id}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white gap-2"
                              disabled={uploadingId === access.id}
                              asChild
                            >
                              <span>
                                {uploadingId === access.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Upload className="w-4 h-4" />
                                )}
                                {uploadingId === access.id ? "Enviando..." : "Alterar"}
                              </span>
                            </Button>
                          </Label>

                          {access.icon_url && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                              onClick={() => handleDeleteIcon(access.id)}
                              disabled={deletingId === access.id}
                            >
                              {deletingId === access.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Clientes Tab */}
        <TabsContent value="clientes" className="space-y-6">
          <Card className="bg-[#0D0D12] border-zinc-800/60">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <CardTitle className="text-[#F5F5F7]">Avatares dos Clientes</CardTitle>
                  <CardDescription className="text-zinc-500">
                    Personalize o avatar/logo de cada cliente
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {clients.length === 0 ? (
                <div className="text-center py-12 text-zinc-500">
                  <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum cliente cadastrado</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {clients.map((client) => (
                    <div
                      key={client.id}
                      className="bg-[#171723] border border-zinc-800 rounded-xl p-4 space-y-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-xl bg-[#0D0D12] border border-zinc-800 flex items-center justify-center overflow-hidden">
                          {client.logo_url ? (
                            <img
                              src={client.logo_url || "/placeholder.svg"}
                              alt={client.name}
                              className="w-full h-full object-cover cursor-pointer"
                              onClick={() => setPreviewUrl(client.logo_url || null)}
                            />
                          ) : (
                            <span className="text-2xl font-bold text-violet-400">
                              {client.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-[#F5F5F7] truncate">{client.name}</h4>
                          <p className="text-sm text-zinc-500 truncate">@{client.slug}</p>
                          {client.logo_url ? (
                            <Badge className="mt-1 bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                              Avatar personalizado
                            </Badge>
                          ) : (
                            <Badge className="mt-1 bg-zinc-500/20 text-zinc-400 border-zinc-500/30 text-xs">
                              Avatar padrão
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Label className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleAvatarUpload(e, "client", client.id)}
                            disabled={uploadingId === `client-${client.id}`}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white gap-2"
                            disabled={uploadingId === `client-${client.id}`}
                            asChild
                          >
                            <span>
                              {uploadingId === `client-${client.id}` ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Upload className="w-4 h-4" />
                              )}
                              {uploadingId === `client-${client.id}` ? "Enviando..." : "Alterar"}
                            </span>
                          </Button>
                        </Label>

                        {client.logo_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                            onClick={() => handleDeleteAvatar("client", client.id)}
                            disabled={deletingId === `client-${client.id}`}
                          >
                            {deletingId === `client-${client.id}` ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Usuarios Tab */}
        <TabsContent value="usuarios" className="space-y-6">
          <Card className="bg-[#0D0D12] border-zinc-800/60">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <CardTitle className="text-[#F5F5F7]">Avatares dos Usuários</CardTitle>
                  <CardDescription className="text-zinc-500">
                    Personalize o avatar de cada usuário/admin
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <div className="text-center py-12 text-zinc-500">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum usuário cadastrado</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="bg-[#171723] border border-zinc-800 rounded-xl p-4 space-y-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-full bg-[#0D0D12] border border-zinc-800 flex items-center justify-center overflow-hidden">
                          {user.avatar_url ? (
                            <img
                              src={user.avatar_url || "/placeholder.svg"}
                              alt={user.name}
                              className="w-full h-full object-cover cursor-pointer"
                              onClick={() => setPreviewUrl(user.avatar_url || null)}
                            />
                          ) : (
                            <span className="text-2xl font-bold text-violet-400">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-[#F5F5F7] truncate">{user.name}</h4>
                          <p className="text-sm text-zinc-500 truncate">{user.email}</p>
                          <Badge className={`mt-1 text-xs ${user.role === "ADMIN" ? "bg-violet-500/20 text-violet-400 border-violet-500/30" : "bg-blue-500/20 text-blue-400 border-blue-500/30"}`}>
                            {user.role}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Label className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleAvatarUpload(e, "user", user.id)}
                            disabled={uploadingId === `user-${user.id}`}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white gap-2"
                            disabled={uploadingId === `user-${user.id}`}
                            asChild
                          >
                            <span>
                              {uploadingId === `user-${user.id}` ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Upload className="w-4 h-4" />
                              )}
                              {uploadingId === `user-${user.id}` ? "Enviando..." : "Alterar"}
                            </span>
                          </Button>
                        </Label>

                        {user.avatar_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                            onClick={() => handleDeleteAvatar("user", user.id)}
                            disabled={deletingId === `user-${user.id}`}
                          >
                            {deletingId === `user-${user.id}` ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Image Preview Dialog */}
      <Dialog open={!!previewUrl} onOpenChange={() => setPreviewUrl(null)}>
        <DialogContent className="bg-[#0D0D12] border-zinc-800 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#F5F5F7]">Preview</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-4">
            {previewUrl && (
              <img
                src={previewUrl || "/placeholder.svg"}
                alt="Preview"
                className="max-w-full max-h-64 rounded-lg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
