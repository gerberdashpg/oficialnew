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
  const { service_name, login, password, service_url, notes } = body

  try {
    const result = await sql`
      UPDATE accesses 
      SET service_name = ${service_name}, login = ${login}, password = ${password}, 
          service_url = ${service_url || null}, notes = ${notes || null}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Access not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating access:", error)
    return NextResponse.json({ error: "Failed to update access" }, { status: 500 })
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
      DELETE FROM accesses WHERE id = ${id} RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Access not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting access:", error)
    return NextResponse.json({ error: "Failed to delete access" }, { status: 500 })
  }
}
