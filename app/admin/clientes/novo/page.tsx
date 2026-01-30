"use client"

import React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Building2, Loader2, User, Lock, Mail } from "lucide-react"
import Link from "next/link"

export default function NewClientPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    plan: "START",
    status: "ONBOARDING",
    drive_link: "",
    notes: "",
    // User credentials
    userName: "",
    userEmail: "",
    userPassword: "",
  })

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!formData.userEmail || !formData.userPassword) {
      setError("Email e senha do usuário são obrigatórios")
      setLoading(false)
      return
    }

    if (formData.userPassword.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Erro ao criar cliente")
        setLoading(false)
        return
      }

      router.push(`/admin/clientes/${data.client.id}`)
    } catch {
      setError("Erro de conexão. Tente novamente.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#07070A]">
      <div className="p-4 sm:p-6">
        <DashboardHeader
          title="Novo Cliente"
          subtitle="Cadastre um novo cliente na plataforma"
        />
      </div>

      <div className="px-4 sm:px-6 pb-8 max-w-2xl">
        <Link href="/admin/clientes">
          <Button variant="ghost" className="mb-6 text-[rgba(245,245,247,0.52)] hover:text-[#F5F5F7] hover:bg-[#141424] bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para clientes
          </Button>
        </Link>

        <Card className="card-premium border-[rgba(255,255,255,0.06)] bg-[#101018]">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#A855F7] to-[#7C3AED] flex items-center justify-center glow-purple">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-[#F5F5F7]">Informações do Cliente</CardTitle>
                <CardDescription className="text-[rgba(245,245,247,0.52)]">
                  Preencha os dados do novo cliente
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="bg-[rgba(239,68,68,0.1)] border-[rgba(239,68,68,0.3)] text-[#EF4444]">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Company Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#A855F7] uppercase tracking-wider">Dados da Empresa</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[rgba(245,245,247,0.72)]">Nome da Empresa</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          name: e.target.value,
                          slug: generateSlug(e.target.value),
                        })
                      }}
                      placeholder="Ex: TechCorp Solutions"
                      required
                      className="bg-[#141424] border-[rgba(255,255,255,0.06)] text-[#F5F5F7] placeholder:text-[rgba(245,245,247,0.32)] focus:border-[#A855F7] focus:ring-[rgba(168,85,247,0.15)] rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug" className="text-[rgba(245,245,247,0.72)]">Slug (URL)</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="techcorp"
                      required
                      className="bg-[#141424] border-[rgba(255,255,255,0.06)] text-[#F5F5F7] placeholder:text-[rgba(245,245,247,0.32)] focus:border-[#A855F7] focus:ring-[rgba(168,85,247,0.15)] rounded-xl"
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
                  <Label htmlFor="drive_link" className="text-[rgba(245,245,247,0.72)]">Link do Google Drive (opcional)</Label>
                  <Input
                    id="drive_link"
                    value={formData.drive_link}
                    onChange={(e) => setFormData({ ...formData, drive_link: e.target.value })}
                    placeholder="https://drive.google.com/..."
                    className="bg-[#141424] border-[rgba(255,255,255,0.06)] text-[#F5F5F7] placeholder:text-[rgba(245,245,247,0.32)] focus:border-[#A855F7] focus:ring-[rgba(168,85,247,0.15)] rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-[rgba(245,245,247,0.72)]">Notas (opcional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Observações sobre o cliente..."
                    rows={3}
                    className="bg-[#141424] border-[rgba(255,255,255,0.06)] text-[#F5F5F7] placeholder:text-[rgba(245,245,247,0.32)] focus:border-[#A855F7] focus:ring-[rgba(168,85,247,0.15)] resize-none rounded-xl"
                  />
                </div>
              </div>

              {/* User Credentials */}
              <div className="space-y-4 pt-4 border-t border-[rgba(255,255,255,0.06)]">
                <h3 className="text-sm font-semibold text-[#A855F7] uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Credenciais de Acesso
                </h3>
                <p className="text-sm text-[rgba(245,245,247,0.52)]">
                  Defina o email e senha do usuário administrador do cliente
                </p>
                
                <div className="space-y-2">
                  <Label htmlFor="userName" className="text-[rgba(245,245,247,0.72)]">Nome do Usuário</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(245,245,247,0.32)]" />
                    <Input
                      id="userName"
                      value={formData.userName}
                      onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                      placeholder="Ex: João Silva"
                      required
                      className="pl-10 bg-[#141424] border-[rgba(255,255,255,0.06)] text-[#F5F5F7] placeholder:text-[rgba(245,245,247,0.32)] focus:border-[#A855F7] focus:ring-[rgba(168,85,247,0.15)] rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userEmail" className="text-[rgba(245,245,247,0.72)]">Email de Acesso</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(245,245,247,0.32)]" />
                    <Input
                      id="userEmail"
                      type="email"
                      value={formData.userEmail}
                      onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                      placeholder="usuario@empresa.com"
                      required
                      className="pl-10 bg-[#141424] border-[rgba(255,255,255,0.06)] text-[#F5F5F7] placeholder:text-[rgba(245,245,247,0.32)] focus:border-[#A855F7] focus:ring-[rgba(168,85,247,0.15)] rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userPassword" className="text-[rgba(245,245,247,0.72)]">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(245,245,247,0.32)]" />
                    <Input
                      id="userPassword"
                      type="password"
                      value={formData.userPassword}
                      onChange={(e) => setFormData({ ...formData, userPassword: e.target.value })}
                      placeholder="Mínimo 6 caracteres"
                      required
                      className="pl-10 bg-[#141424] border-[rgba(255,255,255,0.06)] text-[#F5F5F7] placeholder:text-[rgba(245,245,247,0.32)] focus:border-[#A855F7] focus:ring-[rgba(168,85,247,0.15)] rounded-xl"
                    />
                  </div>
                  <p className="text-xs text-[rgba(245,245,247,0.42)]">
                    O usuário usará este email e senha para fazer login no dashboard
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                <Link href="/admin/clientes" className="sm:order-1">
                  <Button type="button" variant="outline" className="w-full border-[rgba(255,255,255,0.06)] text-[rgba(245,245,247,0.72)] hover:bg-[#141424] hover:text-[#F5F5F7] hover:border-[rgba(168,85,247,0.3)] h-12 rounded-xl bg-transparent transition-all duration-200">
                    Cancelar
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 sm:order-2 bg-gradient-to-r from-[#A855F7] to-[#7C3AED] hover:from-[#9333EA] hover:to-[#6D28D9] text-white font-semibold h-12 rounded-xl shadow-lg shadow-[rgba(168,85,247,0.25)] transition-all duration-200 active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    "Criar Cliente"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
