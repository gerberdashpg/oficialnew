import { redirect } from "next/navigation"
import Link from "next/link"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ClientStepsManager } from "@/components/admin/client-steps-manager"
import { MousePointer2, ArrowRight, Users, Map } from "lucide-react"

export const dynamic = 'force-dynamic'

// Benefícios exatos por plano - SEM "Conta na Pro Growth"
const ALL_STEPS = [
  // START (8 itens)
  { id: "step_1", title: "Branding completo", plans: ["START", "PRO", "SCALE"] },
  { id: "step_2", title: "Produtos validados", plans: ["START", "PRO", "SCALE"] },
  { id: "step_3", title: "Checkout configurado", plans: ["START", "PRO", "SCALE"] },
  { id: "step_4", title: "Gateway de pagamento configurado", plans: ["START", "PRO", "SCALE"] },
  { id: "step_5", title: "Domínio configurado", plans: ["START", "PRO", "SCALE"] },
  { id: "step_6", title: "Fornecedor HyperSKU e DSers configurados e integrados", plans: ["START", "PRO", "SCALE"] },
  { id: "step_7", title: "Estrutura entregue (100%)", plans: ["START", "PRO", "SCALE"] },
  { id: "step_8", title: "Loja pronta para vender", plans: ["START", "PRO", "SCALE"] },
  // PRO adiciona (1 item)
  { id: "step_9", title: "Mockup de loja física", plans: ["PRO", "SCALE"] },
  // SCALE adiciona (6 itens)
  { id: "step_10", title: "Tema Growth Lançamento 2026", plans: ["SCALE"] },
  { id: "step_11", title: "Teaser personalizado de marca", plans: ["SCALE"] },
  { id: "step_12", title: "Instagram e Facebook estruturados", plans: ["SCALE"] },
  { id: "step_13", title: "Pixel Meta ADS configurado", plans: ["SCALE"] },
  { id: "step_14", title: "Criativos profissionais para tráfego", plans: ["SCALE"] },
  { id: "step_15", title: "Gestão de tráfego pago orientada à conversão", plans: ["SCALE"] },
]

async function getClients() {
  return sql`SELECT id, name, slug, plan, logo_url, whatsapp_link, drive_link FROM clients ORDER BY name ASC`
}

async function getAllProgress() {
  try {
    const result = await sql`
      SELECT client_id, step_id, status, completed_at, updated_at
      FROM client_step_progress
      ORDER BY client_id, step_id
    `
    return result
  } catch {
    return []
  }
}

export default async function AdminMapaPage() {
  const session = await getSession()

  const adminRoles = ["ADMIN", "Administrador", "Nexus Growth"]
  if (!session || !adminRoles.includes(session.role)) {
    redirect("/login")
  }

  const [clients, progress] = await Promise.all([
    getClients(),
    getAllProgress(),
  ])

  // Count clients by plan
  const planCounts = {
    START: clients.filter((c: any) => c.plan?.toUpperCase() === "START").length,
    PRO: clients.filter((c: any) => c.plan?.toUpperCase() === "PRO").length,
    SCALE: clients.filter((c: any) => c.plan?.toUpperCase() === "SCALE").length,
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <DashboardHeader
        title="Mapa da Operação"
        subtitle="Gerencie o conteúdo e progresso dos clientes por nível"
      />

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-[#0D0D12] border-zinc-800/60">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-500 text-sm">Total Clientes</p>
                <p className="text-2xl font-semibold text-white mt-1">{clients.length}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-violet-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0D0D12] border-zinc-800/60">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-500 text-sm">START PRO GROWTH</p>
                <p className="text-2xl font-semibold text-white mt-1">{planCounts.START}</p>
              </div>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">START</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0D0D12] border-zinc-800/60">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-500 text-sm">PRO VÉRTEBRA</p>
                <p className="text-2xl font-semibold text-white mt-1">{planCounts.PRO}</p>
              </div>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">PRO</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0D0D12] border-zinc-800/60">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-500 text-sm">SCALE VÉRTEBRA+</p>
                <p className="text-2xl font-semibold text-white mt-1">{planCounts.SCALE}</p>
              </div>
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">SCALE</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links Card */}
      <Card className="bg-gradient-to-br from-[#0c0c10] to-[#0d0b14] border-zinc-800/60">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <MousePointer2 className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <h3 className="text-white font-medium">Botões e Links</h3>
                <p className="text-zinc-500 text-sm">Configure os links de ação que aparecem nas páginas dos clientes</p>
              </div>
            </div>
            <Link href="/admin/botoes">
              <Button className="bg-violet-600 hover:bg-violet-700 text-white gap-2">
                Gerenciar Botões
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Client Steps Manager */}
      <Card className="bg-[#0D0D12] border-violet-500/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <Map className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <CardTitle className="text-[#F5F5F7]">Gerenciar Etapas dos Clientes</CardTitle>
              <CardDescription className="text-[rgba(245,245,247,0.52)]">
                Clique no status de cada etapa para alterar. As mudanças são salvas automaticamente.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ClientStepsManager 
            clients={clients as any} 
            allSteps={ALL_STEPS} 
            initialProgress={progress as any}
          />
        </CardContent>
      </Card>
    </div>
  )
}
