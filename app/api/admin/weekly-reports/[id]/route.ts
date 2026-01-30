import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET(
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
      SELECT 
        wr.*,
        c.name as client_name,
        c.slug as client_slug
      FROM weekly_reports wr
      JOIN clients c ON wr.client_id = c.id
      WHERE wr.id = ${id}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    return NextResponse.json({ report: result[0] })
  } catch (error) {
    console.error("Error fetching weekly report:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()

  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const { 
      report_date, 
      status, 
      summary, 
      actions_taken, 
      data_analysis, 
      decisions_made, 
      next_week_guidance 
    } = await request.json()

    const result = await sql`
      UPDATE weekly_reports
      SET 
        report_date = COALESCE(${report_date}, report_date),
        status = COALESCE(${status}, status),
        summary = COALESCE(${summary}, summary),
        actions_taken = COALESCE(${actions_taken}, actions_taken),
        data_analysis = COALESCE(${data_analysis}, data_analysis),
        decisions_made = COALESCE(${decisions_made}, decisions_made),
        next_week_guidance = COALESCE(${next_week_guidance}, next_week_guidance),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    return NextResponse.json({ report: result[0] })
  } catch (error) {
    console.error("Error updating weekly report:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
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
      DELETE FROM weekly_reports WHERE id = ${id} RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting weekly report:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
