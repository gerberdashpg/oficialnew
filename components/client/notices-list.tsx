"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, AlertTriangle, Info, CheckCircle } from "lucide-react"

interface Notice {
  id: string
  title: string
  message: string
  priority: string
  created_at: string
}

interface NoticesListProps {
  notices: Notice[]
}

const priorityConfig = {
  urgent: {
    label: "Urgente",
    icon: AlertTriangle,
    color: "bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/30",
    iconColor: "text-[#EF4444]",
  },
  high: {
    label: "Alta",
    icon: AlertTriangle,
    color: "bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/30",
    iconColor: "text-[#F59E0B]",
  },
  normal: {
    label: "Normal",
    icon: Info,
    color: "bg-[#A855F7]/20 text-[#A855F7] border-[#A855F7]/30",
    iconColor: "text-[#A855F7]",
  },
  low: {
    label: "Baixa",
    icon: CheckCircle,
    color: "bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/30",
    iconColor: "text-[#22C55E]",
  },
}

export function NoticesList({ notices }: NoticesListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  if (notices.length === 0) {
    return (
      <Card className="bg-[#0D0D12] border-purple-500/20 rounded-2xl">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-[#171723] flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-[rgba(245,245,247,0.52)]" />
          </div>
          <h3 className="text-lg font-medium text-[#F5F5F7] mb-2">Nenhum aviso disponível</h3>
          <p className="text-[rgba(245,245,247,0.52)] text-center max-w-md">
            Você será notificado quando houver novas atualizações ou comunicados importantes.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {notices.map((notice) => {
        const config = priorityConfig[notice.priority as keyof typeof priorityConfig] || priorityConfig.normal
        const IconComponent = config.icon

        return (
          <Card
            key={notice.id}
            className="bg-[#0D0D12] border-purple-500/20 rounded-2xl hover:border-[rgba(168,85,247,0.35)] transition-all duration-300"
          >
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                <div className={`w-10 h-10 rounded-xl bg-[#171723] flex items-center justify-center shrink-0 ${config.iconColor}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <CardTitle className="text-[#F5F5F7] text-lg">{notice.title}</CardTitle>
                    <Badge variant="outline" className={`${config.color} rounded-full text-xs`}>
                      {config.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-[rgba(245,245,247,0.52)] mt-1">{formatDate(notice.created_at)}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-[rgba(245,245,247,0.72)] whitespace-pre-wrap leading-relaxed">{notice.message}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
