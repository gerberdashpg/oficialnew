import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function POST(request: Request) {
  const session = await getSession()

  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { client_id, order_index, title, description, status, due_date } = await request.json()

    if (!client_id || !title || !description) {
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO operation_steps (client_id, order_index, title, description, status, due_date)
      VALUES (
        ${client_id}, 
        ${order_index || 1}, 
        ${title}, 
        ${description}, 
        ${status || 'pending'}, 
        ${due_date || null}
      )
      RETURNING *
    `

    return NextResponse.json({ step: result[0] }, { status: 201 })
  } catch (error) {
    console.error("Error creating operation step:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
