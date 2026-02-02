import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session || (session.role !== "ADMIN" && session.role !== "Administrador")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const { name, email, password, role, client_id } = body

  if (!name || !email) {
    return NextResponse.json({ error: "Nome e email sao obrigatorios" }, { status: 400 })
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Email invalido" }, { status: 400 })
  }

  // Validate password length if provided
  if (password && password.length < 6) {
    return NextResponse.json({ error: "A senha deve ter no minimo 6 caracteres" }, { status: 400 })
  }

  try {
    // Check if email already exists for another user
    const existing = await sql`SELECT id FROM users WHERE email = ${email} AND id <> ${id}`
    if (existing.length > 0) {
      return NextResponse.json({ error: "Este email ja esta em uso" }, { status: 400 })
    }

    // Get role_id if role is provided
    let roleId = null
    if (role) {
      const roleResult = await sql`SELECT id FROM roles WHERE name = ${role}`
      roleId = roleResult.length > 0 ? roleResult[0].id : null
    }

    // Determine if this is an admin role (that doesn't need a client)
    const rolesWithoutClient = ["ADMIN", "Administrador", "Nexus Growth"]
    const isRoleWithoutClient = rolesWithoutClient.includes(role)
    const userClientId = isRoleWithoutClient ? null : (client_id !== undefined ? client_id : null)

    let result
    if (password) {
      const password_hash = await bcrypt.hash(password, 10)
      result = await sql`
        UPDATE users 
        SET name = ${name}, email = ${email}, password_hash = ${password_hash}, role = ${role}, role_id = ${roleId}, client_id = ${userClientId}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING id, client_id, name, email, role, role_id, created_at, updated_at
      `
    } else {
      result = await sql`
        UPDATE users 
        SET name = ${name}, email = ${email}, role = ${role}, role_id = ${roleId}, client_id = ${userClientId}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING id, client_id, name, email, role, role_id, created_at, updated_at
      `
    }

    if (result.length === 0) {
      return NextResponse.json({ error: "Usuario nao encontrado" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Falha ao atualizar usuario" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session || (session.role !== "ADMIN" && session.role !== "Administrador")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    // Don't allow deleting yourself
    if (session.userId === id) {
      return NextResponse.json({ error: "Voce nao pode excluir sua propria conta" }, { status: 400 })
    }

    const result = await sql`
      DELETE FROM users WHERE id = ${id} RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Usuario nao encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Falha ao excluir usuario" }, { status: 500 })
  }
}
