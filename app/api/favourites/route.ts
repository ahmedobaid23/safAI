import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "../../../lib/prisma"

// Get all favorites for the current user
export async function GET() {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ favourites: [] })
        }

        const favourites = await prisma.favorite.findMany({
            where: {
                userId,
            },
        })

        // Return complete favorite objects
        return NextResponse.json({ favourites }, { status: 200 })
    } catch (error) {
        console.error("Error fetching favourites:", error)
        return NextResponse.json({ favourites: [] })
    }
}

// Add a new favorite
export async function POST(request: Request) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const blog = await request.json()

        // Create new favourite
        const favourite = await prisma.favorite.create({
            data: {
                userId,
                blogId: blog.url, // Using URL as the blogId
                title: blog.title,
                description: blog.description,
                url: blog.url,
                urlToImage: blog.urlToImage,
                sourceName: blog.source?.name,
                author: blog.author,
                publishedAt: blog.publishedAt,
            },
        })

        // Return the complete favorite object
        return NextResponse.json({ favourite }, { status: 200 })
    } catch (error) {
        console.error("Error adding favourite:", error)
        return NextResponse.json(
            {
                error: "Failed to add favourite",
            },
            { status: 500 },
        )
    }
}

// Handle DELETE requests in the same file
export async function DELETE(request: Request) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { url } = await request.json()

        await prisma.favorite.deleteMany({
            where: {
                userId,
                url,
            },
        })

        return NextResponse.json({ message: "Favorite removed successfully" }, { status: 200 })
    } catch (error) {
        console.error("Error removing favorite:", error)
        return NextResponse.json({ error: "Failed to remove favorite" }, { status: 500 })
    }
}
