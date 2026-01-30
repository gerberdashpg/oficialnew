import { put, del } from "@vercel/blob"
import { getSession } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const session = await getSession()
    
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const accessId = formData.get("accessId") as string

    if (!file || !accessId) {
      return NextResponse.json({ error: "Arquivo e accessId são obrigatórios" }, { status: 400 })
    }

    // Get current icon to delete it later
    const currentAccess = await sql`
      SELECT icon_url FROM accesses WHERE id = ${accessId}
    `

    // Upload new icon to Vercel Blob
    const blob = await put(`access-icons/${accessId}-${Date.now()}-${file.name}`, file, {
      access: "public",
    })

    // Update database with new icon URL
    await sql`
      UPDATE accesses SET icon_url = ${blob.url} WHERE id = ${accessId}
    `

    // Delete old icon if exists
    if (currentAccess[0]?.icon_url) {
      try {
        await del(currentAccess[0].icon_url)
      } catch (e) {
        // Ignore deletion errors
      }
    }

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("Erro ao fazer upload do ícone:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession()
    
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const accessId = searchParams.get("accessId")

    if (!accessId) {
      return NextResponse.json({ error: "accessId é obrigatório" }, { status: 400 })
    }

    // Get current icon URL
    const currentAccess = await sql`
      SELECT icon_url FROM accesses WHERE id = ${accessId}
    `

    if (currentAccess[0]?.icon_url) {
      // Delete from Blob
      try {
        await del(currentAccess[0].icon_url)
      } catch (e) {
        // Ignore deletion errors
      }

      // Clear from database
      await sql`
        UPDATE accesses SET icon_url = NULL WHERE id = ${accessId}
      `
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao remover ícone:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
