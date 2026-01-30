"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Eye, EyeOff, ExternalLink, Check } from "lucide-react"

interface AccessCardProps {
  access: {
    id: string
    service_name: string
    service_url: string | null
    login: string
    password: string
    created_at: string
    icon_url?: string | null
  }
}

const serviceColors: Record<string, string> = {
  google: "from-red-500 to-yellow-500",
  aws: "from-orange-500 to-orange-600",
  cloudflare: "from-orange-400 to-orange-500",
  vercel: "from-zinc-600 to-zinc-800",
  github: "from-zinc-700 to-zinc-900",
  shopify: "from-green-500 to-green-600",
  default: "from-[#A855F7] to-[#7C3AED]",
}

function getServiceColor(serviceName: string) {
  const lowerName = serviceName.toLowerCase()
  for (const [key, value] of Object.entries(serviceColors)) {
    if (lowerName.includes(key)) return value
  }
  return serviceColors.default
}

export function AccessCard({ access }: AccessCardProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const gradientColor = getServiceColor(access.service_name)

  return (
    <Card className="card-premium border-[rgba(255,255,255,0.06)] bg-[#101018] hover:border-[rgba(168,85,247,0.3)] transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {access.icon_url ? (
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg border border-[rgba(255,255,255,0.1)]">
                <img 
                  src={access.icon_url || "/placeholder.svg"} 
                  alt={access.service_name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradientColor} flex items-center justify-center shadow-lg`}>
                <span className="text-white font-bold text-sm">
                  {access.service_name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <CardTitle className="text-[#F5F5F7] text-base">{access.service_name}</CardTitle>
              {access.service_url && (
                <a
                  href={access.service_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[rgba(245,245,247,0.42)] hover:text-[#A855F7] flex items-center gap-1 mt-0.5"
                >
                  Acessar <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Login */}
        <div className="p-3 bg-[#141424] rounded-lg border border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[rgba(245,245,247,0.42)] mb-1">Login</p>
              <p className="text-sm text-[#F5F5F7] font-mono truncate">{access.login}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(access.login, "login")}
              className="h-8 w-8 text-[rgba(245,245,247,0.52)] hover:text-white hover:bg-[rgba(255,255,255,0.1)]"
            >
              {copiedField === "login" ? (
                <Check className="w-4 h-4 text-[#22C55E]" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Password */}
        <div className="p-3 bg-[#141424] rounded-lg border border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[rgba(245,245,247,0.42)] mb-1">Senha</p>
              <p className="text-sm text-[#F5F5F7] font-mono truncate">
                {showPassword ? access.password : "••••••••••••"}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPassword(!showPassword)}
                className="h-8 w-8 text-[rgba(245,245,247,0.52)] hover:text-white hover:bg-[rgba(255,255,255,0.1)]"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(access.password, "password")}
                className="h-8 w-8 text-[rgba(245,245,247,0.52)] hover:text-white hover:bg-[rgba(255,255,255,0.1)]"
              >
                {copiedField === "password" ? (
                  <Check className="w-4 h-4 text-[#22C55E]" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <Badge variant="outline" className="text-xs text-[rgba(245,245,247,0.42)] border-[rgba(255,255,255,0.1)] rounded-full">
            Atualizado: {new Date(access.created_at).toLocaleDateString("pt-BR")}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
