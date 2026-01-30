"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FileText, ChevronRight } from "lucide-react"

interface WeeklyReport {
  id: string
  report_date: string
  status: string
  summary: string
  actions_taken: string | null
  data_analysis: string | null
  decisions_made: string | null
  next_week_guidance: string | null
  created_at: string
}

interface WeeklyReportsViewProps {
  reports: WeeklyReport[]
}

export function WeeklyReportsView({ reports }: WeeklyReportsViewProps) {
  const [selectedReport, setSelectedReport] = useState<WeeklyReport | null>(null)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    })
  }

  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  if (reports.length === 0) {
    return (
      <Card className="bg-[#0D0D12] border-purple-500/20 rounded-2xl">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-[#171723] flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-[rgba(245,245,247,0.52)]" />
          </div>
          <h3 className="text-lg font-medium text-[#F5F5F7] mb-2">
            Nenhum relatório disponível
          </h3>
          <p className="text-[rgba(245,245,247,0.52)] text-center max-w-md">
            Seus relatórios semanais aparecerão aqui assim que forem publicados.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-3">
        {reports.map((report) => {
          return (
            <Card
              key={report.id}
              className="bg-[#0D0D12] border-purple-500/20 rounded-2xl hover:border-[rgba(168,85,247,0.35)] transition-all duration-300"
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#171723] flex items-center justify-center">
                      <FileText className="w-6 h-6 text-[#A855F7]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#F5F5F7] text-base">
                        Relatório semanal - {formatDate(report.report_date)}
                      </p>
                      <p className="text-sm text-[rgba(245,245,247,0.52)] mt-1">
                        Leitura estratégica da operação
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedReport(report)}
                    className="text-[#A855F7] hover:text-[#A855F7] hover:bg-[rgba(168,85,247,0.1)] gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Ver relatório completo
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Report Detail Modal */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="bg-[#0D0D12] border-purple-500/20 max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#F5F5F7] flex items-center gap-3 text-xl">
              <div className="w-10 h-10 rounded-xl bg-[#171723] flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#A855F7]" />
              </div>
              Relatório Semanal
            </DialogTitle>
            {selectedReport && (
              <p className="text-[rgba(245,245,247,0.52)] mt-2">
                {formatFullDate(selectedReport.report_date)}
              </p>
            )}
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-6 mt-4">
              {/* Resumo da Semana */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-[#A855F7] uppercase tracking-wide">
                  Resumo da Semana
                </h4>
                <p className="text-[rgba(245,245,247,0.85)] whitespace-pre-wrap leading-relaxed">
                  {selectedReport.summary}
                </p>
              </div>

              {/* O que foi feito */}
              {selectedReport.actions_taken && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-[#A855F7] uppercase tracking-wide">
                    O que foi feito
                  </h4>
                  <p className="text-[rgba(245,245,247,0.85)] whitespace-pre-wrap leading-relaxed">
                    {selectedReport.actions_taken}
                  </p>
                </div>
              )}

              {/* Leitura dos Dados */}
              {selectedReport.data_analysis && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-[#A855F7] uppercase tracking-wide">
                    Leitura dos Dados
                  </h4>
                  <p className="text-[rgba(245,245,247,0.85)] whitespace-pre-wrap leading-relaxed">
                    {selectedReport.data_analysis}
                  </p>
                </div>
              )}

              {/* Decisoes Tomadas */}
              {selectedReport.decisions_made && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-[#A855F7] uppercase tracking-wide">
                    Decisões Tomadas
                  </h4>
                  <p className="text-[rgba(245,245,247,0.85)] whitespace-pre-wrap leading-relaxed">
                    {selectedReport.decisions_made}
                  </p>
                </div>
              )}

              {/* Orientacao para Proxima Semana */}
              {selectedReport.next_week_guidance && (
                <div className="space-y-2 pb-2">
                  <h4 className="text-sm font-semibold text-[#A855F7] uppercase tracking-wide">
                    Orientação para Próxima Semana
                  </h4>
                  <p className="text-[rgba(245,245,247,0.85)] whitespace-pre-wrap leading-relaxed">
                    {selectedReport.next_week_guidance}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
