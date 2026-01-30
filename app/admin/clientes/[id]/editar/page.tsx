"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Building2, Loader2, Trash2 } from "lucide-react"
import Link from "next/link"

interface Client {
  id: string
  name: string
  slug: string
  plan: string
  status: string
  drive_link: string | null
  notes: string | null
}

export default function EditClientPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState<Client | null>(null)

  useEffect(() => {
    async function loadClient() {
      try {
        const res = await fetch(`/api/admin/clients/${id}`)
        if (res.ok) {
          const data = await res.json()
          setFormData(data.client)
        } else {
          setError("Cliente não encontrado")
        }
      } catch {
        setError("Erro ao carregar cliente")
      } finally {
        setLoading(false)
      }
    }
    loadClient()
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData) return

    setError("")
    setSaving(true)

    try {
      const res = await fetch(`/api/admin/clients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Erro ao atualizar cliente")
        setSaving(false)
        return
      }

      router.push(`/admin/clientes/${id}`)
    } catch {
      setError("Erro de conexão. Tente novamente.")
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/clients/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        router.push("/admin/clientes")
      } else {
        const data = await res.json()
        setError(data.error || "Erro ao excluir cliente")
        setDeleting(false)
      }
    } catch {
      setError("Erro de conexão. Tente novamente.")
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07070A] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#A855F7]" />
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-[#07070A] p-6">
        <Alert variant="destructive">
          <AlertDescription>{error || "Cliente não encontrado"}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#07070A]">
      <DashboardHeader
        title="Editar Cliente"
        subtitle={formData.name}
      />

      <div className="p-6 max-w-2xl">
        <Link href={`/admin/clientes/${id}`}>
          <Button variant="ghost" className="mb-6 text-[rgba(245,245,247,0.52)] hover:text-[#F5F5F7] hover:bg-[#141424] bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para detalhes
          </Button>
        </Link>

        <Card className="card-premium border-[rgba(255,255,255,0.06)] bg-[#101018]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#A855F7] to-[#7C3AED] flex items-center justify-center glow-purple">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-[#F5F5F7]">Informações do Cliente</CardTitle>
                  <CardDescription className="text-[rgba(245,245,247,0.52)]">
                    Atualize os dados do cliente
                  </CardDescription>
                </div>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="bg-[rgba(239,68,68,0.15)] text-[#EF4444] border border-[rgba(239,68,68,0.3)] hover:bg-[rgba(239,68,68,0.25)]">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-[#101018] border-[rgba(255,255,255,0.06)]">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-[#F5F5F7]">Excluir Cliente</AlertDialogTitle>
                    <AlertDialogDescription className="text-[rgba(245,245,247,0.52)]">
                      Tem certeza que deseja excluir {formData.name}? Esta ação não pode ser desfeita e todos os dados associados (usuários, acessos, avisos) serão removidos.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-transparent border-[rgba(255,255,255,0.06)] text-[rgba(245,245,247,0.72)] hover:bg-[#141424]">
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      disabled={deleting}
                      className="bg-[#EF4444] text-white hover:bg-[#DC2626]"
                    >
                      {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Excluir"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="bg-[rgba(239,68,68,0.1)] border-[rgba(239,68,68,0.3)] text-[#EF4444]">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[rgba(245,245,247,0.72)]">Nome da Empresa</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-[#141424] border-[rgba(255,255,255,0.06)] text-[#F5F5F7] focus:border-[#A855F7] rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-[rgba(245,245,247,0.72)]">Slug (URL)</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    className="bg-[#141424] border-[rgba(255,255,255,0.06)] text-[#F5F5F7] focus:border-[#A855F7] rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plan" className="text-[rgba(245,245,247,0.72)]">Plano</Label>
                  <Select
                    value={formData.plan}
                    onValueChange={(value) => setFormData({ ...formData, plan: value })}
                  >
                    <SelectTrigger className="bg-[#141424] border-[rgba(255,255,255,0.06)] text-[#F5F5F7] rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#101018] border-[rgba(255,255,255,0.06)]">
                      <SelectItem value="START" className="text-[rgba(245,245,247,0.72)] focus:text-[#F5F5F7] focus:bg-[#141424]">Start</SelectItem>
                      <SelectItem value="PRO" className="text-[rgba(245,245,247,0.72)] focus:text-[#F5F5F7] focus:bg-[#141424]">Pro</SelectItem>
                      <SelectItem value="SCALE" className="text-[rgba(245,245,247,0.72)] focus:text-[#F5F5F7] focus:bg-[#141424]">Scale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="text-[rgba(245,245,247,0.72)]">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger className="bg-[#141424] border-[rgba(255,255,255,0.06)] text-[#F5F5F7] rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#101018] border-[rgba(255,255,255,0.06)]">
                      <SelectItem value="ONBOARDING" className="text-[rgba(245,245,247,0.72)] focus:text-[#F5F5F7] focus:bg-[#141424]">Onboarding</SelectItem>
                      <SelectItem value="ACTIVE" className="text-[rgba(245,245,247,0.72)] focus:text-[#F5F5F7] focus:bg-[#141424]">Ativo</SelectItem>
                      <SelectItem value="PAUSED" className="text-[rgba(245,245,247,0.72)] focus:text-[#F5F5F7] focus:bg-[#141424]">Pausado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="drive_link" className="text-[rgba(245,245,247,0.72)]">Link do Google Drive</Label>
                <Input
                  id="drive_link"
                  value={formData.drive_link || ""}
                  onChange={(e) => setFormData({ ...formData, drive_link: e.target.value || null })}
                  placeholder="https://drive.google.com/..."
                  className="bg-[#141424] border-[rgba(255,255,255,0.06)] text-[#F5F5F7] focus:border-[#A855F7] rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-[rgba(245,245,247,0.72)]">Notas</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value || null })}
                  rows={3}
                  className="bg-[#141424] border-[rgba(255,255,255,0.06)] text-[#F5F5F7] focus:border-[#A855F7] resize-none rounded-xl"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-[#A855F7] to-[#7C3AED] hover:from-[#9333EA] hover:to-[#6D28D9] text-white font-semibold h-12 rounded-xl"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar Alterações"
                  )}
                </Button>
                <Link href={`/admin/clientes/${id}`}>
                  <Button type="button" variant="outline" className="border-[rgba(255,255,255,0.06)] text-[rgba(245,245,247,0.72)] hover:bg-[#141424] h-12 rounded-xl bg-transparent">
                    Cancelar
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
