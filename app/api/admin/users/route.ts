import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function GET() {
  const session = await getSession()
  const adminRoles = ["ADMIN", "Administrador", "Nexus Growth"]
  if (!session || !adminRoles.includes(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const users = await sql`
      SELECT id, client_id, name, email, role, avatar_url, created_at
      FROM users
      ORDER BY created_at DESC
    `
    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getSession()
  
  // Only ADMIN can create users (Nexus Growth can only view)
  const createRoles = ["ADMIN", "Administrador"]
  if (!session || !createRoles.includes(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { client_id, name, email, password, role } = body

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Preencha todos os campos obrigatorios" }, { status: 400 })
  }

  if (!role) {
    return NextResponse.json({ error: "Selecione uma role para o usuario" }, { status: 400 })
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Email invalido" }, { status: 400 })
  }

  // Validate password length
  if (password.length < 6) {
    return NextResponse.json({ error: "A senha deve ter no minimo 6 caracteres" }, { status: 400 })
  }

  // If role is not admin, client_id might be needed
  const isAdminRole = role === "ADMIN" || role === "Administrador"

  try {
    // Check if email already exists
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`
    if (existing.length > 0) {
      return NextResponse.json({ error: "Este email ja esta em uso" }, { status: 400 })
    }

    // Get role_id if it exists
    const roleResult = await sql`SELECT id FROM roles WHERE name = ${role}`
    const roleId = roleResult.length > 0 ? roleResult[0].id : null

    const password_hash = await bcrypt.hash(password, 10)
    const userRole = role || "Cliente"
    const userClientId = isAdminRole ? null : (client_id || null)
    
    const result = await sql`
      INSERT INTO users (client_id, name, email, password_hash, role, role_id)
      VALUES (${userClientId}, ${name}, ${email}, ${password_hash}, ${userRole}, ${roleId})
      RETURNING id, client_id, name, email, role, role_id, created_at
    `

    return NextResponse.json({ user: result[0] }, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Falha ao criar usuario" }, { status: 500 })
  }
}
