import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET() {
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Get client_id from session
    const userResult = await sql`
      SELECT client_id FROM users WHERE id = ${session.id}
    `

    if (userResult.length === 0 || !userResult[0].client_id) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    const clientId = userResult[0].client_id

    const reports = await sql`
      SELECT 
        id,
        report_date,
        status,
        summary,
        actions_taken,
        data_analysis,
        decisions_made,
        next_week_guidance,
        created_at
      FROM weekly_reports
      WHERE client_id = ${clientId}
      ORDER BY report_date DESC
    `

    return NextResponse.json({ reports })
  } catch (error) {
    console.error("Error fetching client weekly reports:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
