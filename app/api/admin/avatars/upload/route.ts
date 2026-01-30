import { getSession } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"
import { put, del } from "@vercel/blob"
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
    const entityType = formData.get("entityType") as string // "client" or "user"
    const entityId = formData.get("entityId") as string

    if (!file || !entityType || !entityId) {
      return NextResponse.json({ error: "Arquivo, tipo e ID são obrigatórios" }, { status: 400 })
    }

    // Validate entity type
    if (!["client", "user"].includes(entityType)) {
      return NextResponse.json({ error: "Tipo inválido" }, { status: 400 })
    }

    // Get current avatar URL to delete old one
    let currentAvatarUrl: string | null = null
    
    if (entityType === "client") {
      const result = await sql`SELECT logo_url FROM clients WHERE id = ${entityId}`
      currentAvatarUrl = result[0]?.logo_url
    } else {
      const result = await sql`SELECT avatar_url FROM users WHERE id = ${entityId}`
      currentAvatarUrl = result[0]?.avatar_url
    }

    // Delete old avatar if exists
    if (currentAvatarUrl && currentAvatarUrl.includes("blob.vercel-storage.com")) {
      try {
        await del(currentAvatarUrl)
      } catch (e) {
        console.error("Failed to delete old avatar:", e)
      }
    }

    // Upload new avatar
    const blob = await put(`avatars/${entityType}/${entityId}-${Date.now()}.${file.name.split('.').pop()}`, file, {
      access: "public",
    })

    // Update database
    if (entityType === "client") {
      await sql`UPDATE clients SET logo_url = ${blob.url}, updated_at = NOW() WHERE id = ${entityId}`
    } else {
      await sql`UPDATE users SET avatar_url = ${blob.url}, updated_at = NOW() WHERE id = ${entityId}`
    }

    return NextResponse.json({ 
      success: true, 
      avatar_url: blob.url 
    })
  } catch (error) {
    console.error("Erro ao fazer upload do avatar:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession()
    
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 })
    }

    const { entityType, entityId } = await request.json()

    if (!entityType || !entityId) {
      return NextResponse.json({ error: "Tipo e ID são obrigatórios" }, { status: 400 })
    }

    // Get current avatar URL
    let currentAvatarUrl: string | null = null
    
    if (entityType === "client") {
      const result = await sql`SELECT logo_url FROM clients WHERE id = ${entityId}`
      currentAvatarUrl = result[0]?.logo_url
    } else {
      const result = await sql`SELECT avatar_url FROM users WHERE id = ${entityId}`
      currentAvatarUrl = result[0]?.avatar_url
    }

    // Delete from blob storage
    if (currentAvatarUrl && currentAvatarUrl.includes("blob.vercel-storage.com")) {
      try {
        await del(currentAvatarUrl)
      } catch (e) {
        console.error("Failed to delete avatar:", e)
      }
    }

    // Update database
    if (entityType === "client") {
      await sql`UPDATE clients SET logo_url = NULL, updated_at = NOW() WHERE id = ${entityId}`
    } else {
      await sql`UPDATE users SET avatar_url = NULL, updated_at = NOW() WHERE id = ${entityId}`
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao remover avatar:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
