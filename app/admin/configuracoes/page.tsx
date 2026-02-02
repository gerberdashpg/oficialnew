import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Settings, Shield, Bell, Database, Globe } from "lucide-react"

export default async function AdminSettingsPage() {
  const session = await getSession()

  const adminRoles = ["ADMIN", "Administrador", "Nexus Growth"]
  if (!session || !adminRoles.includes(session.role)) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen">
      <div className="p-4 sm:p-6">
        <DashboardHeader
          title="Configurações"
          subtitle="Gerencie as configurações do sistema"
        />
      </div>

      <div className="px-4 sm:px-6 pb-6 space-y-6 max-w-4xl">
        {/* General Settings */}
        <Card className="bg-[#0D0D12] border-purple-500/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Settings className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-white">Configurações Gerais</CardTitle>
                <CardDescription className="text-[rgba(245,245,247,0.6)]">
                  Configurações básicas da plataforma
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[rgba(245,245,247,0.8)]">Nome da Plataforma</Label>
              <Input
                defaultValue="PG Dash"
                className="bg-[#141424] border-purple-500/20 text-white max-w-md"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[rgba(245,245,247,0.8)]">URL do Sistema</Label>
              <Input
                defaultValue="https://dashboard.exemplo.com"
                className="bg-[#141424] border-purple-500/20 text-white max-w-md"
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-[#0D0D12] border-purple-500/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-white">Segurança</CardTitle>
                <CardDescription className="text-[rgba(245,245,247,0.6)]">
                  Configurações de segurança e acesso
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Autenticação em dois fatores</p>
                <p className="text-sm text-[rgba(245,245,247,0.6)]">Exigir 2FA para todos os usuários admin</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Expiração de sessão</p>
                <p className="text-sm text-[rgba(245,245,247,0.6)]">Deslogar usuários após 24 horas de inatividade</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Log de acessos</p>
                <p className="text-sm text-[rgba(245,245,247,0.6)]">Registrar todos os acessos ao sistema</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-[#0D0D12] border-purple-500/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Bell className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-white">Notificações</CardTitle>
                <CardDescription className="text-[rgba(245,245,247,0.6)]">
                  Configurações de notificações por email
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Notificar novos clientes</p>
                <p className="text-sm text-[rgba(245,245,247,0.6)]">Receber email quando um novo cliente for cadastrado</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Alertas de segurança</p>
                <p className="text-sm text-[rgba(245,245,247,0.6)]">Receber alertas de tentativas de login suspeitas</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Resumo semanal</p>
                <p className="text-sm text-[rgba(245,245,247,0.6)]">Receber relatório semanal por email</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Database Info */}
        <Card className="bg-[#0D0D12] border-purple-500/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Database className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <CardTitle className="text-white">Banco de Dados</CardTitle>
                <CardDescription className="text-[rgba(245,245,247,0.6)]">
                  Informações do banco de dados
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-900/50 rounded-xl border border-purple-500/20">
                <p className="text-2xl font-bold text-white">Neon</p>
                <p className="text-sm text-[rgba(245,245,247,0.6)]">Provider</p>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-xl border border-purple-500/20">
                <p className="text-2xl font-bold text-emerald-400">Online</p>
                <p className="text-sm text-[rgba(245,245,247,0.6)]">Status</p>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-xl border border-purple-500/20">
                <p className="text-2xl font-bold text-white">PostgreSQL</p>
                <p className="text-sm text-[rgba(245,245,247,0.6)]">Engine</p>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-xl border border-purple-500/20">
                <p className="text-2xl font-bold text-white">v16</p>
                <p className="text-sm text-[rgba(245,245,247,0.6)]">Versão</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Settings */}
        <Card className="bg-[#0D0D12] border-purple-500/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Globe className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <CardTitle className="text-white">API</CardTitle>
                <CardDescription className="text-[rgba(245,245,247,0.6)]">
                  Configurações da API e webhooks
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">API pública</p>
                <p className="text-sm text-[rgba(245,245,247,0.6)]">Permitir acesso via API externa</p>
              </div>
              <Switch />
            </div>
            <div className="space-y-2">
              <Label className="text-[rgba(245,245,247,0.8)]">Webhook URL</Label>
              <Input
                placeholder="https://seu-webhook.com/endpoint"
                className="bg-[#141424] border-purple-500/20 text-white max-w-md"
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8">
            Salvar Alterações
          </Button>
        </div>
      </div>
    </div>
  )
}
