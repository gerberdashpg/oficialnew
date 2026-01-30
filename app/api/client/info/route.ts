import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get("slug")

  if (!slug) {
    return NextResponse.json({ error: "Slug obrigatório" }, { status: 400 })
  }

  try {
    const result = await sql`
      SELECT id, name, slug, plan, whatsapp_link, drive_link 
      FROM clients 
      WHERE slug = ${slug}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching client:", error)
    return NextResponse.json({ error: "Erro ao buscar cliente" }, { status: 500 })
  }
}
