"use client"

import { useParams } from "next/navigation"
import { Compass, Layers, Shield, ArrowUpRight, MessageCircle, Loader2, Map, Boxes, Crown, BarChart3, Globe, Rocket, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface ClientData {
  id: string
  name: string
  slug: string
  plan: string
}

interface ButtonLink {
  link_url: string
  label: string
}

export default function MapaOperacaoPage() {
  const params = useParams()
  const slug = params.slug as string

  const { data: clientData, isLoading: clientLoading } = useSWR<ClientData>(
    `/api/client/info?slug=${slug}`,
    fetcher
  )
  
  const clientPlan = (clientData?.plan || "START").toUpperCase()
  
  const { data: planButton } = useSWR<ButtonLink>(
    clientData ? `/api/settings/plan-button?plan=${clientPlan.toLowerCase()}` : null,
    fetcher,
    { revalidateOnFocus: true, refreshInterval: 5000 }
  )

  const buttonLink = planButton?.link_url || "https://wa.me/5511999999999"
  const buttonLabel = planButton?.label || "Falar com um atendente"

  // Loading state
  if (clientLoading) {
    return (
      <div className="min-h-screen bg-[#07070A] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
      </div>
    )
  }

  // SCALE plan content
  if (clientPlan === "SCALE") {
    return (
      <div className="min-h-screen bg-[#07070A]">
        <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-10 md:py-12 space-y-6 sm:space-y-8">
          
          {/* Page Header - Enhanced */}
          <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c0c10] to-[#0d0b14] border border-zinc-800/60 p-8 md:p-10">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Map className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
                      Mapa da Operação
                    </h1>
                  </div>
                </div>
                <p className="text-zinc-400 max-w-lg">
                  Acompanhe a jornada da sua operação e entenda cada etapa do processo de construção do seu negócio.
                </p>
              </div>
              
              <div className="flex flex-col items-start md:items-end gap-2">
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 px-4 py-1.5 text-sm font-medium">
                  {"SCALE VÉRTEBRA+ GLOBAL™"}
                </Badge>
                <p className="text-sm text-zinc-500">
                  {"Nível atual · Operação global escalável"}
                </p>
              </div>
            </div>
          </header>

          {/* Top Row - Two cards side by side */}
          <div className="grid lg:grid-cols-2 gap-5">
            {/* Section 1 - Current Stage Overview */}
            <div className="bg-[#0c0c10] border border-zinc-800/60 rounded-2xl p-6 md:p-8">
              <p className="text-white leading-relaxed">
                {"Você está no nível "}<span className="text-amber-400 font-medium">{"SCALE VÉRTEBRA+ GLOBAL™"}</span>{"."}
              </p>
              <p className="text-zinc-400 mt-4 leading-relaxed">
                {"Neste estágio, a operação está pronta para crescer de forma previsível e sustentável, com estrutura que suporta volume sem perder controle."}
              </p>
              <p className="text-zinc-400 mt-4 leading-relaxed">
                <span className="text-white font-medium">{"Aqui, escalar deixa de ser risco e passa a ser método."}</span>
              </p>
            </div>

            {/* Section 2 - Objective of This Level */}
            <div className="bg-[#0c0c10] border border-zinc-800/60 rounded-2xl p-6 md:p-8">
              <p className="text-zinc-400 leading-relaxed">
                {"O objetivo deste nível é transformar crescimento em sistema, e não em acidente."}
              </p>
              <div className="mt-6 space-y-3">
                <p className="text-zinc-300 flex items-start gap-3">
                  <span className="text-amber-500 mt-1">-</span>
                  {"Escala com previsibilidade"}
                </p>
                <p className="text-zinc-300 flex items-start gap-3">
                  <span className="text-amber-500 mt-1">-</span>
                  {"Expansão internacional estruturada"}
                </p>
                <p className="text-zinc-300 flex items-start gap-3">
                  <span className="text-amber-500 mt-1">-</span>
                  {"Operação autônoma e replicável"}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3 - Scale Pillars (3 cards) */}
          <div className="grid md:grid-cols-3 gap-5">
            {/* Card 1 - Expansão Global */}
            <div className="bg-[#0c0c10] border border-zinc-800/60 rounded-2xl p-6 flex flex-col hover:border-amber-500/30 transition-colors duration-300">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                <Globe className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-white font-medium text-lg mb-1">
                {"Expansão Global"}
              </h3>
              <p className="text-zinc-500 text-sm mb-4">
                {"Operação sem fronteiras"}
              </p>
              <p className="text-zinc-400 text-sm leading-relaxed mt-auto">
                {"Neste pilar, a operação ganha capacidade de atuar em múltiplos mercados. Logística, pagamentos e comunicação são adaptados para escala internacional."}
              </p>
            </div>

            {/* Card 2 - Escala Controlada */}
            <div className="bg-[#0c0c10] border border-zinc-800/60 rounded-2xl p-6 flex flex-col hover:border-amber-500/30 transition-colors duration-300">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                <Rocket className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-white font-medium text-lg mb-1">
                {"Escala Controlada"}
              </h3>
              <p className="text-zinc-500 text-sm mb-4">
                {"Crescimento com método"}
              </p>
              <p className="text-zinc-400 text-sm leading-relaxed mt-auto">
                {"Neste pilar, o crescimento acontece de forma previsível. Métricas, processos e equipe estão alinhados para suportar volume sem perder qualidade."}
              </p>
            </div>

            {/* Card 3 - Performance Avançada */}
            <div className="bg-[#0c0c10] border border-zinc-800/60 rounded-2xl p-6 flex flex-col hover:border-amber-500/30 transition-colors duration-300">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-white font-medium text-lg mb-1">
                {"Performance Avançada"}
              </h3>
              <p className="text-zinc-500 text-sm mb-4">
                {"Otimização contínua"}
              </p>
              <p className="text-zinc-400 text-sm leading-relaxed mt-auto">
                {"Neste pilar, cada canal é otimizado individualmente. Tráfego, conversão e retenção são tratados como sistemas independentes e mensuráveis."}
              </p>
            </div>
          </div>

          {/* Section 4 - Completion Criteria */}
          <div className="bg-[#0d0b14] border border-amber-500/20 rounded-2xl p-6 md:p-8">
            <p className="text-zinc-300 leading-relaxed">
              {"O nível "}<span className="text-amber-400 font-medium">{"SCALE VÉRTEBRA+ GLOBAL™"}</span>{" é considerado bem executado quando:"}
            </p>
            <div className="mt-5 space-y-3">
              <p className="text-zinc-400 flex items-start gap-3">
                <span className="text-amber-500 mt-1">-</span>
                {"A operação escala sem perder controle"}
              </p>
              <p className="text-zinc-400 flex items-start gap-3">
                <span className="text-amber-500 mt-1">-</span>
                {"Novos mercados são ativados com método"}
              </p>
              <p className="text-zinc-400 flex items-start gap-3">
                <span className="text-amber-500 mt-1">-</span>
                {"Os resultados são previsíveis e replicáveis"}
              </p>
            </div>
            <p className="text-zinc-500 mt-6 text-sm">
              {"Escalar sem estrutura é apenas ampliar problemas."}
            </p>
          </div>

          {/* Section 5 - Level Evaluation */}
          <div className="bg-[#0c0c10] border border-zinc-800/60 rounded-2xl p-6 md:p-8 flex flex-col">
            <h3 className="text-xl font-semibold text-white mb-4">
              {"Suporte Estratégico"}
            </h3>
            <p className="text-zinc-300 leading-relaxed">
              {"No nível SCALE, você tem acesso a suporte estratégico especializado para garantir que sua operação continue crescendo de forma sustentável."}
            </p>
            <p className="text-zinc-500 text-sm mt-4 leading-relaxed">
              {"Entre em contato para agendar uma sessão de acompanhamento ou tirar dúvidas sobre sua operação."}
            </p>
            
            <div className="mt-auto pt-6 border-t border-zinc-800/60">
              <a
                href={buttonLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl gap-2 transition-colors duration-200">
                  <MessageCircle className="w-4 h-4" />
                  {buttonLabel}
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </div>

        </div>
      </div>
    )
  }

  // PRO plan content
  if (clientPlan === "PRO") {
    return (
      <div className="min-h-screen bg-[#07070A]">
        <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-10 md:py-12 space-y-6 sm:space-y-8">
          
          {/* Page Header - Enhanced */}
          <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c0c10] to-[#0d0b14] border border-zinc-800/60 p-8 md:p-10">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center">
                    <Map className="w-6 h-6 text-violet-400" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
                      Mapa da Operação
                    </h1>
                  </div>
                </div>
                <p className="text-zinc-400 max-w-lg">
                  Acompanhe a jornada da sua operação e entenda cada etapa do processo de construção do seu negócio.
                </p>
              </div>
              
              <div className="flex flex-col items-start md:items-end gap-2">
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-4 py-1.5 text-sm font-medium">
                  {"PRO VÉRTEBRA™"}
                </Badge>
                <p className="text-sm text-zinc-500">
                  Nível atual · Operador com espinha dorsal
                </p>
              </div>
            </div>
          </header>

          {/* Top Row - Two cards side by side */}
          <div className="grid lg:grid-cols-2 gap-5">
            {/* Section 1 - Current Stage Overview */}
            <div className="bg-[#0c0c10] border border-zinc-800/60 rounded-2xl p-6 md:p-8">
              <p className="text-white leading-relaxed">
                {"Você está no nível "}<span className="text-violet-400 font-medium">{"PRO VÉRTEBRA™"}</span>{"."}
              </p>
              <p className="text-zinc-400 mt-4 leading-relaxed">
                Neste estágio, a operação deixa de depender de sorte e passa a operar com estrutura, lógica e previsibilidade.
              </p>
              <p className="text-zinc-400 mt-4 leading-relaxed">
                <span className="text-white font-medium">Aqui, a empresa começa a existir de verdade.</span>
              </p>
            </div>

            {/* Section 2 - Objective of This Level */}
            <div className="bg-[#0c0c10] border border-zinc-800/60 rounded-2xl p-6 md:p-8">
              <p className="text-zinc-400 leading-relaxed">
                O objetivo deste nível é transformar uma operação instável em uma operação estruturada e legível.
              </p>
              <div className="mt-6 space-y-3">
                <p className="text-zinc-300 flex items-start gap-3">
                  <span className="text-violet-500 mt-1">-</span>
                  A operação ganha espinha dorsal
                </p>
                <p className="text-zinc-300 flex items-start gap-3">
                  <span className="text-violet-500 mt-1">-</span>
                  Decisões passam a ser racionais
                </p>
                <p className="text-zinc-300 flex items-start gap-3">
                  <span className="text-violet-500 mt-1">-</span>
                  A empresa deixa de depender de impulsos e acertos aleatórios
                </p>
              </div>
            </div>
          </div>

          {/* Section 3 - Operational Vertebrae (3 cards) */}
          <div className="grid md:grid-cols-3 gap-5">
            {/* Card 1 - Estrutura */}
            <div className="bg-[#0c0c10] border border-zinc-800/60 rounded-2xl p-6 flex flex-col hover:border-violet-500/30 transition-colors duration-300">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4">
                <Boxes className="w-5 h-5 text-violet-400" />
              </div>
              <h3 className="text-white font-medium text-lg mb-1">
                Estrutura
              </h3>
              <p className="text-zinc-500 text-sm mb-4">
                A operação se organiza
              </p>
              <p className="text-zinc-400 text-sm leading-relaxed mt-auto">
                Nesta vértebra, a operação ganha lógica completa. Oferta, loja e narrativa passam a conversar entre si, criando uma estrutura profissional e coerente.
              </p>
            </div>

            {/* Card 2 - Autoridade */}
            <div className="bg-[#0c0c10] border border-zinc-800/60 rounded-2xl p-6 flex flex-col hover:border-violet-500/30 transition-colors duration-300">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4">
                <Crown className="w-5 h-5 text-violet-400" />
              </div>
              <h3 className="text-white font-medium text-lg mb-1">
                Autoridade
              </h3>
              <p className="text-zinc-500 text-sm mb-4">
                A marca passa a merecer vender
              </p>
              <p className="text-zinc-400 text-sm leading-relaxed mt-auto">
                Nesta vértebra, a operação deixa de parecer genérica. A comunicação ganha identidade, a marca transmite confiança e o atrito na conversão diminui.
              </p>
            </div>

            {/* Card 3 - Performance Legível */}
            <div className="bg-[#0c0c10] border border-zinc-800/60 rounded-2xl p-6 flex flex-col hover:border-violet-500/30 transition-colors duration-300">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5 text-violet-400" />
              </div>
              <h3 className="text-white font-medium text-lg mb-1">
                Performance Legível
              </h3>
              <p className="text-zinc-500 text-sm mb-4">
                Decisões baseadas em dados
              </p>
              <p className="text-zinc-400 text-sm leading-relaxed mt-auto">
                Nesta vértebra, a operação passa a ser mensurável. Criativos seguem tese, métricas fazem sentido e decisões deixam de ser baseadas em sensação.
              </p>
            </div>
          </div>

          {/* Section 4 - Completion Criteria */}
          <div className="bg-[#0d0b14] border border-violet-500/20 rounded-2xl p-6 md:p-8">
            <p className="text-zinc-300 leading-relaxed">
              {"O nível "}<span className="text-violet-400 font-medium">{"PRO VÉRTEBRA™"}</span>{" é considerado bem executado quando:"}
            </p>
            <div className="mt-5 space-y-3">
              <p className="text-zinc-400 flex items-start gap-3">
                <span className="text-violet-500 mt-1">-</span>
                A operação possui estrutura clara e repetível
              </p>
              <p className="text-zinc-400 flex items-start gap-3">
                <span className="text-violet-500 mt-1">-</span>
                A comunicação transmite autoridade
              </p>
              <p className="text-zinc-400 flex items-start gap-3">
                <span className="text-violet-500 mt-1">-</span>
                A operação consegue rodar sem impulsividade
              </p>
            </div>
            <p className="text-zinc-500 mt-6 text-sm">
              Enquanto isso não for verdade, qualquer avanço é erro estratégico.
            </p>
          </div>

          {/* Section 5 - Level Progression Evaluation */}
          <div className="bg-[#0c0c10] border border-zinc-800/60 rounded-2xl p-6 md:p-8 flex flex-col">
            <h3 className="text-xl font-semibold text-white mb-4">
              Avaliação de Progressão de Nível
            </h3>
            <p className="text-zinc-300 leading-relaxed">
              Se as etapas acima estiverem bem executadas, sua operação pode estar pronta para avançar para o próximo nível operacional.
            </p>
            <p className="text-zinc-500 text-sm mt-4 leading-relaxed">
              O avanço para o <span className="text-zinc-400">Scale VÉRTEBRA+ GLOBAL™</span> não é automático. Ele só faz sentido quando a base está sólida e validada.
            </p>
            
            <div className="mt-auto pt-6 border-t border-zinc-800/60">
              <a
                href={buttonLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl gap-2 transition-colors duration-200">
                  <MessageCircle className="w-4 h-4" />
                  {buttonLabel}
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </div>

        </div>
      </div>
    )
  }

  // START plan content
  return (
    <div className="min-h-screen bg-[#07070A]">
      <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-10 md:py-12 space-y-6 sm:space-y-8">
        
        {/* Page Header - Enhanced */}
        <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c0c10] to-[#0d0b14] border border-zinc-800/60 p-8 md:p-10">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center">
                  <Map className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
                    Mapa da Operação
                  </h1>
                </div>
              </div>
              <p className="text-zinc-400 max-w-lg">
                Acompanhe a jornada da sua operação e entenda cada etapa do processo de construção do seu negócio.
              </p>
            </div>
            
            <div className="flex flex-col items-start md:items-end gap-2">
              <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30 px-4 py-1.5 text-sm font-medium">
                START PRO GROWTH
              </Badge>
              <p className="text-sm text-zinc-500">
                Nível atual · Operador em formação
              </p>
            </div>
          </div>
        </header>

        {/* Top Row - Two cards side by side */}
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Section 1 - Current Stage Overview */}
          <div className="bg-[#0c0c10] border border-zinc-800/60 rounded-2xl p-6 md:p-8">
            <p className="text-white leading-relaxed">
              Você está no nível <span className="text-violet-400 font-medium">START PRO GROWTH</span>.
            </p>
            <p className="text-zinc-400 mt-4 leading-relaxed">
              Este estágio existe para construir a base operacional mínima da sua operação antes de qualquer tentativa de crescimento ou escala.
            </p>
            <p className="text-zinc-400 mt-4 leading-relaxed">
              Neste nível, a prioridade não é velocidade.
              <br />
              <span className="text-white font-medium">É estrutura.</span>
            </p>
          </div>

          {/* Section 2 - Objective of This Level */}
          <div className="bg-[#0c0c10] border border-zinc-800/60 rounded-2xl p-6 md:p-8">
            <p className="text-zinc-400 leading-relaxed">
              O objetivo deste nível é tirar a operação do modelo de tentativa e erro e criar a primeira espinha dorsal real do negócio.
            </p>
            <div className="mt-6 space-y-3">
              <p className="text-zinc-300 flex items-start gap-3">
                <span className="text-violet-500 mt-1">-</span>
                Decisões impulsivas são eliminadas
              </p>
              <p className="text-zinc-300 flex items-start gap-3">
                <span className="text-violet-500 mt-1">-</span>
                Confusão de nicho e produto é resolvida
              </p>
              <p className="text-zinc-300 flex items-start gap-3">
                <span className="text-violet-500 mt-1">-</span>
                O risco de prejuízo por testes prematuros é reduzido
              </p>
            </div>
          </div>
        </div>

        {/* Section 3 - Inevitable Stages of START (3 cards) */}
        <div className="grid md:grid-cols-3 gap-5">
          {/* Card 1 - Direcao */}
          <div className="bg-[#0c0c10] border border-zinc-800/60 rounded-2xl p-6 flex flex-col hover:border-violet-500/30 transition-colors duration-300">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4">
              <Compass className="w-5 h-5 text-violet-400" />
            </div>
            <h3 className="text-white font-medium text-lg mb-1">
              Direção
            </h3>
            <p className="text-zinc-500 text-sm mb-4">
              Clareza antes da execução
            </p>
            <p className="text-zinc-400 text-sm leading-relaxed mt-auto">
              Nesta etapa, a operação ganha rumo. São definidas as escolhas corretas de nicho, país e ordem de execução, eliminando caminhos que geram desperdício.
            </p>
          </div>

          {/* Card 2 - Base Operacional */}
          <div className="bg-[#0c0c10] border border-zinc-800/60 rounded-2xl p-6 flex flex-col hover:border-violet-500/30 transition-colors duration-300">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5 text-violet-400" />
            </div>
            <h3 className="text-white font-medium text-lg mb-1">
              Base Operacional
            </h3>
            <p className="text-zinc-500 text-sm mb-4">
              A operação começa a existir
            </p>
            <p className="text-zinc-400 text-sm leading-relaxed mt-auto">
              Nesta etapa, a estrutura mínima é construída. A operação passa a ter base funcional, lógica de oferta simples e infraestrutura pronta para validação.
            </p>
          </div>

          {/* Card 3 - Protecao */}
          <div className="bg-[#0c0c10] border border-zinc-800/60 rounded-2xl p-6 flex flex-col hover:border-violet-500/30 transition-colors duration-300">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4">
              <Shield className="w-5 h-5 text-violet-400" />
            </div>
            <h3 className="text-white font-medium text-lg mb-1">
              Proteção
            </h3>
            <p className="text-zinc-500 text-sm mb-4">
              Evitar prejuízo e decisões emocionais
            </p>
            <p className="text-zinc-400 text-sm leading-relaxed mt-auto">
              Nesta etapa, o foco é proteger capital e psicológico. Fica claro o que NÃO deve ser testado agora e quais métricas realmente importam neste estágio.
            </p>
          </div>
        </div>

        {/* Bottom Row - Two cards side by side */}
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Section 4 - Completion Criteria */}
          <div className="bg-[#0d0b14] border border-violet-500/20 rounded-2xl p-6 md:p-8">
            <p className="text-zinc-300 leading-relaxed">
              O nível <span className="text-violet-400 font-medium">START PRO GROWTH</span> é considerado concluído quando:
            </p>
            <div className="mt-5 space-y-3">
              <p className="text-zinc-400 flex items-start gap-3">
                <span className="text-violet-500 mt-1">-</span>
                Existe direção clara definida
              </p>
              <p className="text-zinc-400 flex items-start gap-3">
                <span className="text-violet-500 mt-1">-</span>
                Existe base pronta para validação
              </p>
              <p className="text-zinc-400 flex items-start gap-3">
                <span className="text-violet-500 mt-1">-</span>
                A operação consegue rodar sem impulsividade
              </p>
            </div>
            <p className="text-zinc-500 mt-6 text-sm">
              Enquanto isso não for verdade, qualquer avanço é erro estratégico.
            </p>
          </div>

          {/* Section 5 - Level Progression Evaluation */}
          <div className="bg-[#0c0c10] border border-zinc-800/60 rounded-2xl p-6 md:p-8 flex flex-col">
            <h3 className="text-xl font-semibold text-white mb-4">
              Avaliação de Progressão de Nível
            </h3>
            <p className="text-zinc-300 leading-relaxed">
              Se as etapas acima estiverem bem executadas, sua operação pode estar pronta para avançar para o próximo nível operacional.
            </p>
            <p className="text-zinc-500 text-sm mt-4 leading-relaxed">
              O avanço para o <span className="text-zinc-400">PRO VÉRTEBRA™</span> não é automático. Ele só faz sentido quando a base está sólida e validada.
            </p>
            
            <div className="mt-auto pt-6 border-t border-zinc-800/60">
              <a
                href={buttonLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl gap-2 transition-colors duration-200">
                  <MessageCircle className="w-4 h-4" />
                  {buttonLabel}
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
