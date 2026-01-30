import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const plan = searchParams.get("plan")?.toLowerCase()

    if (!plan) {
      return NextResponse.json({ error: "Plan is required" }, { status: 400 })
    }

    const linkKey = `atendente_${plan}`

    const result = await sql`
      SELECT link_url, label
      FROM plan_upgrade_links
      WHERE link_key = ${linkKey}
      LIMIT 1
    `
    
    if (result.length > 0) {
      return NextResponse.json({
        link_url: result[0].link_url,
        label: result[0].label
      })
    }

    return NextResponse.json({
      link_url: "https://wa.me/5511999999999",
      label: "Falar com um atendente"
    })
  } catch (error) {
    console.error("Erro ao buscar link:", error)
    return NextResponse.json({
      link_url: "https://wa.me/5511999999999",
      label: "Falar com um atendente"
    })
  }
}
