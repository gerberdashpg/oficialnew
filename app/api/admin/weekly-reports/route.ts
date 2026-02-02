import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET() {
  const session = await getSession()

  const adminRoles = ["ADMIN", "Administrador", "Nexus Growth"]
  if (!session || !adminRoles.includes(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const reports = await sql`
      SELECT 
        wr.*,
        c.name as client_name,
        c.slug as client_slug
      FROM weekly_reports wr
      JOIN clients c ON wr.client_id = c.id
      ORDER BY wr.report_date DESC
    `

    return NextResponse.json({ reports })
  } catch (error) {
    console.error("Error fetching weekly reports:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getSession()

  const adminRoles = ["ADMIN", "Administrador", "Nexus Growth"]
  if (!session || !adminRoles.includes(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { 
      client_id, 
      report_date, 
      status, 
      summary, 
      actions_taken, 
      data_analysis, 
      decisions_made, 
      next_week_guidance 
    } = await request.json()

    if (!client_id || !report_date || !status || !summary) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando" },
        { status: 400 }
      )
    }

    const result = await sql`
      INSERT INTO weekly_reports (
        client_id, 
        report_date, 
        status, 
        summary, 
        actions_taken, 
        data_analysis, 
        decisions_made, 
        next_week_guidance
      )
      VALUES (
        ${client_id}, 
        ${report_date}, 
        ${status}, 
        ${summary}, 
        ${actions_taken || null}, 
        ${data_analysis || null}, 
        ${decisions_made || null}, 
        ${next_week_guidance || null}
      )
      RETURNING *
    `

    return NextResponse.json({ report: result[0] }, { status: 201 })
  } catch (error) {
    console.error("Error creating weekly report:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
