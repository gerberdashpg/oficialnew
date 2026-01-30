import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function POST(request: Request) {
  const session = await getSession()

  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { client_id, title, message, priority, is_recurring, recurrence_days } = await request.json()

    if (!client_id || !title || !message) {
      return NextResponse.json(
        { error: "Campos obrigatorios faltando" },
        { status: 400 }
      )
    }

    // Calculate next_send_at if recurring
    const nextSendAt = is_recurring 
      ? new Date(Date.now() + (recurrence_days || 7) * 24 * 60 * 60 * 1000).toISOString()
      : null

    const result = await sql`
      INSERT INTO notices (client_id, title, message, priority, is_recurring, recurrence_days, is_active, next_send_at, last_sent_at)
      VALUES (${client_id}, ${title}, ${message}, ${priority || 'normal'}, ${is_recurring || false}, ${recurrence_days || null}, ${is_recurring || false}, ${nextSendAt}, ${is_recurring ? new Date().toISOString() : null})
      RETURNING *
    `

    return NextResponse.json({ notice: result[0] }, { status: 201 })
  } catch (error) {
    console.error("Error creating notice:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
