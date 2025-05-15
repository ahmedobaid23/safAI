import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
    try {
        // List all files in the gallery bucket
        const { data, error } = await supabase.storage.from("gallery").list()

        if (error) {
            console.error("Supabase storage error:", error)
            return NextResponse.json({ error: "Failed to fetch gallery images" }, { status: 500 })
        }

        // Filter for image files only
        const imageFiles = data.filter((file) => file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i))

        // Get public URLs for each image
        const urls = imageFiles.map((file) => supabase.storage.from("gallery").getPublicUrl(file.name).data.publicUrl)

        return NextResponse.json({ urls })
    } catch (error) {
        console.error("Error in gallery API route:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
