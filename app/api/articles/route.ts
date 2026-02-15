import { NextResponse } from "next/server"
import { listArticles } from "@/lib/articles"

export async function GET() {
  return NextResponse.json(listArticles())
}

