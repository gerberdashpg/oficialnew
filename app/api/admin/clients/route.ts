import { NextResponse } from "next/server"
import { getSession, hashPassword } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET() {
  const session = await getSession()

  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const clients = await sql`
      SELECT 
        c.*,
        (SELECT COUNT(*) FROM users WHERE client_id = c.id) as user_count,
        (SELECT COUNT(*) FROM accesses WHERE client_id = c.id) as access_count
      FROM clients c
      ORDER BY c.created_at DESC
    `

    return NextResponse.json({ clients })
  } catch (error) {
    console.error("Error fetching clients:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getSession()

  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { 
      name, 
      slug, 
      plan, 
      status, 
      drive_link, 
      notes,
      userName,
      userEmail,
      userPassword 
    } = await request.json()

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Nome e slug sao obrigatorios" },
        { status: 400 }
      )
    }

    if (!userEmail || !userPassword) {
      return NextResponse.json(
        { error: "Email e senha do usuario sao obrigatorios" },
        { status: 400 }
      )
    }

    if (userPassword.length < 6) {
      return NextResponse.json(
        { error: "A senha deve ter pelo menos 6 caracteres" },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingSlug = await sql`SELECT id FROM clients WHERE slug = ${slug}`
    if (existingSlug.length > 0) {
      return NextResponse.json(
        { error: "Ja existe um cliente com esse slug" },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingEmail = await sql`SELECT id FROM users WHERE email = ${userEmail}`
    if (existingEmail.length > 0) {
      return NextResponse.json(
        { error: "Ja existe um usuario com esse email" },
        { status: 400 }
      )
    }

    // Create client
    const clientResult = await sql`
      INSERT INTO clients (name, slug, plan, status, drive_link, notes)
      VALUES (${name}, ${slug}, ${plan || 'START'}, ${status || 'ONBOARDING'}, ${drive_link || null}, ${notes || null})
      RETURNING *
    `

    const client = clientResult[0]

    // Hash password and create user
    const passwordHash = await hashPassword(userPassword)
    
    await sql`
      INSERT INTO users (name, email, password_hash, role, client_id)
      VALUES (${userName || name + ' Admin'}, ${userEmail}, ${passwordHash}, 'CLIENTE', ${client.id})
    `

    return NextResponse.json({ client }, { status: 201 })
  } catch (error) {
    console.error("Error creating client:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
