"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { 
  CheckCircle2, 
  Clock, 
  Circle,
  Lock,
  ChevronDown,
  ChevronUp,
  Settings,
  Save,
  Loader2,
  Upload
} from "lucide-react"
import { toast } from "sonner"

interface Client {
  id: string
  name: string
  slug: string
  plan: string
  logo_url: string | null
  whatsapp_link: string | null
  drive_link: string | null
}

interface Step {
  id: string
  title: string
  plans: string[]
}

interface Progress {
  client_id: string
  step_id: string
  status: 'pending' | 'in_progress' | 'completed'
  completed_at: string | null
  updated_at: string | null
}

interface Props {
  clients: Client[]
  allSteps: Step[]
  initialProgress: Progress[]
}

const statusOptions = [
  { value: "pending", label: "Pendente", icon: Circle, color: "text-zinc-400", bg: "bg-zinc-800" },
  { value: "in_progress", label: "Em Andamento", icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/20" },
  { value: "completed", label: "Concluído", icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/20" },
]

const planNames: Record<string, string> = {
  START: "Start PRO GROWTH",
  PRO: "Pro VÉRTEBRA",
  SCALE: "Scale VÉRTEBRA+ GLOBAL",
}

export function ClientStepsManager({ clients: initialClients, allSteps, initialProgress }: Props) {
  const [clients, setClients] = useState<Client[]>(initialClients)
  const [progress, setProgress] = useState<Progress[]>(initialProgress)
  const [expandedClient, setExpandedClient] = useState<string | null>(null)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [saving, setSaving] = useState<string | null>(null)
  const [uploadingLogo, setUploadingLogo] = useState<string | null>(null)
  const [configForm, setConfigForm] = useState({
    whatsapp_link: "",
    drive_link: "",
  })

  const getStepStatus = (clientId: string, stepId: string): 'pending' | 'in_progress' | 'completed' => {
    const p = progress.find(pr => pr.client_id === clientId && pr.step_id === stepId)
    return p?.status || 'pending'
  }

  const isStepAvailable = (step: Step, clientPlan: string) => {
    return step.plans.includes(clientPlan.toUpperCase())
  }

  const updateStatus = async (clientId: string, stepId: string, newStatus: string) => {
    console.log("[v0] updateStatus called - clientId:", clientId, "stepId:", stepId, "newStatus:", newStatus)
    setSaving(`${clientId}-${stepId}`)
    
    try {
      const payload = {
        client_id: clientId,
        step_id: stepId,
        status: newStatus,
      }
      console.log("[v0] Sending payload:", JSON.stringify(payload))
      
      const response = await fetch("/api/client/step-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const responseData = await response.json()
      console.log("[v0] Response status:", response.status, "data:", JSON.stringify(responseData))

      if (response.ok) {
        setProgress(prev => {
          const existing = prev.findIndex(p => p.client_id === clientId && p.step_id === stepId)
          const newProgress: Progress = {
            client_id: clientId,
            step_id: stepId,
            status: newStatus as 'pending' | 'in_progress' | 'completed',
            completed_at: newStatus === 'completed' ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          }
          
          console.log("[v0] Updating local state - existing index:", existing, "newProgress:", JSON.stringify(newProgress))
          
          if (existing >= 0) {
            const updated = [...prev]
            updated[existing] = newProgress
            return updated
          }
          return [...prev, newProgress]
        })
        toast.success("Status atualizado!")
      } else {
        console.error("[v0] Error response:", responseData)
        toast.error("Erro ao atualizar status: " + (responseData.error || "Erro desconhecido"))
      }
    } catch (error) {
      console.error("[v0] Error updating status:", error)
      toast.error("Erro ao atualizar status")
    } finally {
      setSaving(null)
    }
  }

  const openConfig = (client: Client) => {
    setSelectedClient(client)
    setConfigForm({
      whatsapp_link: client.whatsapp_link || "",
      drive_link: client.drive_link || "",
    })
    setIsConfigOpen(true)
  }

  const saveConfig = async () => {
    if (!selectedClient) return

    try {
      const response = await fetch(`/api/admin/clients/${selectedClient.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(configForm),
      })

      if (response.ok) {
        setClients(prev => prev.map(c => 
          c.id === selectedClient.id 
            ? { ...c, whatsapp_link: configForm.whatsapp_link, drive_link: configForm.drive_link }
            : c
        ))
        toast.success("Configurações salvas!")
        setIsConfigOpen(false)
      } else {
        toast.error("Erro ao salvar configurações")
      }
    } catch (error) {
      console.error("Error saving config:", error)
      toast.error("Erro ao salvar configurações")
    }
  }

  const handleLogoUpload = async (clientId: string, file: File) => {
    setUploadingLogo(clientId)
    
    const formData = new FormData()
    formData.append("file", file)
    formData.append("client_id", clientId)

    try {
      const response = await fetch("/api/admin/upload-logo", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const { url } = await response.json()
        setClients(prev => prev.map(c => 
          c.id === clientId ? { ...c, logo_url: url } : c
        ))
        toast.success("Logo atualizada!")
      } else {
        toast.error("Erro ao fazer upload da logo")
      }
    } catch (error) {
      console.error("Error uploading logo:", error)
      toast.error("Erro ao fazer upload da logo")
    } finally {
      setUploadingLogo(null)
    }
  }

  const getClientProgress = (client: Client) => {
    const availableSteps = allSteps.filter(s => isStepAvailable(s, client.plan))
    const completedSteps = availableSteps.filter(s => getStepStatus(client.id, s.id) === 'completed')
    return { completed: completedSteps.length, total: availableSteps.length }
  }

  const getPlanColor = (plan: string) => {
    switch (plan.toUpperCase()) {
      case "START": return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "PRO": return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "SCALE": return "bg-amber-500/20 text-amber-400 border-amber-500/30"
      default: return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"
    }
  }

  return (
    <div className="space-y-4">
      {clients.map(client => {
        const { completed, total } = getClientProgress(client)
        const isExpanded = expandedClient === client.id
        const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0

        return (
          <Card key={client.id} className="bg-[#0A0A0F] border-zinc-800 overflow-hidden">
            {/* Client Header */}
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-900/50 transition-colors"
              onClick={() => setExpandedClient(isExpanded ? null : client.id)}
            >
              <div className="flex items-center gap-4">
                {/* Client Logo */}
                <div className="relative group">
                  {client.logo_url ? (
                    <Image 
                      src={client.logo_url || "/placeholder.svg"} 
                      alt={client.name}
                      width={48}
                      height={48}
                      className="rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{client.name.charAt(0)}</span>
                    </div>
                  )}
                  <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    {uploadingLogo === client.id ? (
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    ) : (
                      <Upload className="w-5 h-5 text-white" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleLogoUpload(client.id, file)
                      }}
                    />
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-zinc-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-zinc-400" />
                  )}
                  <span className="font-semibold text-white">{client.name}</span>
                  <Badge className={getPlanColor(client.plan)}>
                    {planNames[client.plan.toUpperCase()] || client.plan}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        progressPercent === 100 ? 'bg-green-500' : 'bg-purple-500'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="text-sm text-zinc-400 font-medium">{completed}/{total}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    openConfig(client)
                  }}
                  className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Steps Grid */}
            {isExpanded && (
              <CardContent className="pt-0 pb-6">
                <div className="grid gap-2">
                  {allSteps.map((step, index) => {
                    const isAvailable = isStepAvailable(step, client.plan)
                    const status = getStepStatus(client.id, step.id)
                    const isSaving = saving === `${client.id}-${step.id}`
                    const statusConfig = statusOptions.find(s => s.value === status)

                    return (
                      <div 
                        key={step.id}
                        className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${
                          !isAvailable 
                            ? 'bg-zinc-900/30 border-zinc-800/50 opacity-50' 
                            : status === 'completed'
                              ? 'bg-green-500/5 border-green-500/20'
                              : status === 'in_progress'
                                ? 'bg-yellow-500/5 border-yellow-500/20'
                                : 'bg-zinc-900/50 border-zinc-800'
                        }`}
                      >
                        {/* Step Number */}
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          !isAvailable
                            ? 'bg-zinc-800 text-zinc-500'
                            : status === 'completed'
                              ? 'bg-green-500 text-white'
                              : status === 'in_progress'
                                ? 'bg-yellow-500 text-black'
                                : 'bg-zinc-700 text-zinc-300'
                        }`}>
                          {!isAvailable ? (
                            <Lock className="w-3 h-3" />
                          ) : status === 'completed' ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            index + 1
                          )}
                        </div>

                        {/* Step Info */}
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium text-sm truncate ${isAvailable ? 'text-white' : 'text-zinc-500'}`}>
                            {step.title}
                          </p>
                        </div>

                        {/* Status Selector */}
                        {isAvailable ? (
                          <Select
                            value={status}
                            onValueChange={(value) => updateStatus(client.id, step.id, value)}
                            disabled={isSaving}
                          >
                            <SelectTrigger className={`w-44 h-9 text-sm border-0 ${statusConfig?.bg} ${statusConfig?.color}`}>
                              {isSaving ? (
                                <div className="flex items-center gap-2">
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                  <span>Salvando...</span>
                                </div>
                              ) : (
                                <SelectValue />
                              )}
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-700">
                              {statusOptions.map(opt => {
                                const Icon = opt.icon
                                return (
                                  <SelectItem 
                                    key={opt.value} 
                                    value={opt.value}
                                    className="focus:bg-zinc-800"
                                  >
                                    <div className="flex items-center gap-2">
                                      <Icon className={`w-3.5 h-3.5 ${opt.color}`} />
                                      <span>{opt.label}</span>
                                    </div>
                                  </SelectItem>
                                )
                              })}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge variant="outline" className="bg-zinc-800/50 text-zinc-500 border-zinc-700 text-xs">
                            Bloqueado
                          </Badge>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            )}
          </Card>
        )
      })}

      {/* Config Dialog */}
      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent className="bg-[#0D0D12] border-zinc-800 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-3">
              {selectedClient?.logo_url ? (
                <Image 
                  src={selectedClient.logo_url || "/placeholder.svg"}
                  alt={selectedClient.name}
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{selectedClient?.name.charAt(0)}</span>
                </div>
              )}
              {selectedClient?.name}
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Configure os links de WhatsApp e Google Drive do cliente.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Link do WhatsApp</Label>
              <Input
                value={configForm.whatsapp_link}
                onChange={(e) => setConfigForm({ ...configForm, whatsapp_link: e.target.value })}
                placeholder="https://wa.me/5511999999999"
                className="bg-zinc-900/50 border-zinc-700 text-white"
              />
              <p className="text-xs text-zinc-500">Link para contato via WhatsApp</p>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-300">Link do Google Drive</Label>
              <Input
                value={configForm.drive_link}
                onChange={(e) => setConfigForm({ ...configForm, drive_link: e.target.value })}
                placeholder="https://drive.google.com/drive/folders/..."
                className="bg-zinc-900/50 border-zinc-700 text-white"
              />
              <p className="text-xs text-zinc-500">Link para a pasta de materiais</p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsConfigOpen(false)}
              className="border-zinc-700 bg-transparent text-zinc-300 hover:text-white hover:bg-zinc-800"
            >
              Cancelar
            </Button>
            <Button onClick={saveConfig} className="bg-purple-600 hover:bg-purple-700">
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
