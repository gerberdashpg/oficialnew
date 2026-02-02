import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()

  // Nexus Growth can edit operation steps
  const adminRoles = ["ADMIN", "Administrador", "Nexus Growth"]
  if (!session || !adminRoles.includes(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const { order_index, title, description, status, due_date } = await request.json()

    // If status changed to completed, set completed_at
    const completed_at = status === 'completed' ? new Date().toISOString() : null

    const result = await sql`
      UPDATE operation_steps SET
        order_index = COALESCE(${order_index}, order_index),
        title = COALESCE(${title}, title),
        description = COALESCE(${description}, description),
        status = COALESCE(${status}, status),
        due_date = ${due_date || null},
        completed_at = ${status === 'completed' ? completed_at : null},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Step not found" }, { status: 404 })
    }

    return NextResponse.json({ step: result[0] })
  } catch (error) {
    console.error("Error updating operation step:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()

  // Nexus Growth can delete operation steps
  const adminRoles = ["ADMIN", "Administrador", "Nexus Growth"]
  if (!session || !adminRoles.includes(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    await sql`DELETE FROM operation_steps WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting operation step:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
