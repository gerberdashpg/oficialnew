import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Clock, Info, AlertTriangle, CheckCircle } from "lucide-react"

async function getNotices(clientId: string) {
  return sql`
    SELECT * FROM notices 
    WHERE client_id = ${clientId} 
    ORDER BY created_at DESC
  `
}

export default async function AvisosPage() {
  const session = await getSession()

  if (!session || !session.client_id) {
    redirect("/login")
  }

  const notices = await getNotices(session.client_id)

  return (
    <div className="min-h-screen bg-[#07070A]">
      <DashboardHeader
        title="Avisos"
        subtitle="Comunicados e atualizações importantes"
        user={session}
      />

      <div className="p-6">
        {notices.length > 0 ? (
          <div className="space-y-4">
            {notices.map((notice: {
              id: string
              title: string
              message: string
              priority?: string
              created_at: string
            }, index: number) => {
              const isUrgent = notice.priority === "urgent" || notice.priority === "high"
              const isSuccess = notice.title.toLowerCase().includes("bem-vindo") || 
                               notice.title.toLowerCase().includes("ativ")
              
              const IconComponent = isUrgent ? AlertTriangle : isSuccess ? CheckCircle : Info
              const colorClass = isUrgent 
                ? "text-amber-400 bg-[rgba(245,158,11,0.15)] border-[rgba(245,158,11,0.3)]" 
                : isSuccess 
                  ? "text-emerald-400 bg-[rgba(34,197,94,0.15)] border-[rgba(34,197,94,0.3)]"
                  : "text-[#A855F7] bg-[rgba(168,85,247,0.15)] border-[rgba(168,85,247,0.3)]"

              return (
                <Card 
                  key={notice.id} 
                  className={`card-premium border-[rgba(255,255,255,0.06)] bg-[#101018] hover:border-[rgba(168,85,247,0.3)] transition-all duration-200 ${index === 0 ? "ring-1 ring-[rgba(168,85,247,0.3)]" : ""}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-[#F5F5F7] text-lg">
                            {notice.title}
                          </CardTitle>
                          <CardDescription className="text-[rgba(245,245,247,0.42)] flex items-center gap-2 mt-1">
                            <Clock className="w-3 h-3" />
                            {new Date(notice.created_at).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })}
                          </CardDescription>
                        </div>
                      </div>
                      {index === 0 && (
                        <Badge className="bg-[rgba(168,85,247,0.2)] text-[#A855F7] border-[rgba(168,85,247,0.3)] rounded-full">
                          Novo
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[rgba(245,245,247,0.72)] leading-relaxed pl-14">
                      {notice.message}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="card-premium border-[rgba(255,255,255,0.06)] bg-[#101018]">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full bg-[#141424] flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-[rgba(245,245,247,0.42)]" />
              </div>
              <h3 className="text-lg font-medium text-[#F5F5F7] mb-2">Nenhum aviso disponível</h3>
              <p className="text-[rgba(245,245,247,0.52)] text-center max-w-md">
                Você será notificado quando houver novas atualizações ou comunicados importantes.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
