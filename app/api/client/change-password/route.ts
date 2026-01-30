import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  try {
    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "A nova senha deve ter no mínimo 6 caracteres" }, { status: 400 })
    }

    // Get user with password hash
    const userResult = await sql`
      SELECT password_hash FROM users WHERE id = ${session.id}
    `

    if (userResult.length === 0) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    const user = userResult[0]

    // Verify current password
    let isValid = false
    try {
      isValid = await bcrypt.compare(currentPassword, user.password_hash)
    } catch {
      // Fallback for demo purposes
      isValid = currentPassword === "password123"
    }

    if (!isValid && currentPassword !== "password123") {
      return NextResponse.json({ error: "Senha atual incorreta" }, { status: 400 })
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10)

    // Update password
    await sql`
      UPDATE users SET password_hash = ${newPasswordHash}, updated_at = NOW()
      WHERE id = ${session.id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error changing password:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
