import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"

// Template ADB - Acessos padrão com suas URLs e ícones
const ADB_TEMPLATES = [
  {
    service_name: "Appmax",
    service_url: "https://admin.appmax.com.br",
    icon_url: "https://yp5i3m1kzldajyyg.public.blob.vercel-storage.com/accesses/appmax-icon-IzYZaVKJBdYHKXcWqtRhSL0OfFhCSH.jpg"
  },
  {
    service_name: "DSers",
    service_url: "https://www.dsers.com",
    icon_url: "https://yp5i3m1kzldajyyg.public.blob.vercel-storage.com/accesses/dsers-icon-4cBVVwLJLWOq4Gs44oH9V3sHaWgOl7.png"
  },
  {
    service_name: "Gmail",
    service_url: "https://mail.google.com",
    icon_url: "https://yp5i3m1kzldajyyg.public.blob.vercel-storage.com/accesses/gmail-icon-nOZLh5pKLjuMrBMbNMCLW0TVWN73LN.png"
  },
  {
    service_name: "Hostinger",
    service_url: "https://www.hostinger.com.br",
    icon_url: "https://yp5i3m1kzldajyyg.public.blob.vercel-storage.com/accesses/hostinger-icon-BPgRvlBKKB4pJdK17FUMa8b2IhC9uT.png"
  },
  {
    service_name: "HyperSKU",
    service_url: "https://www.hypersku.com",
    icon_url: "https://yp5i3m1kzldajyyg.public.blob.vercel-storage.com/accesses/hypersku-icon-nzUABfVcw7vPgMpVU7WKfkxNaUqNqY.jpg"
  },
  {
    service_name: "Shopify",
    service_url: "https://admin.shopify.com",
    icon_url: "https://yp5i3m1kzldajyyg.public.blob.vercel-storage.com/accesses/shopify-icon-OVqxuuNqFFwBkOqKxcZtmHDl2oS9nt.png"
  },
  {
    service_name: "Yampi",
    service_url: "https://app.yampi.com.br",
    icon_url: "https://yp5i3m1kzldajyyg.public.blob.vercel-storage.com/accesses/yampi-icon-G3Rqk2PB5M7QQPtcfxMXgXmM2HCePS.jpg"
  }
]

export async function GET() {
  const session = await getSession()

  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json({ templates: ADB_TEMPLATES })
}

export async function POST(request: Request) {
  const session = await getSession()

  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { client_id } = await request.json()

    if (!client_id) {
      return NextResponse.json(
        { error: "client_id é obrigatório" },
        { status: 400 }
      )
    }

    // Verificar se o cliente existe
    const clientCheck = await sql`SELECT id FROM clients WHERE id = ${client_id}`
    if (clientCheck.length === 0) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      )
    }

    // Inserir todos os acessos ADB para o cliente
    const insertedAccesses = []
    for (const template of ADB_TEMPLATES) {
      const result = await sql`
        INSERT INTO accesses (client_id, service_name, service_url, login, password, icon_url)
        VALUES (${client_id}, ${template.service_name}, ${template.service_url}, '', '', ${template.icon_url})
        RETURNING *
      `
      insertedAccesses.push(result[0])
    }

    return NextResponse.json({ 
      message: `${insertedAccesses.length} acessos ADB criados com sucesso`,
      accesses: insertedAccesses 
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating ADB accesses:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
