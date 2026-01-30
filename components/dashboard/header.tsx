"use client"

import { Badge } from "@/components/ui/badge"

interface HeaderProps {
  title: string
  subtitle?: string
  user?: {
    role: "ADMIN" | "CLIENTE"
    client?: {
      plan: string
      status: string
    }
  }
}

const planColors: Record<string, string> = {
  START: "bg-[rgba(245,245,247,0.1)] text-[rgba(245,245,247,0.72)] border-[rgba(255,255,255,0.1)]",
  PRO: "bg-[rgba(168,85,247,0.15)] text-[#A855F7] border-[rgba(168,85,247,0.3)]",
  SCALE: "bg-gradient-to-r from-[rgba(168,85,247,0.2)] to-[rgba(124,58,237,0.15)] text-[#A855F7] border-[rgba(168,85,247,0.4)]",
}

const statusLabels: Record<string, string> = {
  ACTIVE: "Ativa",
  PAUSED: "Pausada",
  ONBOARDING: "Onboarding",
}

const statusColors: Record<string, string> = {
  ACTIVE: "bg-[rgba(34,197,94,0.15)] text-[#22C55E] border-[rgba(34,197,94,0.3)]",
  PAUSED: "bg-[rgba(245,158,11,0.15)] text-[#F59E0B] border-[rgba(245,158,11,0.3)]",
  ONBOARDING: "bg-[rgba(168,85,247,0.15)] text-[#A855F7] border-[rgba(168,85,247,0.3)]",
}

export function DashboardHeader({ title, subtitle, user }: HeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-bold text-[#F5F5F7] tracking-tight truncate">{title}</h1>
          {subtitle && <p className="text-sm text-[rgba(245,245,247,0.52)] truncate">{subtitle}</p>}
        </div>

        {/* Client badges */}
        {user?.client && (
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="outline" className={`${planColors[user.client.plan] || planColors.START} rounded-full px-3`}>
              {user.client.plan}
            </Badge>
            <Badge variant="outline" className={`${statusColors[user.client.status] || statusColors.ACTIVE} rounded-full px-3`}>
              {statusLabels[user.client.status] || user.client.status}
            </Badge>
          </div>
        )}
      </div>
    </div>
  )
}
