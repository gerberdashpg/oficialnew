"use client"

import React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Lock, LogOut, Shield, CheckCircle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ProfileViewProps {
  user: {
    id: string
    name: string
    email: string
    role: string
    created_at: string
    avatar_url?: string
  }
  client: {
    name: string
    slug: string
    plan: string
    status: string
  }
  slug: string
}

export function ProfileView({ user, client, slug }: ProfileViewProps) {
  const router = useRouter()
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")
    setPasswordSuccess(false)

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("As senhas não coincidem")
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("A nova senha deve ter no mínimo 6 caracteres")
      return
    }

    setChangingPassword(true)

    try {
      const res = await fetch("/api/client/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      })

      if (res.ok) {
        setPasswordSuccess(true)
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
        setTimeout(() => {
          setIsPasswordDialogOpen(false)
          setPasswordSuccess(false)
        }, 2000)
      } else {
        const data = await res.json()
        setPasswordError(data.error || "Erro ao alterar senha")
      }
    } catch {
      setPasswordError("Erro de conexão. Tente novamente.")
    } finally {
      setChangingPassword(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  const planColors: Record<string, string> = {
    START: "bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/30",
    PRO: "bg-[#A855F7]/20 text-[#A855F7] border-[#A855F7]/30",
    SCALE: "bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/30",
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-[#0D0D12] border-purple-500/20 rounded-2xl">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#A855F7] to-[#6D28D9] flex items-center justify-center shrink-0 overflow-hidden">
                {user.avatar_url ? (
                  <Image
                    src={user.avatar_url || "/placeholder.svg"}
                    alt={user.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-white" />
                )}
              </div>
              <div>
                <CardTitle className="text-[#F5F5F7]">{user.name}</CardTitle>
                <CardDescription className="text-[rgba(245,245,247,0.52)]">
                  Membro desde {formatDate(user.created_at)}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-[#171723] rounded-xl border border-[rgba(255,255,255,0.06)]">
              <Mail className="w-5 h-5 text-[rgba(245,245,247,0.52)] shrink-0" />
              <div className="min-w-0">
                <p className="text-sm text-[rgba(245,245,247,0.52)]">Email</p>
                <p className="text-[#F5F5F7] truncate">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-[#171723] rounded-xl border border-[rgba(255,255,255,0.06)]">
              <Shield className="w-5 h-5 text-[rgba(245,245,247,0.52)] shrink-0" />
              <div>
                <p className="text-sm text-[rgba(245,245,247,0.52)]">Tipo de conta</p>
                <p className="text-[#F5F5F7]">{user.role === "ADMIN" ? "Administrador" : "Cliente"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0D0D12] border-purple-500/20 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-[#F5F5F7]">Informações da Conta</CardTitle>
            <CardDescription className="text-[rgba(245,245,247,0.52)]">
              Dados do seu plano
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-[#171723] rounded-xl border border-[rgba(255,255,255,0.06)]">
              <p className="text-sm text-[rgba(245,245,247,0.52)]">Loja</p>
              <p className="text-[#F5F5F7] font-medium">{client.name}</p>
              <p className="text-sm text-[rgba(245,245,247,0.52)] mt-1">/{client.slug}</p>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#171723] rounded-xl border border-[rgba(255,255,255,0.06)]">
              <div>
                <p className="text-sm text-[rgba(245,245,247,0.52)]">Plano</p>
                <p className="text-[#F5F5F7] font-medium">{client.plan}</p>
              </div>
              <Badge variant="outline" className={`${planColors[client.plan] || planColors.START} rounded-full`}>
                {client.plan}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#171723] rounded-xl border border-[rgba(255,255,255,0.06)]">
              <div>
                <p className="text-sm text-[rgba(245,245,247,0.52)]">Status</p>
                <p className="text-[#F5F5F7] font-medium">
                  {client.status === "ACTIVE" ? "Ativa" : client.status === "PAUSED" ? "Pausada" : "Em otimização"}
                </p>
              </div>
              <Badge
                variant="outline"
                className={`rounded-full ${
                  client.status === "ACTIVE"
                    ? "bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/30"
                    : client.status === "PAUSED"
                      ? "bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/30"
                      : "bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/30"
                }`}
              >
                {client.status === "ACTIVE" ? "Ativa" : client.status === "PAUSED" ? "Pausada" : "Otimizando"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#0D0D12] border-purple-500/20 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-[#F5F5F7]">Segurança</CardTitle>
          <CardDescription className="text-[rgba(245,245,247,0.52)]">
            Gerencie suas credenciais de acesso
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            onClick={() => setIsPasswordDialogOpen(true)}
            className="bg-transparent border-[rgba(255,255,255,0.08)] text-[rgba(245,245,247,0.72)] hover:bg-[#171723] hover:text-[#F5F5F7] rounded-xl"
          >
            <Lock className="w-4 h-4 mr-2" />
            Alterar senha
          </Button>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/10 rounded-xl bg-transparent"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair da conta
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="bg-[#0D0D12] border-purple-500/20 rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#F5F5F7]">Alterar senha</DialogTitle>
            <DialogDescription className="text-[rgba(245,245,247,0.52)]">
              Digite sua senha atual e a nova senha
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4 mt-4">
            {passwordError && (
              <div className="p-3 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-xl text-[#EF4444] text-sm">
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="p-3 bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-xl text-[#22C55E] text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Senha alterada com sucesso!
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-[rgba(245,245,247,0.72)]">Senha atual</Label>
              <Input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                required
                className="bg-[#171723] border-[rgba(255,255,255,0.06)] text-[#F5F5F7] focus:border-[#A855F7] rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[rgba(245,245,247,0.72)]">Nova senha</Label>
              <Input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                required
                className="bg-[#171723] border-[rgba(255,255,255,0.06)] text-[#F5F5F7] focus:border-[#A855F7] rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[rgba(245,245,247,0.72)]">Confirmar nova senha</Label>
              <Input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                required
                className="bg-[#171723] border-[rgba(255,255,255,0.06)] text-[#F5F5F7] focus:border-[#A855F7] rounded-xl"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPasswordDialogOpen(false)}
                className="border-[rgba(255,255,255,0.08)] text-[rgba(245,245,247,0.72)] hover:bg-[#171723] rounded-xl order-2 sm:order-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={changingPassword}
                className="bg-[#A855F7] hover:bg-[#9333EA] text-white rounded-xl order-1 sm:order-2"
              >
                {changingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Alterando...
                  </>
                ) : (
                  "Alterar senha"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
