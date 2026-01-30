import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET(request: Request) {
  const session = await getSession()

  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get("client_id")

    let accesses
    if (clientId) {
      accesses = await sql`
        SELECT a.*, c.name as client_name, c.slug as client_slug, c.logo_url as client_logo_url
        FROM accesses a
        JOIN clients c ON a.client_id = c.id
        WHERE a.client_id = ${clientId}
        ORDER BY a.created_at DESC
      `
    } else {
      accesses = await sql`
        SELECT a.*, c.name as client_name, c.slug as client_slug, c.logo_url as client_logo_url
        FROM accesses a
        JOIN clients c ON a.client_id = c.id
        ORDER BY a.created_at DESC
      `
    }

    return NextResponse.json({ accesses })
  } catch (error) {
    console.error("Error fetching accesses:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getSession()

  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { client_id, service_name, service_url, login, password } = await request.json()

    if (!client_id || !service_name || !login || !password) {
      return NextResponse.json(
        { error: "Campos obrigatorios faltando" },
        { status: 400 }
      )
    }

    const result = await sql`
      INSERT INTO accesses (client_id, service_name, service_url, login, password)
      VALUES (${client_id}, ${service_name}, ${service_url || null}, ${login}, ${password})
      RETURNING *
    `

    return NextResponse.json({ access: result[0] }, { status: 201 })
  } catch (error) {
    console.error("Error creating access:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
