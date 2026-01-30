"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, ExternalLink, Eye, EyeOff, KeyRound, Search, CheckCircle } from "lucide-react"

interface Access {
  id: string
  service_name: string
  service_url: string | null
  login: string
  password: string
  icon_url?: string | null
}

interface AccessesListProps {
  accesses: Access[]
}

export function AccessesList({ accesses }: AccessesListProps) {
  const [search, setSearch] = useState("")
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set())
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const togglePassword = (id: string) => {
    setVisiblePasswords((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const copyToClipboard = async (text: string, fieldId: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedField(fieldId)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const filteredAccesses = accesses.filter((access) =>
    access.service_name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgba(245,245,247,0.52)]" />
        <Input
          placeholder="Buscar serviço..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-[#12121A] border-[rgba(255,255,255,0.06)] text-[#F5F5F7] placeholder:text-[rgba(245,245,247,0.52)] focus:border-[#A855F7] rounded-xl"
        />
      </div>

      {filteredAccesses.length === 0 ? (
        <Card className="bg-[#0D0D12] border-purple-500/20 rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-[#171723] flex items-center justify-center mb-4">
              <KeyRound className="w-8 h-8 text-[rgba(245,245,247,0.52)]" />
            </div>
            <h3 className="text-lg font-medium text-[#F5F5F7] mb-2">Nenhum acesso cadastrado</h3>
            <p className="text-[rgba(245,245,247,0.52)] text-center max-w-md">
              Os acessos dos seus serviços aparecerão aqui quando forem cadastrados pelo administrador.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredAccesses.map((access) => (
            <Card
              key={access.id}
              className="bg-[#0D0D12] border-purple-500/20 rounded-2xl hover:border-[rgba(168,85,247,0.35)] transition-all duration-300"
            >
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {access.icon_url ? (
                      <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-[rgba(255,255,255,0.1)] bg-zinc-800">
                        <img 
                          src={access.icon_url || "/placeholder.svg"} 
                          alt={access.service_name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            target.parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-violet-600"><span class="text-white font-bold text-sm">${access.service_name.charAt(0)}</span></div>`
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A855F7] to-[#6D28D9] flex items-center justify-center shrink-0">
                        <KeyRound className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <CardTitle className="text-[#F5F5F7] text-lg truncate">{access.service_name}</CardTitle>
                      {access.service_url && (
                        <p className="text-sm text-[rgba(245,245,247,0.52)] truncate">{access.service_url}</p>
                      )}
                    </div>
                  </div>
                  {access.service_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(access.service_url!, "_blank")}
                      className="border-[rgba(255,255,255,0.08)] text-[rgba(245,245,247,0.72)] hover:bg-[#171723] hover:text-[#F5F5F7] rounded-xl shrink-0"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Abrir
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="space-y-2">
                    <label className="text-sm text-[rgba(245,245,247,0.52)]">Login</label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-[#171723] rounded-xl px-4 py-2.5 text-[#F5F5F7] font-mono text-sm border border-[rgba(255,255,255,0.06)] truncate">
                        {access.login}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(access.login, `login-${access.id}`)}
                        className="hover:bg-[#171723] rounded-xl shrink-0"
                      >
                        {copiedField === `login-${access.id}` ? (
                          <CheckCircle className="w-4 h-4 text-[#22C55E]" />
                        ) : (
                          <Copy className="w-4 h-4 text-[rgba(245,245,247,0.52)]" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-[rgba(245,245,247,0.52)]">Senha</label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-[#171723] rounded-xl px-4 py-2.5 text-[#F5F5F7] font-mono text-sm border border-[rgba(255,255,255,0.06)]">
                        {visiblePasswords.has(access.id) ? access.password : "••••••••"}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => togglePassword(access.id)}
                        className="hover:bg-[#171723] rounded-xl shrink-0"
                      >
                        {visiblePasswords.has(access.id) ? (
                          <EyeOff className="w-4 h-4 text-[rgba(245,245,247,0.52)]" />
                        ) : (
                          <Eye className="w-4 h-4 text-[rgba(245,245,247,0.52)]" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(access.password, `password-${access.id}`)}
                        className="hover:bg-[#171723] rounded-xl shrink-0"
                      >
                        {copiedField === `password-${access.id}` ? (
                          <CheckCircle className="w-4 h-4 text-[#22C55E]" />
                        ) : (
                          <Copy className="w-4 h-4 text-[rgba(245,245,247,0.52)]" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
