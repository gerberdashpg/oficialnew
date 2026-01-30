import { NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const clientId = formData.get("client_id") as string

    if (!file || !clientId) {
      return NextResponse.json({ error: "Arquivo e ID do cliente são obrigatórios" }, { status: 400 })
    }

    // Upload to Vercel Blob
    const blob = await put(`client-logos/${clientId}-${Date.now()}.${file.name.split('.').pop()}`, file, {
      access: "public",
    })

    // Update client in database
    await sql`
      UPDATE clients 
      SET logo_url = ${blob.url}, updated_at = NOW()
      WHERE id = ${clientId}
    `

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("Error uploading logo:", error)
    return NextResponse.json({ error: "Erro ao fazer upload da logo" }, { status: 500 })
  }
}
