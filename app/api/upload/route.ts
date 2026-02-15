import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { v2 as cloudinary } from "cloudinary"

if (process.env.CLOUDINARY_URL) {
  // cloudinary is automatically configured from CLOUDINARY_URL
} else if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
}

function ensureUploads() {
  const dir = path.join(process.cwd(), "public", "uploads")
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  return dir
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { filename, dataUrl } = body
    if (!filename || !dataUrl) return NextResponse.json({ error: "Missing" }, { status: 400 })

    // If Cloudinary configured, upload there
    // validate dataUrl (mime & size)
    const match = dataUrl.match(/^data:(.+);base64,(.*)$/)
    if (!match) return NextResponse.json({ error: "Invalid dataUrl" }, { status: 400 })
    const [, mime, b64] = match

    const ALLOWED = ["image/jpeg", "image/png", "image/webp"]
    if (!ALLOWED.includes(mime.toLowerCase())) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 415 })
    }

    const buffer = Buffer.from(b64, "base64")
    const MAX_BYTES = Number(process.env.UPLOAD_MAX_BYTES || 5 * 1024 * 1024) // default 5MB
    if (buffer.length > MAX_BYTES) {
      return NextResponse.json({ error: "File too large", maxBytes: MAX_BYTES }, { status: 413 })
    }

    // If Cloudinary configured, upload there
    if (process.env.CLOUDINARY_URL || process.env.CLOUDINARY_CLOUD_NAME) {
      const res = await cloudinary.uploader.upload(dataUrl, {
        folder: "otobilir",
        public_id: `${Date.now()}-${filename.replace(/[^a-z0-9]/gi, "_")}`,
        overwrite: false,
        resource_type: "image",
      })
      return NextResponse.json({ url: res.secure_url })
    }

    const ext = mime.split("/")[1] || "png"
    const safeName = `${Date.now()}-${filename.replace(/[^a-z0-9.-]/gi, "_")}.${ext}`
    const dir = ensureUploads()
    const filePath = path.join(dir, safeName)
    fs.writeFileSync(filePath, buffer)
    const publicPath = `/uploads/${safeName}`
    return NextResponse.json({ url: publicPath })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

