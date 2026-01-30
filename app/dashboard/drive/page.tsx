import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FolderOpen, ExternalLink, Cloud, FileText, ImageIcon, Video } from "lucide-react"

export default async function DrivePage() {
  const session = await getSession()

  if (!session || !session.client_id) {
    redirect("/login")
  }

  const hasDrive = !!session.client?.drive_link

  return (
    <div className="min-h-screen bg-[#07070A]">
      <DashboardHeader
        title="Google Drive"
        subtitle="Acesse seus arquivos compartilhados"
        user={session}
      />

      <div className="p-6">
        {hasDrive ? (
          <div className="space-y-6">
            {/* Drive Link Card */}
            <Card className="card-premium border-[rgba(255,255,255,0.06)] bg-gradient-to-br from-[#101018] to-[#141424]">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#A855F7] to-[#7C3AED] flex items-center justify-center shadow-lg shadow-[rgba(168,85,247,0.25)]">
                    <Cloud className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-[#F5F5F7] text-xl">Pasta Compartilhada</CardTitle>
                    <CardDescription className="text-[rgba(245,245,247,0.52)]">
                      Acesse todos os seus arquivos no Google Drive
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <a
                  href={session.client?.drive_link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-[#A855F7] to-[#7C3AED] hover:from-[#9333EA] hover:to-[#6D28D9] text-white font-semibold h-12 px-8 shadow-lg shadow-[rgba(168,85,247,0.25)]">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Abrir no Google Drive
                  </Button>
                </a>
              </CardContent>
            </Card>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="card-premium border-[rgba(255,255,255,0.06)] bg-[#101018]">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[rgba(168,85,247,0.15)] flex items-center justify-center">
                    <FileText className="w-6 h-6 text-[#A855F7]" />
                  </div>
                  <div>
                    <p className="text-sm text-[rgba(245,245,247,0.52)]">Documentos</p>
                    <p className="text-lg font-semibold text-[#F5F5F7]">Contratos, propostas e mais</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-premium border-[rgba(255,255,255,0.06)] bg-[#101018]">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[rgba(124,58,237,0.15)] flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-[#7C3AED]" />
                  </div>
                  <div>
                    <p className="text-sm text-[rgba(245,245,247,0.52)]">Imagens</p>
                    <p className="text-lg font-semibold text-[#F5F5F7]">Logos, banners e assets</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-premium border-[rgba(255,255,255,0.06)] bg-[#101018]">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[rgba(168,85,247,0.15)] flex items-center justify-center">
                    <Video className="w-6 h-6 text-[#A855F7]" />
                  </div>
                  <div>
                    <p className="text-sm text-[rgba(245,245,247,0.52)]">Vídeos</p>
                    <p className="text-lg font-semibold text-[#F5F5F7]">Tutoriais e apresentações</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Card className="card-premium border-[rgba(255,255,255,0.06)] bg-[#101018]">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 rounded-full bg-[#141424] flex items-center justify-center mb-4">
                <FolderOpen className="w-10 h-10 text-[rgba(245,245,247,0.42)]" />
              </div>
              <h3 className="text-xl font-medium text-[#F5F5F7] mb-2">Drive não configurado</h3>
              <p className="text-[rgba(245,245,247,0.52)] text-center max-w-md mb-6">
                O link do Google Drive ainda não foi configurado para sua conta. 
                Entre em contato com o administrador para solicitar acesso.
              </p>
              <Button variant="outline" className="border-[rgba(255,255,255,0.1)] text-[rgba(245,245,247,0.72)] hover:bg-[#141424] hover:text-[#F5F5F7] bg-transparent">
                Solicitar Acesso
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
