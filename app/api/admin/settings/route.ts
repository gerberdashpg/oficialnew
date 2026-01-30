import { getSession } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const session = await getSession()
    
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 })
    }

    // Buscar todos os links
    const links = await sql`
      SELECT id, link_key, link_url, label, description, created_at, updated_at
      FROM plan_upgrade_links
      ORDER BY created_at DESC
    `

    return NextResponse.json(links)
  } catch (error) {
    console.error("Erro ao buscar configuracoes:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 })
    }

    const { link_key, link_url, label, description } = await request.json()

    if (!link_key || !link_url || !label) {
      return NextResponse.json({ error: "link_key, link_url e label são obrigatórios" }, { status: 400 })
    }

    // Check if link_key already exists
    const existing = await sql`
      SELECT id FROM plan_upgrade_links WHERE link_key = ${link_key}
    `

    if (existing.length > 0) {
      return NextResponse.json({ error: "Já existe um botão com esse identificador" }, { status: 400 })
    }

    // Insert new link
    const result = await sql`
      INSERT INTO plan_upgrade_links (id, link_key, link_url, label, description, created_at, updated_at)
      VALUES (gen_random_uuid(), ${link_key}, ${link_url}, ${label}, ${description || null}, NOW(), NOW())
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Erro ao criar botão:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession()
    
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 })
    }

    const { link_url, label, description } = await request.json()

    if (!link_url || !label) {
      return NextResponse.json({ error: "link_url e label são obrigatórios" }, { status: 400 })
    }

    const result = await sql`
      UPDATE plan_upgrade_links 
      SET link_url = ${link_url}, label = ${label}, description = ${description || null}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Botão não encontrado" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Erro ao atualizar botão:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession()
    
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 })
    }

    await sql`DELETE FROM plan_upgrade_links WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao excluir botão:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
