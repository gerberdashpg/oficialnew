import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const result = await sql`
      SELECT step_id, link_type, link_url, link_label
      FROM plan_step_links 
      ORDER BY step_id ASC
    `
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching step links:", error)
    return NextResponse.json([])
  }
}
