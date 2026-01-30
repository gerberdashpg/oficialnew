import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const { title, message, priority, is_read, is_recurring, recurrence_days, is_active } = body

  try {
    // If only toggling is_active
    if (is_active !== undefined && title === undefined) {
      const result = await sql`
        UPDATE notices 
        SET is_active = ${is_active}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `
      if (result.length === 0) {
        return NextResponse.json({ error: "Notice not found" }, { status: 404 })
      }
      return NextResponse.json(result[0])
    }

    // Calculate next_send_at if recurring
    const nextSendAt = is_recurring 
      ? new Date(Date.now() + (recurrence_days || 7) * 24 * 60 * 60 * 1000).toISOString()
      : null

    const result = await sql`
      UPDATE notices 
      SET title = ${title}, message = ${message}, priority = ${priority || 'normal'}, 
          is_read = ${is_read || false}, is_recurring = ${is_recurring || false},
          recurrence_days = ${recurrence_days || null}, is_active = ${is_recurring || false},
          next_send_at = ${nextSendAt}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Notice not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating notice:", error)
    return NextResponse.json({ error: "Failed to update notice" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const result = await sql`
      DELETE FROM notices WHERE id = ${id} RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Notice not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting notice:", error)
    return NextResponse.json({ error: "Failed to delete notice" }, { status: 500 })
  }
}
