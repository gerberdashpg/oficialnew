import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const clientId = searchParams.get("client_id")

  if (!clientId) {
    return NextResponse.json({ error: "Client ID required" }, { status: 400 })
  }

  try {
    const result = await sql`
      SELECT step_id, status, completed_at, updated_at 
      FROM client_step_progress
      WHERE client_id = ${clientId}
      ORDER BY step_id ASC
    `
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching progress:", error)
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  const session = await getSession()

  if (!session || session.role !== "ADMIN") {
    console.log("[v0] Unauthorized - session:", session?.role)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    console.log("[v0] POST body received:", JSON.stringify(body))
    
    const { client_id, step_id, status } = body

    if (!client_id || !step_id || !status) {
      console.log("[v0] Missing fields - client_id:", client_id, "step_id:", step_id, "status:", status)
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const completedAt = status === 'completed' ? new Date().toISOString() : null
    console.log("[v0] Executing upsert for client:", client_id, "step:", step_id, "status:", status)

    // Upsert - insert or update
    const result = await sql`
      INSERT INTO client_step_progress (client_id, step_id, status, completed_at, updated_at)
      VALUES (${client_id}, ${step_id}, ${status}, ${completedAt}, NOW())
      ON CONFLICT (client_id, step_id) 
      DO UPDATE SET 
        status = ${status},
        completed_at = ${completedAt},
        updated_at = NOW()
      RETURNING *
    `

    console.log("[v0] Upsert result:", JSON.stringify(result))
    return NextResponse.json({ success: true, data: result[0] })
  } catch (error) {
    console.error("[v0] Error updating progress:", error)
    return NextResponse.json({ error: "Internal server error", details: String(error) }, { status: 500 })
  }
}
